// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import mongoose from "mongoose";
// import Chat from "../models/chatModel";
// import dotenv from "dotenv";
// import Trainer from "../models/trainerModel";
// dotenv.config();

// class ChatService {
//   private app = express();
//   private server: http.Server;
//   private io: Server;

//   constructor() {
//     this.server = http.createServer(this.app);
//     this.io = new Server(this.server, {
//       cors: {
//         origin: process.env.client_url as string,
//         methods: ["GET", "POST"],
//       },
//     });

//     this.io.on("connection", (socket) => {
//       console.log("User connected:", socket.id);

//       // Only joins the room if it exists
//       socket.on("joinRoom", async ({ userId, trainerId }) => {
//         // Find the chat between the user and the trainer
//         const chat = await Chat.findOne({
//           UserId: userId,
//           TrainerId: trainerId,
//         });
//         if (!chat) {
//           socket.emit("error", {
//             message: "Room not found. Please create a room first.",
//           });
//           return;
//         }

//         const roomId = (chat._id as mongoose.Types.ObjectId).toString();
//         socket.join(roomId);
//         console.log(`${userId} joined room: ${roomId}`);

//         if (chat.Messages.length > 0) {
//           socket.emit("previousMessages", chat.Messages); // Send previous messages to the user
//         }
//       });

//       // Create room
//       socket.on("createRoom", async ({ userId, trainerId }) => {
//         let chat = await Chat.findOne({ UserId: userId, TrainerId: trainerId });
//         if (chat || userId === null) {
//           socket.emit("error", { message: "Room already exists" });
//           return;
//         }

//         chat = new Chat({
//           UserId: new mongoose.Types.ObjectId(userId),
//           TrainerId: new mongoose.Types.ObjectId(trainerId),
//           Messages: [],
//         });

//         await chat.save();
//         const roomId = (chat._id as mongoose.Types.ObjectId).toString();
//         console.log(
//           `Room created between ${userId} and ${trainerId} with roomId: ${roomId}`
//         );
//         const roomData = await this.getRoomsOfUser(trainerId, "trainer");
//         let showData;
//         if (roomData.data) {
//           showData = roomData.data[roomData.data.length - 1];
//           console.log(showData, "show in server");
//         }
//         socket.emit("roomCreated", { showData });
//       });

//       socket.on("privateMessage", async ({ roomId, message, senderId }) => {
//         // Broadcast the message to everyone in the room
//         this.io.to(roomId).emit("receiveMessage", {
//           Message: message,
//           SenderId: senderId,
//           TimeStamp: new Date(),
//         });

//         // Find the chat and save the new message
//         const chat = await Chat.findOne({ _id: roomId });
//         if (chat) {
//           chat.Messages.push({
//             Message: message,
//             SenderId: senderId,
//             TimeStamp: new Date(),
//           });
//           await chat.save();
//         }
//       });

//       socket.on("disconnect", () => {
//         console.log("User disconnected", socket.id);
//       });
//     });
//   }

//   //
//   public async getRoomsOfUser(id: string, role: string) {
//     let data;
//     const objectId = new mongoose.Types.ObjectId(id);

//     if (role === "user") {
//       data = await Chat.aggregate([
//         { $match: { UserId: objectId } },
//         {
//           $lookup: {
//             from: "users",
//             localField: "UserId",
//             foreignField: "_id",
//             as: "userDetails",
//           },
//         },
//         {
//           $lookup: {
//             from: "trainers",
//             localField: "TrainerId",
//             foreignField: "_id",
//             as: "trainerDetails",
//           },
//         },
//         { $unwind: "$userDetails" },
//         { $unwind: "$trainerDetails" },
//         {
//           $project: {
//             _id: 1,
//             Messages: 1,
//             UserId: 1,
//             TrainerId: 1,
//             "userDetails.Name": 1,
//             "trainerDetails.Name": 1,
//           },
//         },
//       ]);
//     } else {
//       data = await Chat.aggregate([
//         { $match: { TrainerId: objectId } },
//         {
//           $lookup: {
//             from: "users",
//             localField: "UserId",
//             foreignField: "_id",
//             as: "userDetails",
//           },
//         },
//         {
//           $lookup: {
//             from: "trainers",
//             localField: "TrainerId",
//             foreignField: "_id",
//             as: "trainerDetails",
//           },
//         },
//         { $unwind: "$userDetails" },
//         { $unwind: "$trainerDetails" },
//         {
//           $project: {
//             _id: 1,
//             Messages: 1,
//             UserId: 1,
//             TrainerId: 1,
//             "userDetails.Name": 1,
//             "trainerDetails.Name": 1,
//           },
//         },
//       ]);
//     }

//     if (!data) {
//       return { status: 404, success: false, message: "Data not found" };
//     }
//     return { status: 200, success: true, data, message: "Data found" };
//   }

//   public async createRoom(userId: string) {
//     const trainer = await Trainer.aggregate([
//       {
//         $lookup: {
//           from: "chats",
//           localField: "_id",
//           foreignField: "TrainerId",
//           as: "Chats",
//         },
//       },
//       { $project: { trainerName: "$Name", chatCount: { $size: "$Chats" } } },
//       {$sort:{chatCount:1}},{$limit:1}
//     ]);
    
//     let chat = await Chat.findOne({ UserId: userId, TrainerId: trainer[0]._id });
//     if (chat || userId === null) {
//       return { status: 400, success: false, message: "room already exists" };
//     }

//     chat = new Chat({
//       UserId: new mongoose.Types.ObjectId(userId),
//       TrainerId: new mongoose.Types.ObjectId(trainer[0]._id),
//       Messages: [],
//     });

//     const saved = await chat.save();
//     if (!saved) {
//       return {
//         status: 406,
//         success: false,
//         message: "new chat room creation failed",
//       };
//     }
//     return {
//       status: 200,
//       success: true,
//       message: "new chat room creation success",
//     };
//   }

//   public startServer(port: number) {
//     this.server.listen(port, () => {
//       console.log(`Chat server running on port: ${port}`);
//     });
//   }
// }

// export const chatService = new ChatService();



import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Chat from "../models/chatModel";
import dotenv from "dotenv";
import Trainer from "../models/trainerModel";
dotenv.config();

class ChatService {
  private app = express();
  private server: http.Server;
  private io: Server;

  constructor() {
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.client_url as string,
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Only joins the room if it exists
      socket.on("joinRoom", async ({ userId, trainerId }) => {
        // Find the chat between the user and the trainer
        const chat = await Chat.findOne({
          UserId: userId,
          TrainerId: trainerId,
        });
        if (!chat) {
          socket.emit("error", {
            message: "Room not found. Please create a room first.",
          });
          return;
        }

        const roomId = (chat._id as mongoose.Types.ObjectId).toString();
        socket.join(roomId);
        console.log(`${userId} joined room: ${roomId}`);

        if (chat.Messages.length > 0) {
          socket.emit("previousMessages", chat.Messages); // Send previous messages to the user
        }
      });

      // Create room
      socket.on("createRoom", async ({ userId, trainerId }) => {
        let chat = await Chat.findOne({ UserId: userId, TrainerId: trainerId });
        if (chat || userId === null) {
          socket.emit("error", { message: "Room already exists" });
          return;
        }

        chat = new Chat({
          UserId: new mongoose.Types.ObjectId(userId),
          TrainerId: new mongoose.Types.ObjectId(trainerId),
          Messages: [],
        });

        await chat.save();
        const roomId = (chat._id as mongoose.Types.ObjectId).toString();
        console.log(
          `Room created between ${userId} and ${trainerId} with roomId: ${roomId}`
        );
        const roomData = await this.getRoomsOfUser(trainerId, "trainer");
        let showData;
        if (roomData.data) {
          showData = roomData.data[roomData.data.length - 1];
          console.log(showData, "show in server");
        }
        socket.emit("roomCreated", { showData });
      });

      socket.on("privateMessage", async ({ roomId, message, senderId }) => {
        // Broadcast the message to everyone in the room
        this.io.to(roomId).emit("receiveMessage", {
          Message: message,
          SenderId: senderId,
          TimeStamp: new Date(),
        });

        // Find the chat and save the new message
        const chat = await Chat.findOne({ _id: roomId });
        if (chat) {
          chat.Messages.push({
            Message: message,
            SenderId: senderId,
            TimeStamp: new Date(),
          });
          await chat.save();
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
      });
    });
  }

  // New initializeServer method
  public initializeServer(server: http.Server) {
    this.io.attach(server);
    console.log("Socket.IO attached to the existing server");
  }

  public async getRoomsOfUser(id: string, role: string) {
    let data;
    const objectId = new mongoose.Types.ObjectId(id);

    if (role === "user") {
      data = await Chat.aggregate([
        { $match: { UserId: objectId } },
        {
          $lookup: {
            from: "users",
            localField: "UserId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "trainers",
            localField: "TrainerId",
            foreignField: "_id",
            as: "trainerDetails",
          },
        },
        { $unwind: "$userDetails" },
        { $unwind: "$trainerDetails" },
        {
          $project: {
            _id: 1,
            Messages: 1,
            UserId: 1,
            TrainerId: 1,
            "userDetails": 1,  
            "trainerDetails": 1,
          },
        },
      ]);
    } else {
      data = await Chat.aggregate([
        { $match: { TrainerId: objectId } },
        {
          $lookup: {
            from: "users",
            localField: "UserId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "trainers",
            localField: "TrainerId",
            foreignField: "_id",
            as: "trainerDetails",
          },
        },
        { $unwind: "$userDetails" },
        { $unwind: "$trainerDetails" },
        {
          $project: {
            _id: 1,
            Messages: 1,
            UserId: 1,
            TrainerId: 1,
            "userDetails": 1,
            "trainerDetails": 1,
          },
        },
      ]);
    }

    if (!data) {
      return { status: 404, success: false, message: "Data not found" };
    }
    return { status: 200, success: true, data, message: "Data found" };
  }

  public async createRoom(userId: string) {
    const trainer = await Trainer.aggregate([
      {
        $lookup: {
          from: "chats",
          localField: "_id",
          foreignField: "TrainerId",
          as: "Chats",
        },
      },
      { $project: { trainerName: "$Name", chatCount: { $size: "$Chats" } } },
      { $sort: { chatCount: 1 } },
      { $limit: 1 },
    ]);

    let chat = await Chat.findOne({ UserId: userId, TrainerId: trainer[0]._id });
    if (chat || userId === null) {
      return { status: 400, success: false, message: "room already exists" };
    }

    chat = new Chat({
      UserId: new mongoose.Types.ObjectId(userId),
      TrainerId: new mongoose.Types.ObjectId(trainer[0]._id),
      Messages: [],
    });

    const saved = await chat.save();
    if (!saved) {
      return {
        status: 406,
        success: false,
        message: "new chat room creation failed",
      };
    }
    return {
      status: 200,
      success: true,
      message: "new chat room creation success",
    };
  }

  // public startServer(port: number) {
  //   this.server.listen(port, () => {
  //     console.log(`Chat server running on port: ${port}`);
  //   });
  // }
}

export const chatService = new ChatService();
