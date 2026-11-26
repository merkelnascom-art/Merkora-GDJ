import { notFound } from "next/navigation";
import SpecializedConfiguratorFlow from "../specialized-configurator-flow";
import { getSpecializedConfigurator, getSpecializedConfigurators } from "../../../../src/lib/merkora-core/specialized-configurators";

export function generateStaticParams() {
  return getSpecializedConfigurators().map((configurator) => ({ configuratorId: configurator.id }));
}

export default async function SpecializedConfiguratorPage({
  params,
}: {
  params: Promise<{ configuratorId: string }>;
}) {
  const { configuratorId } = await params;
  const configurator = getSpecializedConfigurator(configuratorId);
  if (!configurator) notFound();
  return <SpecializedConfiguratorFlow configurator={configurator} />;
}
