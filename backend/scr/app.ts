import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoute";
import userRoutes from "./routes/userRoutes";
import schoolRoutes from "./routes/schoolRoutes";
import programRoutes from "./routes/programRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/programs", programRoutes);

app.use(errorHandler);

export default app;