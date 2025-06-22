import { Request, Response } from "express";
import { Module } from "../models/module.model";
import { Course } from "../models/course.model";

type ModuleInput = {
  title: string;
  description: string;
  order: number;
  courseId: string;
};

type Params = {
  id: string;
};

const getModuleById = async (req: Request<Params>, res: Response) => {
  try {
    const module = await Module.findById(req.params.id);
    // TODO: populate lessons property
    if (!module) {
      res.status(404).json({ message: "Module not found", success: false });
      return;
    }
    res
      .status(200)
      .json({ message: "Module found", data: module, success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to get module", success: false });
  }
};

const createModule = async (
  req: Request<{}, {}, ModuleInput>,
  res: Response
) => {
  try {
    const { title, description, order, courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found", success: false });
      return;
    }

    const module = await Module.create({
      title,
      description,
      order,
      courseId,
    });

    // save module id in the course
    course.modules.push(module._id);
    await course.save();

    res.status(201).json({ message: "Module created successfully", module });
  } catch (error) {
    res.status(500).json({ message: "Failed to create module" });
  }
};

const updateModule = async (req: Request<Params>, res: Response) => {
  try {
    const { id } = req.params;
    const module = await Module.findByIdAndUpdate(id, req.body, { new: true });
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

export { getModuleById, createModule, updateModule, deleteModule };
