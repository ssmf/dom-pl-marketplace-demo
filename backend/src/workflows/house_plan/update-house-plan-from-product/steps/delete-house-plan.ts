import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { HOUSE_PLAN_MODULE } from "../../../../modules/house_plan"
import HousePlanModuleService from "../../../../modules/house_plan/service"

type DeleteHousePlanStepInput = {
  id: string
}

export const deleteHousePlanStep = createStep(
  "delete-house-plan",
  async (input: DeleteHousePlanStepInput, { container }) => {
    const housePlanModuleService: HousePlanModuleService = container.resolve(HOUSE_PLAN_MODULE)

    // Fetch existing data for compensation
    const existingHousePlan = await housePlanModuleService.retrieveHousePlan(input.id)

    await housePlanModuleService.deleteHousePlans(input.id)

    return new StepResponse(input.id, existingHousePlan)
  },
  async (existingHousePlan, { container }) => {
    if (!existingHousePlan) {
      return
    }

    const housePlanModuleService: HousePlanModuleService = container.resolve(HOUSE_PLAN_MODULE)
    await housePlanModuleService.createHousePlans(existingHousePlan)
  }
)
