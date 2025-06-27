import { Schema, model } from "mongoose";
import { ILesson } from "../types/lesson.types";

const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    description: { type: String },
    video: { type: String },
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    order: { type: Number, required: true },
    resources: [{ type: String }],
  },
  {
    timestamps: true,
  }
);
lessonSchema.index({ moduleId: 1 });

export const Lesson = model<ILesson>("Lesson", lessonSchema);
