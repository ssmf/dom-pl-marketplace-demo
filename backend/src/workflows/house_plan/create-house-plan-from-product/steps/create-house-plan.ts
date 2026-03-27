import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { HOUSE_PLAN_MODULE } from "../../../../modules/house_plan"
import HousePlanModuleService from "../../../../modules/house_plan/service"

type CreateHousePlanStepInput = {
  house_plan?: any
}

export const createHousePlanStep = createStep(
  "create-house-plan",
  async (input: CreateHousePlanStepInput, { container }) => {
    if (!input.house_plan) {
      return new StepResponse(null, null)
    }

    const housePlanModuleService: HousePlanModuleService = container.resolve(HOUSE_PLAN_MODULE)
    const created = await housePlanModuleService.createHousePlans(input.house_plan)

    return new StepResponse(created, created.id)
  },
  async (id, { container }) => {
    if (!id) {
      return
    }

    const housePlanModuleService: HousePlanModuleService = container.resolve(HOUSE_PLAN_MODULE)
    await housePlanModuleService.deleteHousePlans(id)
  }
)
