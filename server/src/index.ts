import cloudinary from "cloudinary";
import compression from 'compression';
import cors from "cors";
import dotenv from 'dotenv';
import express, { Express, Request, Response } from "express";
import helmet from 'helmet';
import morgan from 'morgan';
import connectDb from "./config/db";
import formRoutes from "./routes/formRoutes"

// loads environment variables from a `.env` file into `process.env`. 
dotenv.config({ path:"./.env"  });

// define port
const PORT =  process.env.PORT || 8080;
console.log("Port is : ", process.env.PORT)
console.log("CLOUDINARY_API_SECRET is : ", process.env.CLOUDINARY_API_SECRET)



// initialize express
const app: Express = express();

// initialize helmet to secure express app
app.use(helmet());

//connect to db
connectDb();

// configure cloudinary 

// cloudinary.v2.config({
//   cloud_name: "social-network-101",
//   api_key: "397828424674875",
//   api_secret: "ZRMnO8CC7-SY-kUOXU9sjGRRNNc",
// });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// initialize cors 处理跨域问题
app.use(cors({ origin: "*", credentials:true, }));

// Other Middlewares
app.use(compression());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.get("/", (req: Request, res: Response) => {
  res.send('<h1>Social Network API</h1>');
});

app.use("/form", formRoutes)


// initialize server
app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});