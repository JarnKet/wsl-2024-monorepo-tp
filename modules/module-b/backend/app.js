const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(cors());
app.use(express.json());

// --- Create a dedicated router for our API endpoints ---
const apiRouter = express.Router();

// Mount the router at the full desired base path
app.use("/16_module_b/api", apiRouter);

// Now define routes relative to that base path
apiRouter.get("/users", async (req, res) => {
  // Note: path is now just "/users"
  try {
    const [users] = await pool.query("SELECT * FROM users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`[Module B] Backend running on http://localhost:${PORT}`);
});
