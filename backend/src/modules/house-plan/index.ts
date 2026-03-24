import { Module } from "@medusajs/framework/utils"
import HousePlanModuleService from "./service"

export const HOUSE_PLAN_MODULE = "housePlan"

export default Module(HOUSE_PLAN_MODULE, {
  service: HousePlanModuleService,
})
