import { Schema, model } from "mongoose";
import { IModule } from "../types/module.types";

const moduleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true },
    description: { type: String },
    order: { type: Number, required: true },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  },
  {
    timestamps: true,
  }
);

export const Module = model<IModule>("Module", moduleSchema);
