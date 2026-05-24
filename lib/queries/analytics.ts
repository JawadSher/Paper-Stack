import { supabase } from "@/lib/supabase";

export async function trackView(paperId: string): Promise<void> {
  await supabase.rpc("track_paper_event", {
    p_paper_id: paperId,
    p_event_type: "view",
    p_platform: "mobile",
  });
}

export async function trackDownload(paperId: string): Promise<void> {
  await supabase.rpc("track_paper_event", {
    p_paper_id: paperId,
    p_event_type: "download",
    p_platform: "mobile",
  });
}
