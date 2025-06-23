import { Request, Response } from "express";
import { Lesson } from "../models/lesson.model";
import { ILesson } from "../types/lesson.types";
import { Module } from "../models/module.model";

type Params = { id: string };

// --- Get all lessons under a module ---
const getLessons = async (req: Request<Params>, res: Response) => {
  try {
    const lessons = await Lesson.find({ module: req.params.id });
    res.status(200).json({ success: true, data: lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// --- Get single lesson by ID ---
const getLessonById = async (req: Request<Params>, res: Response) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      res.status(404).json({ success: false, message: "Lesson not found" });
      return;
    }
    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// --- Create a lesson ---
const createLesson = async (req: Request<{}, {}, ILesson>, res: Response) => {
  try {
    const module = await Module.findById(req.body.moduleId);
    if (!module) {
      res.status(404).json({ success: false, message: "Module not found" });
      return;
    }

    const lesson = await Lesson.create(req.body);
    module.lessons.push(lesson._id);
    await module.save();

    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// --- Update lesson ---
const updateLesson = async (
  req: Request<Params, {}, Partial<ILesson>>,
  res: Response
) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lesson) {
      res.status(404).json({ success: false, message: "Lesson not found" });
      return;
    }
    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// --- Delete lesson ---
const deleteLesson = async (req: Request<Params>, res: Response) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) {
      res.status(404).json({ success: false, message: "Lesson not found" });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export { getLessons, getLessonById, createLesson, updateLesson, deleteLesson };
