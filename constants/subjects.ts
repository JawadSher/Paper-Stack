// OFFLINE FALLBACK ONLY — primary data source is Supabase
import type { Subject } from "@/types";

const compulsorySubjects = new Set(["English", "Urdu", "Islamiat", "Pakistan Studies"]);

const matricSubjects = [
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics",
  "Computer Science",
  "English",
  "Urdu",
  "Islamiat",
  "Pakistan Studies",
  "General Science",
] as const;

const intermediateSubjects = [
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics",
  "Computer Science",
  "English",
  "Urdu",
  "Islamiat",
  "Economics",
  "Statistics",
  "Psychology",
  "Sociology",
] as const;

const toSubjects = (classLevel: 9 | 10 | 11 | 12, names: readonly string[]) =>
  names.map<Subject>((name, index) => ({
    id: `class-${classLevel}-${name.toLowerCase().split(" ").join("-")}`,
    name,
    icon: name.toLowerCase().split(" ").join("-"),
    displayOrder: index + 1,
    isCompulsory: compulsorySubjects.has(name),
    isActive: true,
    classLevel,
  }));

export const subjectsByClass: Record<9 | 10 | 11 | 12, Subject[]> = {
  9: toSubjects(9, matricSubjects),
  10: toSubjects(10, matricSubjects),
  11: toSubjects(11, intermediateSubjects),
  12: toSubjects(12, intermediateSubjects),
};

export const subjects = Object.values(subjectsByClass).flat();
