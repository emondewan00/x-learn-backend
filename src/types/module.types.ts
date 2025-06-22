import { Types } from "mongoose";

export interface IModule {
  title: string;
  description: string;
  order: number;
  courseId: Types.ObjectId;
  lessons: Types.ObjectId[];
}
