import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

//Import Routes
import movieRoutes from "./routes/movieRoutes.js";

config();
connectDB();

const app = express();

//API Routes
app.use("/movies", movieRoutes);

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

//Hanlde unhandle promise rejection
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

//Handle Uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception :", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

//Graceful Shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

//AUTH - Signin, Signup
//Movie - Getting All Movies
//User - Profile
//WatchList -
