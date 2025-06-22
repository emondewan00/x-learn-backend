import { Request, Response } from "express";
import { Course } from "../models/course.model";
import getPagination from "../utils/getPagination";

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

    const courses = await Course.find().skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      data: courses,
      hasMore: courses.length === limit,
    });
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

export const deleteCourse = async (req: Request<Params>, res: Response) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
