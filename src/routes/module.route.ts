import { Router } from "express";

import {
  createModule,
  deleteModule,
  getModuleById,
  updateModule,
} from "../controllers/module.controller";
import checkJWTToken from "../middleware/checkJWTToken";

const moduleRouter = Router();

moduleRouter.get("/:id", getModuleById);
moduleRouter.post("/", checkJWTToken, createModule);
moduleRouter.patch("/:id", checkJWTToken, updateModule);
moduleRouter.delete("/:id", checkJWTToken, deleteModule);

export default moduleRouter;
