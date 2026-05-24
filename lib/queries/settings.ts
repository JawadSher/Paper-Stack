import { supabase, unwrap } from "@/lib/supabase";

export async function fetchFeatureFlags(): Promise<Record<string, boolean>> {
  const rows = unwrap(
    await supabase.from("feature_flags").select("flag_name, is_enabled"),
  );

  return rows.reduce<Record<string, boolean>>((acc, row: any) => {
    acc[row.flag_name] = row.is_enabled;
    return acc;
  }, {});
}
