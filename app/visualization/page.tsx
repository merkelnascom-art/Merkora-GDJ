import { redirect } from "next/navigation";
import { getAuthenticatedContext } from "@/lib/supabase/auth-context";
import VisualizationStudio from "./visualization-studio";

export default async function VisualisationPage() {
  const context = await getAuthenticatedContext();
  if (!context) redirect("/auth?next=/visualization");

  return (
    <VisualizationStudio
      actor={context.displayName ?? context.email ?? "Client MerKora"}
      email={context.email ?? ""}
    />
  );
}
