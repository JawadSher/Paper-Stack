import { useRouter } from "expo-router";
import { View } from "react-native";

import type { Board, ClassLevel, Subject } from "@/types";

import { sortSubjects } from "./browseData";
import { SubjectCard } from "./SubjectCard";

interface SubjectGridProps {
  board: Board;
  classLevel: ClassLevel;
  subjects: Subject[];
}

export function SubjectGrid({ board, classLevel, subjects }: SubjectGridProps) {
  const router = useRouter();

  return (
    <View className="flex-row flex-wrap gap-3">
      {sortSubjects(subjects).map((subject) => (
        <View key={subject.id} className="w-[48%]">
          <SubjectCard
            subject={subject}
            accentColor={board.color}
            onPress={() =>
              router.push({
                pathname: "/(stack)/boards/[boardId]/[classId]/[subjectId]",
                params: {
                  boardId: board.id,
                  classId: String(classLevel),
                  subjectId: subject.id,
                },
              } as never)
            }
            onCommonQuestions={() =>
              router.push({
                pathname: "/(stack)/common-questions/[subjectId]",
                params: { boardId: board.id, classId: String(classLevel), subjectId: subject.id },
              } as never)
            }
          />
        </View>
      ))}
    </View>
  );
}
