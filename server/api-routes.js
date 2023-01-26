import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Model
import { User } from "./model.js";

const MIN_PASSWORD_LENGTH = 8;

const router = express.Router();

router.post("/login", async (req, res) => {
  const connection = req.app.locals.connection;
  const JWT_SECRET = req.app.locals.JWT_SECRET;

  let username = req.body["username"];
  let password = req.body["password"];

  if (typeof username !== "string") {
    res.status(400).json({
      type: "error",
      data: {
        message: "`username` field is invalid",
      },
    });

    return;
  }

  if (typeof password !== "string") {
    res.status(400).json({
      type: "error",
      data: {
        message: "`password` field is invalid",
      },
    });

    return;
  }

  let user = null;
  try {
    user = await User.getByUsername(connection, username);
  } catch (err) {
    res.status(401).json({
      type: "error",
      data: {
        message: "failed to find user",
      },
    });

    return;
  }

  try {
    let isCorrectPassword = await user.isValidPassword(password);
    if (!isCorrectPassword) throw new Error("invalid password");
  } catch (err) {
    res.status(401).json({
      type: "error",
      data: {
        message: "incorrect password",
      },
    });

    return;
  }

  try {
    let token = await user.createToken(JWT_SECRET);

    res.status(200).json({
      type: "ok",
      data: {
        token,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(401).json({
      type: "error",
      data: {
        message: "failed to log in",
      },
    });
  }
});

router.post("/login/register", async (req, res) => {
  const connection = req.app.locals.connection;
  const JWT_SECRET = req.app.locals.JWT_SECRET;

  let username = req.body["username"];
  let password = req.body["password"];

  if (
    typeof username !== "string" &&
    username.length < 3 &&
    username.length > 255
  ) {
    res.status(400).json({
      type: "error",
      data: {
        message: "`username` field is invalid",
      },
    });

    return;
  }

  if (
    typeof password !== "string" &&
    password.length > MIN_PASSWORD_LENGTH &&
    password.length > 255
  ) {
    res.status(400).json({
      type: "error",
      data: {
        message: "`password` field is invalid",
      },
    });

    return;
  }

  try {
    let user = await User.createNew(connection, username, password);
    let token = await user.createToken(JWT_SECRET);

    res.status(200).json({
      type: "ok",
      data: {
        token,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(401).json({
      type: "error",
      data: {
        message: "failed to register new account",
      },
    });
  }
});

export default router;
