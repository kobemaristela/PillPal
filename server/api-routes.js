import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;

const TOKEN_EXPIRE_TIME = "7d";

const router = express.Router();

function jwtSignPromise(payload, secretOrPrivateKey, options) {
  options = options || {};

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretOrPrivateKey, options, function (err, token) {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

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

  try {
    let [rows, fields] = await connection.query(
      "SELECT id, username, hash FROM users WHERE username = ?;",
      [username]
    );

    if (rows.length === 0) throw new Error("missing user");
    if (rows.length !== 1)
      throw new Error(`multiple users for username "${username}"`);
    let user = rows[0];

    let isCorrectPassword = await bcrypt.compare(password, user.hash);
    if (!isCorrectPassword) throw new Error("invalid password");

    const jwtData = {
      id: user.id,
      username: user.username,
    };
    let token = await jwtSignPromise(jwtData, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRE_TIME,
    });

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

  let hash = null;
  try {
    hash = await bcrypt.hash(password, SALT_ROUNDS);
  } catch (err) {
    res.status(500).json({
      type: "error",
      data: {
        message: "internal server error",
      },
    });
    return;
  }

  try {
    await connection.beginTransaction();
    await connection.query(
      "INSERT INTO users (username, hash) VALUES (?, ?);",
      [username, hash]
    );
    let [rows, fields] = await connection.query(
      "SELECT LAST_INSERT_ID() as id;",
      [username]
    );

    let id = rows[0]["id"];

    await connection.query("COMMIT;");

    const jwtData = {
      id: id,
      username: username,
    };
    let token = await jwtSignPromise(jwtData, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRE_TIME,
    });

    res.status(200).json({
      type: "ok",
      data: {
        token,
      },
    });
  } catch (err) {
    console.error(err);

    await connection.rollback();

    res.status(401).json({
      type: "error",
      data: {
        message: "failed to register new account",
      },
    });
  }
});

export default router;
