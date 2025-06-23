import { Types } from "mongoose";

export interface ILesson {
  title: string;
  description: string;
  video: string;
  moduleId: Types.ObjectId;
  courseId: Types.ObjectId;
  order: number;
}
