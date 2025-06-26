import { Types, Document } from "mongoose";

export interface ILesson {
  title: string;
  description: string;
  video: string;
  moduleId: Types.ObjectId;
  courseId: Types.ObjectId;
  order: number;
  resources: string[];
}

export interface ILessonDoc extends ILesson {
  _id: Types.ObjectId;
}
