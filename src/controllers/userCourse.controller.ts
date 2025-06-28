import { Request, Response } from "express";
import { UserCourse } from "../models/userCourse.model";
import { User } from "../models/user.model";
import { Course } from "../models/course.model";
import { Lesson } from "../models/lesson.model";
import { Module } from "../models/module.model";

type IUserCourseInput = {
  userId: string;
  courseId: string;
  price: number;
  purchasedAt?: Date;
  paymentStatus?: string;
  completedLessons?: string[];
  lastVisitedLesson?: string;
  isCompleted?: boolean;
};

const getMyCourses = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const userCourses = await UserCourse.find({ userId: user.id })
      .populate("courseId")
      .lean();

    if (userCourses.length > 0) {
      const userCoursesWithProgress = await Promise.all(
        userCourses.map(async (userCourse) => {
          const course = userCourse.courseId;
          const completedLessons = userCourse.completedLessons.length;

          const lessonLength = await Lesson.countDocuments({
            course: course._id,
          }).lean();

          const progress = Math.round((completedLessons / lessonLength) * 100);

          return {
            ...userCourse.courseId,
            progress: isNaN(progress) ? 0 : progress,
          };
        })
      );

      res.status(200).json({
        success: true,
        data: userCoursesWithProgress,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const getUserCourseByCourseId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userCourse = await UserCourse.findOne({ courseId: id });

    res.status(200).json({ success: true, isEnrolled: !!userCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const createUserCourse = async (
  req: Request<{}, {}, IUserCourseInput>,
  res: Response
) => {
  try {
    const { courseId } = req.body;
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    // Prevent duplicate enrollment
    const existing = await UserCourse.findOne({ userId: user._id, courseId });
    if (existing) {
      res
        .status(400)
        .json({ success: false, message: "Already enrolled in this course" });
      return;
    }
    const modules = await Module.find({ courseId })
      .sort({ order: -1 })
      .populate({
        path: "lessons",
        select: "_id order",
      })
      .lean();

    const lessonsId = modules.flatMap((module) => module.lessons);

    const sortedLessons = (lessonsId as any).sort(
      (a: any, b: any) => a.order - b.order
    );

    const userCourse = await UserCourse.create(req.body);
    const userDoc = await User.findById(user.id);
    const course = await Course.findById(courseId);

    if (!course) {
      await UserCourse.findByIdAndDelete(userCourse._id);
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    if (!userDoc) {
      await UserCourse.findByIdAndDelete(userCourse._id);
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    userCourse.lastVisitedLesson = sortedLessons[0];
    await userCourse.save();

    course.enrolledCount += 1;
    await course.save();
    userDoc.enrolledCourses.push(userCourse._id);
    await userDoc.save();

    res.status(201).json({
      success: true,
      message: "Course enrolled successfully",
      data: userCourse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const updateUserCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userCourse = await UserCourse.findByIdAndUpdate(id, req.body);
    if (!userCourse) {
      res
        .status(404)
        .json({ success: false, message: "User course not found" });
      return;
    }
    res.status(200).json({ success: true, data: userCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
const changeActiveLesson = async (req: Request, res: Response) => {
  try {
    const { lastVisitedLesson, courseId, lessonId } = req.body;
    const { id } = req.user;

    const userCourse = await UserCourse.findOne({ courseId, userId: id });

    if (!userCourse) {
      res
        .status(404)
        .json({ success: false, message: "User course not found" });
      return;
    }

    userCourse.lastVisitedLesson = lastVisitedLesson;
    await userCourse.save();

    res.status(200).json({ success: true, data: userCourse });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const updateCompleteLesson = async (req: Request, res: Response) => {
  try {
    const { courseId, lessonId, lastVisitedLesson } = req.body;
    const { id } = req.user;
    const userCourse = await UserCourse.findOne({
      courseId: courseId,
      userId: id,
    });

    if (!userCourse) {
      res
        .status(404)
        .json({ success: false, message: "User course not found" });
      return;
    }

    userCourse.completedLessons.push(lessonId);
    userCourse.lastVisitedLesson = lastVisitedLesson;
    await userCourse.save();

    res.status(200).json({ success: true, data: userCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export {
  getMyCourses,
  createUserCourse,
  updateUserCourse,
  updateCompleteLesson,
  changeActiveLesson,
  getUserCourseByCourseId,
};
