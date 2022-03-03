import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import gameRoutes from "./routes/games.js";
import teamRoutes from "./routes/teams.js";
import leagueRoutes from "./routes/leagues.js";
import orgRoutes from "./routes/orgs.js";
import sportRoutes from "./routes/sports.js";
import userRoutes from "./routes/users.js";
import divisionRoutes from "./routes/divisions.js";
import quizRoutes from "./routes/quizzes.js";
import adminRoutes from "./routes/admins.js";
import authRoutes from "./routes/auth.js";

const app = express();
dotenv.config();

const whitelist = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://www.battleim.com",
  "https://battleim.com",
  "https://admin.battleim.com",
  "https://www.admin.battleim.com",
];
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/games", gameRoutes);
app.use("/teams", teamRoutes);
app.use("/users", userRoutes);
app.use("/leagues", leagueRoutes);
app.use("/orgs", orgRoutes);
app.use("/sports", sportRoutes);
app.use("/divisions", divisionRoutes);
app.use("/quizzes", quizRoutes);
app.use("/admins", adminRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("BattleIM");
});

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

//mongoose.set("useFindAndModify", false);
