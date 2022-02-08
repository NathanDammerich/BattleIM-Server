import jwt from "jsonwebtoken";
import { client } from "../redis_connect.js";

export const verifyToken = async (req, res, next) => {
  console.log("verifyToken called");
  const token = req.cookies.accessToken;
  if (token == null) res.sendStatus(401);
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      client.get("BL_" + user.userID.toString(), (err, data) => {
        if (err) throw err;
        if (data === token)
          res.status(401).json({ message: "This token is blacklisted" });
        next();
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const verifyRefreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  console.log(token);

  if (token == null) res.sendStatus(401);
  try {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) res.sendStatus(403);
      req.user = user;

      client.get(user.userID, async (err, data) => {
        if (err) res.sendStatus(401).json({ message: "redis client error" });

        if (data === null) res.sendStatus(401);
        if (JSON.parse(data).token !== token) res.sendStatus(401);
        next();
      });
    });
  } catch (error) {
    res.status(401).json({ error: error });
  }
};
