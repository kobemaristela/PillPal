import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import morgan from "morgan";

// Routes
import apiRoutes from "./api-routes.js";

dotenv.config();

const PORT = process.env["PORT"] || 8080;
const JWT_SECRET = process.env["JWT_SECRET"] || "JWT_SECRET";

const MYSQL_ADDRESS = process.env["MYSQL_ADDRESS"];
const MYSQL_USER = process.env["MYSQL_USER"];
const MYSQL_PASSWORD = process.env["MYSQL_PASSWORD"];
const MYSQL_DATABASE = process.env["MYSQL_DATABASE"];

if (!MYSQL_ADDRESS)
  throw new Error("missing `MYSQL_ADDRESS` environment variable`");

if (!MYSQL_USER) throw new Error("missing `MYSQL_USER` environment variable`");

if (!MYSQL_DATABASE)
  throw new Error("missing `MYSQL_DATABASE` environment variable`");

async function main() {
  const pool = await mysql.createPool({
    host: MYSQL_ADDRESS,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    connectionLimit: 10,
  });

  const app = express();
  app.locals.pool = pool;
  app.locals.JWT_SECRET = JWT_SECRET;

  app.use(express.json());
  app.use(morgan("combined"));
  app.use(express.static("dist"));
  app.use("/api", apiRoutes);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch(console.error);
