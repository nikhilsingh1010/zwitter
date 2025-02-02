import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({
  path: ".env",
});

// Connect to the database
databaseConnection();

const app = express();

// Middlewares
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Handle all other routes by serving the index.html file
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});
