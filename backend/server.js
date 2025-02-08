const express = require("express");
const sql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database Connection
const db = sql.createConnection({
  host: "localhost",
  port: 3306,
  database: "skill_swap",
  user: "Dhanush",
  password: "Dhanush@25",
});

db.connect(function (err) {
  if (err) {
    console.log("Error occurred while connecting to the database.");
  } else {
    console.log("Connected to MySQL successfully.");
  }
});

// API Routes
app.get("/", async (req, res) => {
  res.send("API Running");
});

app.post("/register", (req, res) => {
  const { username, email, password, offeredSkills, desiredSkills, experienceLevel, availability, rating } = req.body;

  if (!username || !email || !password || !offeredSkills || !desiredSkills || !experienceLevel || !availability) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const checkUserQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.query(checkUserQuery, [username, email], (err, results) => {
    if (err) {
      console.error("Error checking user:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: "Username or Email already exists" });
    }

    const sql = `
          INSERT INTO users (username, email, password, offeredSkills, desiredSkills, experienceLevel, availability, rating)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

    db.query(sql, [username, email, password, offeredSkills, desiredSkills, experienceLevel, availability, rating || 3], (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "User added successfully", userId: result.insertId });
    });
  });
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});


app.get("/getreqs", async(req,res) => {
  console.log(req.params);
})

app.post("/req", async(req,res) => {
  const { user_id, receiver_id, skills, desired_skills, message } = req.body;

    // Validate required fields
    if (!user_id || !receiver_id || !skills || !desired_skills || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert request into the database
    const sql = `
        INSERT INTO skill_requests (user_id, receiver_id, skills, desired_skills, message)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [user_id, receiver_id, skills, desired_skills, message], (err, result) => {
        if (err) {
            console.error('Error inserting request:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        res.status(201).json({ 
            message: 'Request sent successfully', 
            request_id: result.insertId 
        });
    });
})

app.post("/login", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, Email, and Password are required" });
  }

  const sql = `SELECT * FROM users WHERE username = ? AND email = ? AND password = ?`;

  db.query(sql, [username, email, password], (err, results) => {
    if (err) {
      console.error("Error checking user:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user: results[0] });
  });
});

// Serve React Frontend
const buildPath = path.join(__dirname, "frontend/build");
app.use(express.static(buildPath));

// Fallback to React for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
