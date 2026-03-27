import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows";

export default async function updateRegion({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  });

  if (!regions.length) {
    logger.info("No regions found to update.");
    return;
  }

  const region = regions[0];
  
  logger.info(`Updating region ${region.name} (${region.id})...`);

  await updateRegionsWorkflow(container).run({
    input: {
      selector: { id: region.id },
      update: {
        currency_code: "pln",
        name: "Polska & Europe",
        countries: ["pl", "gb", "de", "dk", "se", "fr", "es", "it"],
      }
    }
  });

  logger.info("Region updated successfully.");
}