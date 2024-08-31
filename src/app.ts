import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import userRoute from "./routes/users";
import trainerRoute from "./routes/trainer"
import adminRoute from "./routes/admin"
import database from "./config/databaseConnection";

const app = express();
const port = process.env.PORT || 3000;

database()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// setting up user route 
app.use("/", userRoute);

// setting up trainer route
app.use("/trainer", trainerRoute)

//setting up admin route
app.use("/admin", adminRoute)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
