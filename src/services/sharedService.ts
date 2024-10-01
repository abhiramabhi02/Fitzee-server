import User, { userInterface } from "../models/userModel";
import Trainer, { trainerInterface } from "../models/trainerModel";
import mongoose from "mongoose";
import adminServices from "./adminServices";

import { Particular } from "./adminServices";

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
    return {
      status: 202,
      success: true,
      item: updateData,
      message: `${role} updation success`,
    };
  }

  static async getUserById(id: string, role: string) {
    let user;
    if (role === "user") {
      user = await User.findOne({ _id: id })
        .populate("Subscription")
        .populate("Diet")
        .populate("Package");
    } else if (role === "trainer") {
      user = await Trainer.findOne({ _id: id });
    }

    if (!user) {
      return { status: 404, success: false, message: "user not found" };
    }
    return { status: 200, success: true, user: user, message: "user found" };
  }

  static async updateUserSubscription(
    userId: string,
    subId: string,
    packageId: string
  ) {
    const updated = await User.updateOne(
      { _id: userId },
      {
        $set: {
          Subscription: new mongoose.Types.ObjectId(subId),
          Package: new mongoose.Types.ObjectId(packageId),
        },
        new: true,
      }
    );
    if (!updated) {
      return { status: 401, success: false, message: "updation failed" };
    }
    return { status: 202, success: true, message: "updation success" };
  }

  static async getParticularById(particular: string, id: string) {
    
    const model = adminServices.getModel(particular as Particular);
    let item;
    if (particular === "package") {
      item = await model.findOne({_id:id}).populate("Exercises")
    }else{
      item = await model.findById(id)
    }
    if(!item){
      return { status: 404, success: false, message: `${particular} not found` };
    }
    return { status: 200, success: true, item:item, message: `${particular} fetching success` };
  }
}

export default sharedServices;
