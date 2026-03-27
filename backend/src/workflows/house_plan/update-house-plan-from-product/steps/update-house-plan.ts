import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { HOUSE_PLAN_MODULE } from "../../../../modules/house_plan"
import HousePlanModuleService from "../../../../modules/house_plan/service"

type UpdateHousePlanStepInput = {
  id: string
  data: any
}

export const updateHousePlanStep = createStep(
  "update-house-plan",
  async (input: UpdateHousePlanStepInput, { container }) => {
    const housePlanModuleService: HousePlanModuleService = container.resolve(HOUSE_PLAN_MODULE)

    // Fetch existing data for compensation
    const existingHousePlan = await housePlanModuleService.retrieveHousePlan(input.id)

    const updated = await housePlanModuleService.updateHousePlans({ id: input.id, ...input.data })

    return new StepResponse(updated, existingHousePlan)
  },
  async (existingHousePlan, { container }) => {
    if (!existingHousePlan) {
      return
    }

    const housePlanModuleService: HousePlanModuleService = container.resolve(HOUSE_PLAN_MODULE)
    await housePlanModuleService.updateHousePlans(existingHousePlan)
  }
)
