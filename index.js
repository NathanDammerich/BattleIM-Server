import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import gameRoutes from "./routes/games.js";
import teamRoutes from "./routes/teams.js";
import leagueRoutes from "./routes/leagues.js";
import orgRoutes from "./routes/orgs.js";
import sportRoutes from "./routes/sports.js";
import userRoutes from "./routes/users.js";
import divisionRoutes from "./routes/divisions.js";
import quizRoutes from "./routes/quizzes.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/games", gameRoutes);
app.use("/teams", teamRoutes);
app.use("/users", userRoutes);
app.use("/leagues", leagueRoutes);
app.use("/orgs", orgRoutes);
app.use("/sports", sportRoutes);
app.use("/divisions", divisionRoutes);
app.use("/quizzes", quizRoutes);

app.get("/", (req, res) => {
  res.send("BattleIM");
});

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

//mongoose.set("useFindAndModify", false);
