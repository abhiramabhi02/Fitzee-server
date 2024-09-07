import User, { userInterface } from "../models/userModel";
import Trainer, { trainerInterface } from "../models/trainerModel";
import adminServices from "./adminServices";
import mongoose from "mongoose";

export type Roles = "user" | "trainer";

type roleDocumentMap = {
  user: userInterface;
  trainer: trainerInterface;
};

class sharedServices {
  static getModel<T extends Roles>(role: T) {
    switch (role) {
      case "user":
        return User as unknown as mongoose.Model<roleDocumentMap[T]>;

      case "trainer":
        return Trainer as unknown as mongoose.Model<roleDocumentMap[T]>;

      default: {
        throw new Error("invalid role");
      }
    }
  }

  static async profileCompletion(
    id: string,
    role: Roles,
    data: {
      image: string;
      gender: string;
      age: number;
      height: number;
      weight: string;
    }
  ) {
    const model = this.getModel(role);

    const updateData = await model
      .updateOne(
        { _id: id },
        {
          $set: {
            PersonalDetails: data,
          },
          new: true,
        }
      )
      .exec();

    if (!updateData) {
      return {
        status: 401,
        success: false,
        message: `${role} updation failed`,
      };
    }
    return { status: 202, success: true, message: `${role} updation success` };
  }

  static async getUserById(id: string) {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return { status: 404, success: false, message: "user not found" };
    }
    return { status: 200, success: true, user: user, message: "user found" };
  }
}

export default sharedServices;
