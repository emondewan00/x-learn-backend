import { Types } from "mongoose";

export interface IUserCourse {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  purchasedAt: Date;
  price: number;
  paymentStatus: "pending" | "paid" | "failed";
  completedLessons: Types.ObjectId[];
  lastVisitedLesson: Types.ObjectId;
  completeProgress: number;
}

export interface IUserCourseDoc extends IUserCourse {
  _id: Types.ObjectId;
}
