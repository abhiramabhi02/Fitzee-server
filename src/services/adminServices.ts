import mongoose, { ObjectId } from "mongoose";
import Exercise, { exerciseInterface } from "../models/exerciseModel";
import News, { newsInterface } from "../models/newsModel";
import Subscription, {SubscriptionInterface} from "../models/subscriptionModel"

export type Particular = "exercise" | "news" | "subscription";

type ParticularDocumentMap = {
  exercise: exerciseInterface;
  news: newsInterface;
  subscription:SubscriptionInterface
};


class adminServices {
// get model is used to find the particular to do the operations with rest of the services.
  private static getModel<T extends Particular>(particular: T) {
    switch (particular) {
      case "exercise":
        return Exercise as unknown as mongoose.Model<ParticularDocumentMap[T]>;

      case "news":
        return News as unknown as mongoose.Model<ParticularDocumentMap[T]>;

        case "subscription":
          return Subscription as unknown as mongoose.Model<ParticularDocumentMap[T]>;

      default: {
        throw new Error("invalid particular");
      }
    }
  }

  // selecting interface for the particular item
  static itemAlign(item: Particular, body: any): { status: number, success: boolean, message?: string, data?: any } {
    let data: any;

    switch (item) {
        case 'news': {
            const { title, description, image } = body;
            if (!title || !description || !image) {
                return { status: 400, success: false, message: "All fields are required." };
            }
            data = {
                Title: title,
                Description: description,
                Image: image
            } as newsInterface;
            break;
        }

        case 'exercise': {
            const { name, description, image } = body;
            if (!name || !description || !image) {
                return { status: 400, success: false, message: "All fields are required." };
            }
            data = {
                Name: name,
                Description: description,
                Image: image
            } as exerciseInterface;
            break;
        }

        case 'subscription': {
          const { name, features, price } = body
          if(!name || !features || !price){
            return {status:400, success:false, message:'All fields are required'}
          } 
          data = {
            Name:name,
            Features: features,
            Price:price
          } as SubscriptionInterface
          break;
        }

        default:
            return { status: 400, success: false, message: "Invalid item type." };
    }

    return { status: 200, success: true, data };
  }

  // fetch all the documents of a collection
  static async getAllItems<T extends Particular>(particular:T){
   const model = this.getModel(particular)

   const items = await model.find({})
   if(!items){
    return {status:404, success:false, err:'noItems', message:`No ${particular} found`}
   }
   return {status:200, success:true, items, message:`${particular} fetched`}
  }


  // insert items based on particular, it extends the interface of the particular item
  static async insertItem<T extends Particular>(data:object,particular:T){
    const model = this.getModel(particular)

    

    const newItem = new model(data)
    await newItem.save()
    return { status: 201, success: true, message: `${particular} inserted successfully`, item: newItem };
   }

   // update items based on particulars
   static async updateItem<T extends Particular>(id:string, data:Object, particular:T){
    const model = this.getModel(particular)

    const updateItem = await model.findByIdAndUpdate(id, data,{
        new:true,
        runValidators:true
    }).exec()
    console.log(updateItem, 'data');
    
    if(!updateItem){
        return {status:401, success:false, message:`${particular} updation failed`}
    }
    return {status:200, success:true, message:`${particular} updation success`}
   }

   // delete a document from a collection
   static async deleteItem<T extends Particular>(id:string, particular:T){
    const model = this.getModel(particular)

    const deleteItem = await model.deleteOne({_id:id}).exec()

    if(!deleteItem){
        return {status:401, success:false, message:`${particular} deletion failed`}
    }
    return {status:200, success:true, message:`${particular} deleted`}
   }

   
}



export default adminServices;
