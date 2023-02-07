import express from "express";
import jwt from "jsonwebtoken";

// Model
import { User } from "./model.js";

// Global Variables
const MIN_PASSWORD_LENGTH = 8;
const router = express.Router();


// Helper Functions
function validateCredentials(username, password) {

  // Username Validations
  if (typeof username !== "string") return "Username must be a string";
  if (username.length < 3) return "Username is too short";
  if (username.length > 255) return "Username is too long";

  // Password Validations
  const lowercase = /^(?=.*[a-z])[a-zA-Z\d!@#$%^&*]+$/;
  const uppercase = /^(?=.*[A-Z])[a-zA-Z\d!@#$%^&*]+$/;
  const numeric = /^(?=.*\d)[a-zA-Z\d!@#$%^&*]+$/;
  const special = /^(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/;

  if (typeof password !== "string") return "Password must be a string";
  if (password.length < MIN_PASSWORD_LENGTH) return "Password is too short";
  if (password.length > 255) return "Password is too long";
  if (!lowercase.test(password)) return "Password must contain at least one lowercase letter";
  if (!uppercase.test(password)) return "Password must contain at least one uppercase letter";
  if (!numeric.test(password)) return "Password must contain at least one number";
  if (!special.test(password)) return "Password must contain at least one special character";
};


router.post("/login", async (req, res) => {
  const pool = req.app.locals.pool;
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
    user = await User.getByUsername(pool, username);
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
  const pool = req.app.locals.pool;
  const JWT_SECRET = req.app.locals.JWT_SECRET;

  let username = req.body["username"];
  let password = req.body["password"];

  const error = validateCredentials(username,password);

  if (error) {
    res.status(401).json({
      type: "error",
      data: {
        message: error,
      },
    });

    return;
  }

  let connection = null;
  try {
    connection = await pool.getConnection();

    let user = await User.createNew(connection, username, password);
    let token = await user.createToken(JWT_SECRET);

    res.status(200).json({
      type: "ok",
      data: {
        token,
      },
    });
  } catch (err) {
    // console.error(err);

    res.status(401).json({
      type: "error",
      data: {
        message: "failed to register new account",
      },
    });
  } finally {
    if (connection) await connection.release();
  }
});

function stripPrefix(string, prefix) {
  if (!string.startsWith(prefix)) return null;
  return string.substr(prefix.length);
}

function jwtVerify(token, secretOrPublicKey, options) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, options, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

router.use(async (req, res, next) => {
  const JWT_SECRET = req.app.locals.JWT_SECRET;
  let authorization = req.get("Authorization");

  if (authorization === undefined) {
    res.status(401).json({
      type: "error",
      data: {
        message: "not logged in",
      },
    });
    return;
  }

  let token = stripPrefix(authorization, "Bearer ");
  if (token === null) {
    res.status(400).json({
      type: "error",
      data: {
        message: "invalid authorization header",
      },
    });
    return;
  }

  try {
    token = await jwtVerify(token, JWT_SECRET);
  } catch (err) {
    // console.log(err);
    res.status(401).json({
      type: "error",
      data: {
        message: "invalid token",
      },
    });
    return;
  }

  res.locals.token = token;

  next();
});

router.post("/medication", async (req, res) => {
  const pool = req.app.locals.pool;
  const token = res.locals.token;

  let name = req.body["name"];
  let description = req.body["description"];

  if (typeof name !== "string") {
    res.status(400).json({
      type: "error",
      data: {
        message: "`name` field is invalid",
      },
    });
    return;
  }

  if (typeof description !== "string") {
    res.status(400).json({
      type: "error",
      data: {
        message: "`description` field is invalid",
      },
    });
    return;
  }

  let connection = null;
  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();
    await connection.query(
      "INSERT INTO medication (user_id, name, description) VALUES (?, ?, ?);",
      [token.id, name, description]
    );

    await connection.commit();

    res.status(200).json({
      type: "ok",
      data: {
        message: "medication created",
      },
    });
  } catch (err) {
    // console.log(err);

    if (connection) await connection.rollback();

    res.status(500).json({
      type: "error",
      data: {
        message: "internal server error",
      },
    });
    return;
  } finally {
    if (connection) await connection.release();
  }
});

router.get("/medication", async (req, res) => {
  const pool = req.app.locals.pool;
  const token = res.locals.token;

  try {
    let [rows] = await pool.query(
      "SELECT id, name, description FROM medication WHERE user_id = ?;",
      [token.id]
    );

    let response = rows.map((row) => {
      return {
        id: row.id,
        name: row.name,
        description: row.description,
      };
    });

    res.status(200).json({
      type: "ok",
      data: response,
    });
  } catch (err) {
    res.status(500).json({
      type: "error",
      data: {
        message: "internal server error",
      },
    });
  }
});

router.post("/medication/schedule", async (req, res) => {
  const pool = req.app.locals.pool;
  const token = res.locals.token;

  let medicationId = req.body["medicationId"];
  let hourOfDay = req.body["hourOfDay"];
  let dayOfWeek = req.body["dayOfWeek"];

  if (typeof medicationId !== "number") {
    res.status(400).json({
      type: "error",
      data: {
        message: "`medicationId` field is invalid",
      },
    });
    return;
  }

  if (typeof hourOfDay !== "number") {
    res.status(400).json({
      type: "error",
      data: {
        message: "`hourOfDay` field is invalid",
      },
    });
    return;
  }

  if (
    typeof dayOfWeek !== "number" &&
    dayOfWeek !== null &&
    dayOfWeek !== undefined
  ) {
    res.status(400).json({
      type: "error",
      data: {
        message: "`dayOfWeek` field is invalid",
      },
    });
    return;
  }

  let connection = null;
  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();
    let [rows] = await connection.query(
      "SELECT id, name, description FROM medication WHERE user_id = ? AND id = ?;",
      [token.id, medicationId]
    );
    if (rows.length === 0) {
      await connection.rollback();
      res.status(404).json({
        type: "error",
        data: {
          message: "invalid medication",
        },
      });

      await connection.release();

      return;
    }

    await connection.query(
      "INSERT INTO medication_schedules (medication_id, hour_of_day, day_of_week) VALUES (?, ?, ?);",
      [medicationId, hourOfDay, dayOfWeek]
    );
    await connection.commit();

    res.status(200).json({
      type: "ok",
      data: "created medication schedule",
    });
  } catch (err) {
    // console.log(err);
    if (connection) await connection.rollback();

    res.status(500).json({
      type: "error",
      data: {
        message: "internal server error",
      },
    });
  } finally {
    if (connection) await connection.release();
  }
});

router.get("/medication/:medicationId/schedule", async (req, res) => {
  const pool = req.app.locals.pool;
  const token = res.locals.token;

  let medicationId = req.params["medicationId"];

  if (typeof medicationId !== "string") {
    res.status(400).json({
      type: "error",
      data: {
        message: "invalid medication id",
      },
    });
    return;
  }
  medicationId = parseInt(medicationId);

  if (Number.isNaN(medicationId)) {
    res.status(400).json({
      type: "error",
      data: {
        message: "invalid medication id",
      },
    });
    return;
  }

  try {
    {
      let [rows] = await pool.query(
        "SELECT id, name, description FROM medication WHERE user_id = ? AND id = ?;",
        [token.id, medicationId]
      );
      if (rows.length === 0) {
        res.status(404).json({
          type: "error",
          data: {
            message: "invalid medication",
          },
        });

        return;
      }
    }

    let [rows] = await pool.query(
      "SELECT id, medication_id, hour_of_day, day_of_week FROM medication_schedules WHERE medication_id = ?;",
      [medicationId]
    );

    let payload = rows.map((row) => {
      return {
        id: row.id,
        medicationId: row.medication_id,
        hourOfDay: row.hour_of_day,
        dayOfWeek: row.day_of_week,
      };
    });

    res.status(200).json({
      type: "ok",
      data: payload,
    });
  } catch (err) {
    // console.error(err);
    res.status(500).json({
      type: "error",
      data: {
        message: "internal server error",
      },
    });
  }
});

export default router;
