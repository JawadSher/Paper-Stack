import { supabase, unwrap } from "./supabase";

async function test() {
  const data = unwrap(
    await supabase.from("boards").select("id, name, short_name").limit(3),
  );
  console.log("Connected! Boards:", data);
}

test().catch(console.error);
