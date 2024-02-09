import express from "express";
import dotenv from "dotenv";
import { connect } from "./Config/mongoDBConfig.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authenticationRouter from "./Routes/authenticationRouter.js";
import homeRouter from "./Routes/postRouter.js";
import bodyParser from "body-parser";
import path from "path"
import cloudinary from "cloudinary";

const currentWorkingDir = path.resolve();
const parentDir = path.dirname(currentWorkingDir)

dotenv.config();
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDAPISECERET,
});

const corsOptions = {
  origin: true,
};



app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.static("Public"));

app.use("/api/authentication", authenticationRouter);
app.use("/api/home",homeRouter)

const enviornment = "production"

if (enviornment === 'production') { 
    const __dirname = path.resolve();
    app.use(express.static(path.join(parentDir, '/Client/dist')));
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(parentDir, 'Client', 'dist', 'index.html'))
    );
  } else {
    app.get('/', (req, res) => {
      res.send('API is running....');
    });
  }

const port = process.env.PORT || 5000;
app.listen(port, () => {
  connect();
  console.log(`Backend server started sucessfully, http://localhost:${port}`);
});
