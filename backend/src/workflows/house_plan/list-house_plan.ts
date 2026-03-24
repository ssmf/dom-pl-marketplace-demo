import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { HOUSE_PLAN_MODULE } from "../../modules/house_plan"
import HousePlanModuleService from "../../modules/house_plan/service"

const listHousePlansStep = createStep(
  "list-house-plans-step",
  async (_, { container }) => {
    const housePlanService: HousePlanModuleService =
      container.resolve(HOUSE_PLAN_MODULE)

    const housePlans = await housePlanService.listHousePlans()

    return new StepResponse(housePlans)
  }
)

export const listHousePlansWorkflow = createWorkflow(
  "list-house-plans",
  function () {
    const housePlans = listHousePlansStep()
    return new WorkflowResponse(housePlans)
  }
)