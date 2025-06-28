import { Request, Response } from "express";
import { Course } from "../models/course.model";
import getPagination from "../utils/getPagination";
import { Module } from "../models/module.model";
import { Lesson } from "../models/lesson.model";
import fs from "fs";
import path from "path";

type Params = { id: string };
interface CourseInput {
  title: string;
  description: string;
  price?: number;
  image: FormData;
}

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const { limit, skip } = getPagination(req.query, 10);
    const sortQuery: any = {};

    if (req.query?.popular) {
      sortQuery.enrolledCount = -1;
    }

    const courses = await Course.find({})
      .skip(skip)
      .limit(limit)
      .sort(sortQuery)
      .lean();

    res.status(200).json({
      success: true,
      data: courses,
      hasMore: courses.length === limit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getAllCoursesForAdmin = async (req: Request, res: Response) => {
  try {
    const courses: any = await Course.find({})
      .populate({
        path: "modules",
        select: "lessons",
      })
      .lean();

    const formatCourses = courses.map((course: any) => {
      return {
        ...course,
        modulesCount: course?.modules?.length,
        lessonsCount: course?.modules?.reduce(
          (total: any, module: any) => total + module?.lessons?.length,
          0
        ),
      };
    });

    res.status(200).json({ success: true, data: formatCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getCourseById = async (req: Request<Params>, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }
    await course.populate({
      path: "modules",
      select: "title description order _id",
      populate: {
        path: "lessons",
        select: "title description order _id",
      },
    });
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const createCourse = async (
  req: Request<{}, {}, CourseInput>,
  res: Response
) => {
  try {
    const file = req.file;
    const { title, description, price } = req.body;

    if (!title || !description) {
      res.status(400).json({
        success: false,
        message: "Title,description and image are required",
      });
      return;
    }

    const course = await Course.create({
      title,
      description,
      price,
      image: file?.filename as string,
    });
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateCourse = async (
  req: Request<Params, {}, Partial<CourseInput>>,
  res: Response
) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateCourseImage = async (
  req: Request<Params, {}, Partial<CourseInput>>,
  res: Response
) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: "Image is required" });
      return;
    }

    const course = await Course.findById(req.params.id);

    if (course?.image) {
      fs.unlinkSync(
        path.join(__dirname, "..", "..") + "/uploads/thumbnails/" + course.image
      );
    }

    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const deleteCourse = async (req: Request<Params>, res: Response) => {
  try {
    console.log(req.params.id);

    const course = await Course.findById(req.params.id).populate<{
      modules: { lessons: [{ video: string; _id: string }]; _id: string }[];
    }>({
      path: "modules",
      select: "lessons _id",
      populate: {
        path: "lessons",
        select: "_id resources",
      },
    });
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        const deletedLesson = await Lesson.findByIdAndDelete(lesson._id);
        if (deletedLesson?.resources) {
          for (const resource of deletedLesson.resources) {
            fs.unlinkSync("/src/uploads/resources/" + resource);
          }
        }
      }
      await Module.findByIdAndDelete(module._id);
    }
    if (course.image) {
      fs.unlinkSync(
        path.join(__dirname, "..", "..") + "/uploads/thumbnails/" + course.image
      );
    }
    await Course.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
