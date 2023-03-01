import express from "express";
import jwt from "jsonwebtoken";

// Model
import { User, Medication } from "./model.js";

// Global Variables
const MIN_PASSWORD_LENGTH = 8;
const router = express.Router();

// Helper Functions
function validateCredentials(username, password) {
  // Username Validations
  if (typeof username !== "string")
    throw new Error("Username must be a string");
  if (username.length < 3) throw new Error("Username is too short");
  if (username.length > 255) throw new Error("Username is too long");

  // Password Validations
  const lowercase = /^(?=.*[a-z])[a-zA-Z\d!@#$%^&*]+$/;
  const uppercase = /^(?=.*[A-Z])[a-zA-Z\d!@#$%^&*]+$/;
  const numeric = /^(?=.*\d)[a-zA-Z\d!@#$%^&*]+$/;
  const special = /^(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/;

  if (typeof password !== "string")
    throw new Error("Password must be a string");
  if (password.length < MIN_PASSWORD_LENGTH)
    throw new Error("Password is too short");
  if (password.length > 255) throw new Error("Password is too long");
  if (!lowercase.test(password))
    throw new Error("Password must contain at least one lowercase letter");
  if (!uppercase.test(password))
    throw new Error("Password must contain at least one uppercase letter");
  if (!numeric.test(password))
    throw new Error("Password must contain at least one number");
  if (!special.test(password))
    throw new Error("Password must contain at least one special character");
}

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

function readIntReqParam(req, key) {
  let value = req.params[key];
  if (typeof value !== "string")
    throw new Error(`raw "${key}" value is not a string`);
  value = parseInt(value);
  if (Number.isNaN(value)) throw new Error(`"${key}" value is not a string`);
  return value;
}

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

  try {
    validateCredentials(username, password);
  } catch (e) {
    res.status(401).json({
      type: "error",
      data: {
        message: e.message,
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
    const [rows] = await connection.execute(
      "INSERT INTO medication (user_id, name, description) VALUES (?, ?, ?);",
      [token.id, name, description]
    );

    await connection.commit();

    res.status(200).json({
      type: "ok",
      data: {
        id: rows.insertId,
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

router.put("/medication/:medicationId", async (req, res) => {
  const pool = req.app.locals.pool;
  const token = res.locals.token;

  let medicationId = null;
  try {
    medicationId = readIntReqParam(req, "medicationId");
  } catch (e) {
    res.status(400).json({
      type: "error",
      data: {
        message: e.message,
      },
    });
    return;
  }

  let name = req.body["name"];
  let description = req.body["description"];

  if (
    typeof name !== "string" &&
    typeof name !== "undefined" &&
    name !== null
  ) {
    res.status(400).json({
      type: "error",
      data: {
        message: "`name` field is invalid",
      },
    });
    return;
  }

  if (
    typeof description !== "string" &&
    typeof description !== "undefined" &&
    description !== null
  ) {
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

    name = name || null;
    description = description || null;
    await connection.query(
      "UPDATE medication SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE user_id = ? and id = ?;",
      [name, description, token.id, medicationId]
    );

    await connection.commit();

    res.status(200).json({
      type: "ok",
      data: {
        message: "medication updated",
      },
    });
  } catch (err) {
    console.log(err);

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

  let connection = null;
  try {
    connection = await pool.getConnection();

    let medication = await Medication.getAllByUserId(connection, token.id);

    res.status(200).json({
      type: "ok",
      data: medication,
    });
  } catch (err) {
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

router.delete("/medication/:medicationId", async (req, res) => {
  const pool = req.app.locals.pool;
  const token = res.locals.token;

  let medicationId = null;
  try {
    medicationId = readIntReqParam(req, "medicationId");
  } catch (e) {
    res.status(400).json({
      type: "error",
      data: {
        message: e.message,
      },
    });
    return;
  }

  let connection = null;
  try {
    connection = await pool.getConnection();

    await Medication.getByUserIdAndId(connection, token.id, medicationId);

    await connection.query(
      "DELETE FROM medication_administrations WHERE medication_id = ?;",
      [medicationId]
    );
    await connection.query(
      "DELETE FROM medication_schedules WHERE medication_id = ?;",
      [medicationId]
    );
    await connection.query("DELETE FROM medication WHERE id = ?;", [
      medicationId,
    ]);

    await connection.commit();

    res.status(200).json({
      type: "ok",
      data: "deleted",
    });
  } catch (e) {
    console.error(e);

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

  let medicationId = null;
  try {
    medicationId = readIntReqParam(req, "medicationId");
  } catch (e) {
    res.status(400).json({
      type: "error",
      data: {
        message: e.message,
      },
    });
    return;
  }

  let connection = null;
  try {
    connection = await pool.getConnection();
    await Medication.getByUserIdAndId(connection, token.id, medicationId);
  } catch (e) {
    console.error(e);
    res.status(404).json({
      type: "error",
      data: {
        message: "invalid medication",
      },
    });
    return;
  } finally {
    if (connection) await connection.release();
  }

  try {
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

router.put(
  "/medication/:medicationId/schedule/:scheduleId",
  async (req, res) => {
    const pool = req.app.locals.pool;
    const token = res.locals.token;

    let medicationId = null;
    let scheduleId = null;
    try {
      medicationId = readIntReqParam(req, "medicationId");
      scheduleId = readIntReqParam(req, "scheduleId");
    } catch (e) {
      res.status(400).json({
        type: "error",
        data: {
          message: e.message,
        },
      });
      return;
    }

    let hourOfDay = req.body["hourOfDay"];
    let dayOfWeek = req.body["dayOfWeek"];

    if (
      typeof hourOfDay !== "number" &&
      typeof hourOfDay !== "undefined" &&
      hourOfDay !== null
    ) {
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

        return;
      }

      if (hourOfDay === undefined) hourOfDay = null;
      await connection.query(
        "UPDATE medication_schedules SET hour_of_day = COALESCE(?, hour_of_day), day_of_week = COALESCE(CASE WHEN ? = 1 THEN ? ELSE NULL END, day_of_week) WHERE medication_id = ? AND id = ?;",
        [
          hourOfDay,
          dayOfWeek !== undefined,
          dayOfWeek || null,
          medicationId,
          scheduleId,
        ]
      );
      await connection.commit();

      res.status(200).json({
        type: "ok",
        data: "updated medication schedule",
      });
    } catch (err) {
      console.log(err);
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
  }
);

router.delete(
  "/medication/:medicationId/schedule/:scheduleId",
  async (req, res) => {
    const pool = req.app.locals.pool;
    const token = res.locals.token;

    let medicationId = null;
    let scheduleId = null;
    try {
      medicationId = readIntReqParam(req, "medicationId");
      scheduleId = readIntReqParam(req, "scheduleId");
    } catch (e) {
      res.status(400).json({
        type: "error",
        data: {
          message: e.message,
        },
      });
      return;
    }

    let connection = null;
    try {
      connection = await pool.getConnection();
      await Medication.getByUserIdAndId(connection, token.id, medicationId);
    } catch (e) {
      console.error(e);
      res.status(404).json({
        type: "error",
        data: {
          message: "invalid medication",
        },
      });
      return;
    } finally {
      if (connection) await connection.release();
    }

    try {
      await pool.query(
        "DELETE FROM medication_schedules WHERE medication_id = ? AND id = ?;",
        [medicationId, scheduleId]
      );

      res.status(200).json({
        type: "ok",
        data: "deleted schedule",
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
  }
);

router.post("/medication/:medicationId/administration", async (req, res) => {
  const pool = req.app.locals.pool;
  const token = res.locals.token;

  let medicationId = null;
  try {
    medicationId = readIntReqParam(req, "medicationId");
  } catch (e) {
    res.status(400).json({
      type: "error",
      data: {
        message: e.message,
      },
    });
    return;
  }

  let timestamp = req.body["timestamp"];
  let status = req.body["status"];

  if (typeof timestamp !== "number" || !Number.isInteger(timestamp)) {
    res.status(400).json({
      type: "error",
      data: {
        message: "`timestamp` field is invalid",
      },
    });
    return;
  }

  if (
    typeof status !== "number" ||
    !Number.isInteger(status) ||
    (status !== 0 && status !== 1 && status !== 2)
  ) {
    res.status(400).json({
      type: "error",
      data: {
        message: "`status` field is invalid",
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

      return;
    }

    await connection.query(
      "INSERT INTO medication_administrations (medication_id, timestamp, status) VALUES (?, ?, ?);",
      [medicationId, timestamp, status]
    );
    await connection.commit();

    res.status(200).json({
      type: "ok",
      data: "created medication administration",
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

router.get("/medication/administration", async (req, res) => {
  const pool = req.app.locals.pool;
  const token = res.locals.token;

  try {
    let [rows] = await pool.query(
      "SELECT medication_administrations.id as id, medication_id, timestamp, status FROM medication_administrations JOIN medication ON medication.id = medication_id WHERE user_id = ?;",
      [token.id]
    );

    let payload = rows.map((row) => {
      return {
        id: row.id,
        medicationId: row.medication_id,
        timestamp: row.timestamp,
        status: row.status,
      };
    });

    res.status(200).json({
      type: "ok",
      data: payload,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      type: "error",
      data: {
        message: "internal server error",
      },
    });
  }
});

export default router;
