import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import userRoute from "./routes/users";
import trainerRoute from "./routes/trainer"
import adminRoute from "./routes/admin"
import database from "./config/databaseConnection";
import {chatService} from "./services/chatService";
import chatRoute from './routes/chat'

const app = express();
const port = process.env.PORT || 3000;

database()
chatService.startServer(3001)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:4200', 'https://checkout.razorpay.com'],
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}));

// setting up user route 
app.use("", userRoute); 

// setting up trainer route
app.use("/trainer", trainerRoute)

//setting up admin route
app.use("/admin", adminRoute)

// setting up chat route
app.use("/chat", chatRoute) 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


export default app