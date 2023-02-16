import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const TOKEN_EXPIRE_TIME = "1d";
const SALT_ROUNDS = 12;

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

class User {
  constructor(id, username, hash) {
    this.id = id;
    this.username = username;
    this.hash = hash;
  }

  async isValidPassword(password) {
    return await bcrypt.compare(password, this.hash);
  }

  async createToken(secret) {
    const data = {
      id: this.id,
      username: this.username,
    };

    return await jwtSignPromise(data, secret, {
      expiresIn: TOKEN_EXPIRE_TIME,
    });
  }

  static async getByUsername(connection, username) {
    let [rows] = await connection.query(
      "SELECT id, username, hash FROM users WHERE username = ?;",
      [username]
    );

    if (rows.length === 0) throw new Error("missing user");
    if (rows.length !== 1)
      throw new Error(`multiple users for username "${username}"`);
    let user = rows[0];

    return new User(user.id, user.username, user.hash);
  }

  static async createNew(connection, username, password) {
    let hash = await bcrypt.hash(password, SALT_ROUNDS);

    try {
      await connection.beginTransaction();
      await connection.query(
        "INSERT INTO users (username, hash) VALUES (?, ?);",
        [username, hash]
      );
      let [rows] = await connection.query("SELECT LAST_INSERT_ID() as id;", [
        username,
      ]);
      let id = rows[0]["id"];

      await connection.commit();

      return new User(id, username, hash);
    } catch (err) {
      await connection.rollback();

      throw err;
    }
  }
}

class Medication {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static async getByUserIdAndId(connection, userId, id) {
    let [rows] = await connection.query(
      "SELECT id, name, description FROM medication WHERE user_id = ? AND id = ?;",
      [userId, id]
    );
    if (rows.length === 0) throw new Error("medication not found");
    if (rows.length !== 1) throw new Error("duplicate medications found");

    return new Medication(rows.id, rows.name, rows.description);
  }

  static async getAllByUserId(connection, userId) {
    let [rows] = await connection.query(
      "SELECT id, name, description FROM medication WHERE user_id = ?;",
      [userId]
    );

    return rows.map((row) => {
      return new Medication(row.id, row.name, row.description);
    });
  }

  // TODO: deleteByUserIdAndId
}

export { User, Medication };
