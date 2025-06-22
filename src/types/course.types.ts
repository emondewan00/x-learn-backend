import { Types } from "mongoose";

export interface ICourse {
  title: string;
  description: string;
  price: number;
  image: string;
  published: boolean;
  modules: Types.ObjectId[];
}
