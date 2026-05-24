import { supabase, unwrap } from "@/lib/supabase";
import { mapSubject, type Subject } from "@/types";

export async function fetchAllSubjects(): Promise<Subject[]> {
  const rows = unwrap(
    await supabase
      .from("subjects")
      .select("*")
      .eq("is_active", true)
      .order("is_compulsory", { ascending: false })
      .order("display_order", { ascending: true }),
  );

  return rows.map(mapSubject);
}

export async function fetchSubjectsByBoardClass(
  boardId: string,
  classLevel: number,
): Promise<Subject[]> {
  const rows = unwrap(
    await supabase
      .from("board_class_subjects")
      .select(
        `
        subject_id,
        is_active,
        subjects (
          id,
          name,
          icon,
          display_order,
          is_compulsory,
          is_active
        )
      `,
      )
      .eq("board_id", boardId)
      .eq("class_level", classLevel)
      .eq("is_active", true),
  );

  return rows
    .map((row: any) => row.subjects)
    .filter(Boolean)
    .filter((subject: any) => subject.is_active)
    .map(mapSubject)
    .sort((a: Subject, b: Subject) => {
      if (a.isCompulsory !== b.isCompulsory) {
        return a.isCompulsory ? -1 : 1;
      }

      return a.displayOrder - b.displayOrder;
    });
}
