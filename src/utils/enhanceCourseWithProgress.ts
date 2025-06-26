import { IModuleDoc } from "../types/module.types";
import { IUserCourseDoc } from "../types/userCourse.types";
import { ILessonDoc } from "../types/lesson.types";

type LessonStatus = "locked" | "unlocked" | "in_progress" | "completed";

interface moduleWithLessons extends Omit<IModuleDoc, "lessons"> {
  lessons: ILessonDoc[];
}

function enhanceCourseWithProgress(
  modules: moduleWithLessons[],
  userProgress: IUserCourseDoc
) {
  const completedLessonsSet = new Set(
    userProgress.completedLessons.map((id) => id.toString())
  );

  let foundFirstUncompleted = false;
  let activeLesson: ILessonDoc | null = null;

  const updatedModules = modules
    .sort((a, b) => a.order - b.order)
    .map((module) => {
      let completeCount = 0;

      const updatedLessons = module.lessons
        .sort((a, b) => a.order - b.order)
        .map((lesson) => {
          let status: LessonStatus;

          if (completedLessonsSet.has(lesson._id.toString())) {
            status = "completed";
            completeCount++;
          } else if (!foundFirstUncompleted) {
            status = "unlocked";
            foundFirstUncompleted = true;
            activeLesson = lesson;
          } else {
            status = "locked";
          }

          if (lesson._id === userProgress.lastVisitedLesson) {
            activeLesson = lesson;
          }

          return {
            ...lesson,
            status,
          };
        });

      return {
        ...module,
        lessons: updatedLessons,
        completedLessons: completeCount,
      };
    });

  return { modules: updatedModules, activeLesson };
}

export { enhanceCourseWithProgress };
