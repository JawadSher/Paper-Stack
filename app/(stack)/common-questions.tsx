import { Redirect, useLocalSearchParams } from "expo-router";

export default function CommonQuestionsScreen() {
  const { boardId, classId, subjectId } = useLocalSearchParams<{
    boardId?: string;
    classId?: string;
    subjectId?: string;
  }>();

  return (
    <Redirect
      href={{
        pathname: "/(stack)/common-questions/[subjectId]",
        params: {
          subjectId: subjectId ?? "class-10-physics",
          boardId,
          classId,
        },
      }}
    />
  );
}
