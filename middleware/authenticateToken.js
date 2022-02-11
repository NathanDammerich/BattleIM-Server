import jwt from "jsonwebtoken";
import { client } from "../redis_connect.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (token == null) return res.sendStatus(401);
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(401);
      }
      if (user.userID) {
        req.user = user;
        client.get("BL_" + user.userID.toString(), (err, data) => {
          if (err) throw err;
          if (data === token)
            return res
              .status(401)
              .json({ message: "This token is blacklisted" });
          next();
        });
      } else {
        req.admin = user;
        client.get("BL_" + user.adminID.toString(), (err, data) => {
          if (err) throw err;
          if (data === token)
            return res
              .status(401)
              .json({ message: "This token is blacklisted" });
          next();
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const verifyTokenAdmin = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (token == null) return res.sendStatus(401);
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, admin) => {
      if (err) {
        return res.sendStatus(401);
      }
      req.admin = admin;
      client.get("BL_" + admin.adminID.toString(), (err, data) => {
        if (err) throw err;
        if (data == token) {
          return res.status(401).json({ message: "This token is blacklisted" });
        }
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

  if (token == null) return res.sendStatus(401);
  try {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;

      client.get(user.userID, async (err, data) => {
        if (err)
          return res.sendStatus(401).json({ message: "redis client error" });

        if (data === null) return res.sendStatus(401);
        if (JSON.parse(data).token !== token) return res.sendStatus(401);
        next();
      });
    });
  } catch (error) {
    res.status(401).json({ error: error });
  }
};

export const verifyRefreshTokenAdmin = async (req, res, next) => {
  console.log("verifyRefreshTokenAdmin called");
  const token = req.cookies.refreshToken;
  console.log(token);

  if (token == null) return res.sendStatus(401);
  try {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, admin) => {
      if (err) return res.sendStatus(403);
      req.admin = admin;

      client.get(admin.adminID, async (err, data) => {
        if (err)
          return res.sendStatus(401).json({ message: "redis client error" });

        if (data === null) return res.sendStatus(401);
        if (JSON.parse(data).token !== token) return res.sendStatus(401);
        next();
      });
    });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
};
