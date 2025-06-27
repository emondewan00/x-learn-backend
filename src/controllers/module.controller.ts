import { Request, Response } from "express";
import { Module } from "../models/module.model";
import { Course } from "../models/course.model";
import { UserCourse } from "../models/userCourse.model";
import { enhanceCourseWithProgress } from "../utils/enhanceCourseWithProgress";
import { ILessonDoc } from "../types/lesson.types";

type ModuleInput = {
  title: string;
  description: string;
  order: number;
  courseId: string;
};

type Params = {
  id: string;
};

const getModulesByCourse = async (req: Request<Params>, res: Response) => {
  try {
    const userProgress = await UserCourse.findOne({
      userId: req.user.id,
      courseId: req.params.id,
    }).lean();

    if (!userProgress) {
      res.status(200).json({ message: "Modules found", data: [] });
      return;
    }

    const modulesData = await Module.find({ courseId: req.params.id })
      .populate<{ lessons: ILessonDoc[] }>({
        path: "lessons",
        select: "title description video resources order _id moduleId",
      })
      .select("title description order _id courseId")
      .lean();

    const totalLessons = modulesData.reduce(
      (total, module) => total + module.lessons.length,
      0
    );

    const { activeLesson, modules } = enhanceCourseWithProgress(
      modulesData,
      userProgress
    );

    const countInitialProgress =
      (userProgress.completedLessons.length / totalLessons) * 100;

    res.status(200).json({
      message: "Modules found",
      data: modules,
      progress: countInitialProgress,
      completedLessons: userProgress.completedLessons,
      activeLesson,
      totalLessons,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get modules", success: false });
  }
};

const getModuleById = async (req: Request<Params>, res: Response) => {
  try {
    const module = await Module.findById(req.params.id).populate("lessons");
    if (!module) {
      res.status(404).json({ message: "Module not found", success: false });
      return;
    }
    res
      .status(200)
      .json({ message: "Module found", data: module, success: true });
  } catch (error) {
    console.error(error, req.params.id);
    res.status(500).json({ message: "Failed to get module", success: false });
  }
};

const createModule = async (
  req: Request<{}, {}, ModuleInput>,
  res: Response
) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found", success: false });
      return;
    }

    const module = await Module.create(req.body);

    // save module id in the course
    course.modules.push(module._id);
    await course.save();

    res.status(201).json({ message: "Module created successfully", module });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create module" });
  }
};

const updateModule = async (req: Request<Params>, res: Response) => {
  try {
    const { id } = req.params;
    const module = await Module.findByIdAndUpdate(id, req.body);
    if (!module) {
      res.status(404).json({ message: "Module not found", success: false });
      return;
    }
    res.status(200).json({
      message: "Module updated successfully",
      data: module,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update module", success: false });
  }
};

const deleteModule = async (req: Request<Params>, res: Response) => {
  try {
    const { id } = req.params;
    const module = await Module.findByIdAndDelete(id);
    // TODO : Delete lessons also during module
    if (!module) {
      res.status(404).json({ message: "Module not found", success: false });
      return;
    }

    res
      .status(200)
      .json({ message: "Module deleted successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete module", success: false });
  }
};

export {
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
  getModulesByCourse,
};
