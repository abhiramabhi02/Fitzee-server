import mongoose, { ObjectId } from "mongoose";
import Exercise, { exerciseInterface } from "../models/exerciseModel";
import News, { newsInterface } from "../models/newsModel";
import Subscription, {SubscriptionInterface} from "../models/subscriptionModel"
import User, { userInterface, personalDetails } from "../models/userModel"
import Package, { PackageInterface } from "../models/packagesModel";
import Trainer, {trainerInterface} from "../models/trainerModel"
import Diet, { dietInterface } from "../models/dietModel";

export type Particular = "exercise" | "news" | "subscription" | "user" | "package" | 'trainer' | 'diet';

type ParticularDocumentMap = {
  exercise: exerciseInterface;
  news: newsInterface;
  subscription:SubscriptionInterface,
  user:userInterface,
  package:PackageInterface
  trainer:trainerInterface,
  diet:dietInterface
};


class adminServices {
// get model is used to find the particular to do the operations with rest of the services.
   static getModel<T extends Particular>(particular: T) {
    switch (particular) {
      case "exercise":
        return Exercise as unknown as mongoose.Model<ParticularDocumentMap[T]>;

      case "news":
        return News as unknown as mongoose.Model<ParticularDocumentMap[T]>;

        case "subscription":
          return Subscription as unknown as mongoose.Model<ParticularDocumentMap[T]>;

          case "user":
            return User as unknown as mongoose.Model<ParticularDocumentMap[T]>;

            case "package":
            return Package as unknown as mongoose.Model<ParticularDocumentMap[T]>;

            case "trainer":
              return Trainer as unknown as mongoose.Model<ParticularDocumentMap[T]>;

              case "diet":
                return Diet as unknown as mongoose.Model<ParticularDocumentMap[T]>

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

        case 'package': {
          const { name, description, exercises, subscription } = body
          
          if(!name || !description || !exercises || !subscription){
            return {status:400, success:false, message:'All fields are required'}
          } 
          data = {
            Packagename: name,
            Description: description,
            Exercises: exercises,
            Subscription: subscription  
          } as PackageInterface
          break;
        }

        case 'user': {
          const { image, gender, age, height, weight } = body

          if(!gender || !age || !height || !weight){
            return {status:400, success:false, message:'All fields are required'}
          }
                    
          data = {
            Image:image,
            Gender:gender,
            Age:age,
            Height:height,
            Weight:weight
          } as personalDetails
          break;
        }

        case 'diet':{
          const {UserId, Calories, Protein, Carbohydrate} = body
          
          if(!UserId || !Calories || !Protein || !Carbohydrate){
              console.log(UserId, Calories, Protein, Carbohydrate, 'data in diet');
              return {status:400, success:false, message:'All fields are required'}
            }

            data = {
              UserId:UserId,
              Calories:Calories,
              Protein:Protein,
              Carbohydrate:Carbohydrate
            } as dietInterface
            break
        }

        default:
            return { status: 400, success: false, message: "Invalid item type." };
    }

    return { status: 200, success: true, data };
  }

  // align the filters according to the particulars
  static filterAlign(item:string, body:any):{ status: number, success: boolean, message?: string, filters?: any } {
    let filters: any = {}

    switch (item){
      case "user":{
        const {verification} = body
        
        if(verification === undefined || verification === null){
          return {status:400, success:false, message:"bad request"}
        }
        filters = {
          Verification:verification
        }
        break;
      }

      case "trainer":{
        const {verification} = body
        if(verification === undefined || verification === null){
          return {status:400, success:false, message:"bad request"}
        }
        filters = {
          Verification:verification
        }
        break;
      }

      case "news":{
        const {status} = body
      }

      default:
        return { status: 400, success: false, message: "Invalid item type." };
    }
    return { status: 200, success: true, filters };
   }

  // fetch all the documents of a collection
  static async getAllItems<T extends Particular>(particular:T){
   const model = this.getModel(particular)
   if(particular === 'package'){
    const items = await model.find({})
    .populate("Exercises")
    .populate("Subscription") 
    .sort({LastUpdate:-1})
    .exec();

    if(!items){
      return {status:404, success:false, err:'noItems', message:`No ${particular} found`}
     }
     return {status:200, success:true, items, message:`${particular} fetched`}
   }

   if(particular === 'user' || particular === 'trainer'){
    const items = await model.find({})
    if(!items){
      return {status:404, success:false, err:'noItems', message:`No ${particular} found`}
     }
     return {status:200, success:true, items, message:`${particular} fetched`}
   }

   const items = await model.find({}).sort({LastUpdate:-1})
   if(!items){
    return {status:404, success:false, err:'noItems', message:`No ${particular} found`}
   }
   return {status:200, success:true, items, message:`${particular} fetched`}
  }

  static async getDashboardData(){
    const user = await User.find({})
    const trainer = await Trainer.find({})
    const exercise = await Exercise.find({})
    const packages = await Package.find({})
    const subscription = await Subscription.find({})
    const subscribers = await User.find({Subscription:{$exists:true}})

    const data = {
      user:user,
      trainer:trainer, 
      exercise:exercise,
      packages:packages,
      subscription:subscription,
      subscribers:subscribers
    }

    return {status:200, success:true, items:data, message:'data fetched'}
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
        
    if(!updateItem){
        return {status:401, success:false, message:`${particular} updation failed`}
    }
    return {status:202, success:true, message:`${particular} updation success`}
   }

   // delete a document from a collection
   static async deleteItem<T extends Particular>(id:string, particular:T){
    const model = this.getModel(particular)

    const deleteItem = await model.deleteOne({_id:id}).exec()

    if(!deleteItem){
        return {status:401, success:false, message:`${particular} deletion failed`}
    }
    return {status:202, success:true, message:`${particular} deleted`}
   } 

   static async getPaymentDetails(){
      const payment = await User.find({Subscription:{$exists:true}})
      .populate('Subscription')
      .populate('Package')
      if(!payment){
        return {status:404, success:false, message:`No payments found`}
      }
      return {status:200, success:true, item:payment, message:`payments fetched`}
   }

   static async applyFilters(particular:Particular, filters:object){
    // get the correct model to filter
    const model = this.getModel(particular)

    const filtered = await model.find(filters)
    if(!filtered){
      return {status:404, success:false, message:`${particular} not found`}
    }
    return {status:200, success:true, items:filtered, message:`filtered ${particular} found`}
   }

   static async search(particular:Particular, searchString:string){
    
   }

}

export default adminServices;
