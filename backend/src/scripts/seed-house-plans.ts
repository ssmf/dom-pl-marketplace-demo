import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { HOUSE_PLAN_MODULE } from "../modules/house-plan"

const PLANS = [
  {
    title: "Dom Jednorodzinny Klasyczny 120",
    price: 2990,
    description:
      "Elegancki projekt domu jednorodzinnego o klasycznej bryle. Parter z otwartym salonem połączonym z jadalnią i kuchnią, gabinet oraz WC. Na piętrze trzy sypialnie, łazienka i przestronna garderoba.",
    house_area: 120,
    boiler_room_area: 8,
    rooms: 4,
    bathrooms_and_wc: 2,
    plot_dimensions: "20x30",
    min_plot_dimensions_after_adaptation: "16x25",
  },
  {
    title: "Dom Parterowy Modern 90",
    price: 2490,
    description:
      "Nowoczesny dom parterowy z płaskim dachem i dużymi przeszkleniami. Idealne rozwiązanie dla rodziny 3-4 osobowej. Otwarty salon z aneksem kuchennym, dwie sypialnie i łazienka.",
    house_area: 90,
    boiler_room_area: null,
    rooms: 3,
    bathrooms_and_wc: 1,
    plot_dimensions: "18x25",
    min_plot_dimensions_after_adaptation: "14x20",
  },
  {
    title: "Dom z Poddaszem Rustykalny 150",
    price: 3490,
    description:
      "Urokliwy dom z użytkowym poddaszem w stylu rustykalnym. Parter z przestronnym salonem, kuchnią, gabinetem i kotłownią. Poddasze z trzema sypialniami, łazienką i garderobą.",
    house_area: 150,
    boiler_room_area: 12,
    rooms: 5,
    bathrooms_and_wc: 3,
    plot_dimensions: "25x35",
    min_plot_dimensions_after_adaptation: "20x28",
  },
  {
    title: "Dom Bliźniak Ekonomiczny 80",
    price: 1990,
    description:
      "Ekonomiczny projekt segmentu bliźniaczego. Parter z salonem, kuchnią i WC. Piętro z dwiema sypialniami i łazienką. Minimalne koszty budowy przy zachowaniu funkcjonalności.",
    house_area: 80,
    boiler_room_area: null,
    rooms: 3,
    bathrooms_and_wc: 2,
    plot_dimensions: "12x20",
    min_plot_dimensions_after_adaptation: "10x18",
  },
  {
    title: "Rezydencja Premium 220",
    price: 5990,
    description:
      "Reprezentacyjna rezydencja z garażem dwustanowiskowym. Parter z holem wejściowym, salonem, jadalnią, kuchnią, gabinetem i garażem. Piętro z czterema sypialniami, dwiema łazienkami i garderobą.",
    house_area: 220,
    boiler_room_area: 15,
    rooms: 6,
    bathrooms_and_wc: 4,
    plot_dimensions: "30x40",
    min_plot_dimensions_after_adaptation: "25x35",
  },
]

export default async function seedHousePlans({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const housePlanService = container.resolve(HOUSE_PLAN_MODULE)

  logger.info("Seeding house plans...")

  const existing = await housePlanService.listHousePlans()

  if (existing.length > 0) {
    logger.info(
      `Skipping — ${existing.length} house plan(s) already exist in the database.`
    )
    return
  }

  await housePlanService.createHousePlans(PLANS)

  logger.info(`Seeded ${PLANS.length} house plans successfully.`)
}
