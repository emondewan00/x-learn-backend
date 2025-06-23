import { Schema, model } from "mongoose";
import { IUserCourse } from "../types/userCourse.types";

const userCourseSchema = new Schema<IUserCourse>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  purchasedAt: { type: Date, default: Date.now },
  price: Number,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "paid",
  },
  completedLessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  lastVisitedLesson: { type: Schema.Types.ObjectId, ref: "Lesson" },
  isCompleted: { type: Boolean, default: false },
});

userCourseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const UserCourse = model<IUserCourse>("UserCourse", userCourseSchema);
