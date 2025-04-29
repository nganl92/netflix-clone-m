import express from 'express';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';

import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";

import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import { protectRoute } from './middleware/protectRoute.js';

const app = express();

const PORT = ENV_VARS.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middleware để parse JSON
app.use(express.json());
app.use(cookieParser());

// Định tuyến API
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie",  protectRoute, movieRoutes);
app.use("/api/v1/tv",  protectRoute, tvRoutes);
app.use("/api/v1/search",  protectRoute, searchRoutes); // tất cả router sẽ được kế thừa middleware từ router cha

if (ENV_VARS.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname,"..", "frontend", "dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,"..", "frontend", "dist", "index.html"));
  });
}

//mongoose
app.listen(PORT,()=>{
  console.log(`Server Started on http://localhost:${PORT}`) 
  connectDB()
})




