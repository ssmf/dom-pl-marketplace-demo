import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep, dismissRemoteLinkStep, useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"
import { HOUSE_PLAN_MODULE } from "../../../modules/house_plan"
import { createHousePlanStep } from "../create-house-plan-from-product/steps/create-house-plan"
import { updateHousePlanStep } from "./steps/update-house-plan"
import { deleteHousePlanStep } from "./steps/delete-house-plan"

type WorkflowInput = {
  product: { id: string }
  additional_data?: {
    house_plan?: any | null
  }
}

export const updateHousePlanFromProductWorkflow = createWorkflow(
  "update-house-plan-from-product",
  (input: WorkflowInput) => {
    const { data: queryResult } = useQueryGraphStep({
      entity: "product",
      fields: ["id", "house_plan.id"],
      filters: { id: input.product.id },
    })

    const existingHousePlanId = transform(
      { queryResult: queryResult as any },
      (data) => data.queryResult?.[0]?.house_plan?.id as string | undefined
    )

    const housePlanData = transform(
      { input },
      (data) => data.input.additional_data?.house_plan
    )

    // Condition 1: Create Branch (No existing record + house_plan data is provided)
    when({ existingHousePlanId, housePlanData }, ({ existingHousePlanId, housePlanData }) => 
      !existingHousePlanId && housePlanData != null
    ).then(() => {
      const createdHousePlan = createHousePlanStep({ house_plan: housePlanData })
      createRemoteLinkStep([{
        [Modules.PRODUCT]: {
          product_id: input.product.id,
        },
        [HOUSE_PLAN_MODULE]: {
          house_plan_id: createdHousePlan.id,
        },
      }])
    })

    // Condition 2: Delete Branch (Existing record + house_plan data is explicitly nullish/empty)
    when({ existingHousePlanId, housePlanData }, ({ existingHousePlanId, housePlanData }) => 
      !!existingHousePlanId && housePlanData === null
    ).then(() => {
      deleteHousePlanStep({ id: existingHousePlanId })
      dismissRemoteLinkStep({
        [Modules.PRODUCT]: {
          product_id: input.product.id,
        },
        [HOUSE_PLAN_MODULE]: {
          house_plan_id: existingHousePlanId,
        },
      })
    })

    // Condition 3: Update Branch (Existing record + house_plan data provided)
    when({ existingHousePlanId, housePlanData }, ({ existingHousePlanId, housePlanData }) => 
      !!existingHousePlanId && housePlanData != null
    ).then(() => {
      updateHousePlanStep({ id: existingHousePlanId, data: housePlanData })
    })

    return new WorkflowResponse({})
  }
)
