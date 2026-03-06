import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("gaming.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    genre TEXT,
    platform TEXT,
    rating REAL,
    release_date TEXT,
    banner_url TEXT,
    thumbnail_url TEXT,
    trailer_id TEXT,
    developer TEXT,
    publisher TEXT,
    min_requirements TEXT,
    rec_requirements TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS wishlist (
    user_id INTEGER,
    game_id INTEGER,
    PRIMARY KEY (user_id, game_id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER,
    user_id INTEGER,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data if empty
const gameCount = db.prepare("SELECT COUNT(*) as count FROM games").get() as { count: number };
if (gameCount.count === 0) {
  const insertGame = db.prepare(`
    INSERT INTO games (title, description, genre, platform, rating, release_date, banner_url, thumbnail_url, trailer_id, developer, publisher, min_requirements, rec_requirements)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const games = [
    [
      "Cyberpunk 2077",
      "Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival.",
      "RPG, Action",
      "PC, PS5, Xbox Series X",
      4.5,
      "2020-12-10",
      "https://images.unsplash.com/photo-1605898835373-023ad0a70251?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605898835373-023ad0a70251?q=80&w=500&auto=format&fit=crop",
      "8X2kIfS6fb8",
      "CD Projekt Red",
      "CD Projekt",
      "Intel Core i5-3570K / AMD FX-8310, 8GB RAM, GTX 780 / Radeon RX 470",
      "Intel Core i7-4790 / AMD Ryzen 3 3200G, 12GB RAM, GTX 1060 6GB / Radeon R9 Fury"
    ],
    [
      "Elden Ring",
      "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
      "RPG, Souls-like",
      "PC, PS4, PS5, Xbox",
      4.9,
      "2022-02-25",
      "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=500&auto=format&fit=crop",
      "E3Huyic7K6k",
      "FromSoftware",
      "Bandai Namco",
      "Intel Core i5-8400 / AMD Ryzen 3 3300X, 12GB RAM, GTX 1060 3GB",
      "Intel Core i7-8700K / AMD Ryzen 5 3600X, 16GB RAM, GTX 1070 8GB"
    ],
    [
      "God of War Ragnarök",
      "Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle that will end the world.",
      "Action, Adventure",
      "PS4, PS5",
      4.8,
      "2022-11-09",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=500&auto=format&fit=crop",
      "hfJ4Km46A-0",
      "Santa Monica Studio",
      "Sony Interactive Entertainment",
      "N/A (Console Exclusive)",
      "N/A (Console Exclusive)"
    ],
    [
      "The Witcher 3: Wild Hunt",
      "The Witcher: Wild Hunt is a story-driven open world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.",
      "RPG",
      "PC, PS4, PS5, Xbox",
      4.9,
      "2015-05-19",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=500&auto=format&fit=crop",
      "XHrskkBa9RE",
      "CD Projekt Red",
      "CD Projekt",
      "Intel Core i5-2500K / AMD Phenom II X4 940, 6GB RAM, GTX 660",
      "Intel Core i7-3770 / AMD FX-8350, 8GB RAM, GTX 770"
    ],
    [
      "Red Dead Redemption 2",
      "America, 1899. Arthur Morgan and the Van der Linde gang are outlaws on the run. With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America in order to survive.",
      "Action, Adventure",
      "PC, PS4, Xbox",
      4.9,
      "2018-10-26",
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=500&auto=format&fit=crop",
      "eaW0tYpxn0k",
      "Rockstar Games",
      "Rockstar Games",
      "Intel Core i5-2500K / AMD FX-6300, 8GB RAM, GTX 770 2GB",
      "Intel Core i7-4770K / AMD Ryzen 5 1500X, 12GB RAM, GTX 1060 6GB"
    ]
  ];

  for (const game of games) {
    insertGame.run(...game);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/games", (req, res) => {
    const { genre, search, sort } = req.query;
    let query = "SELECT * FROM games WHERE 1=1";
    const params: any[] = [];

    if (genre && genre !== "All") {
      query += " AND genre LIKE ?";
      params.push(`%${genre}%`);
    }

    if (search) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (sort === "rating") {
      query += " ORDER BY rating DESC";
    } else if (sort === "newest") {
      query += " ORDER BY release_date DESC";
    } else {
      query += " ORDER BY title ASC";
    }

    const games = db.prepare(query).all(...params);
    res.json(games);
  });

  app.get("/api/games/:id", (req, res) => {
    const game = db.prepare("SELECT * FROM games WHERE id = ?").get(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json(game);
  });

  app.get("/api/games/:id/reviews", (req, res) => {
    const reviews = db.prepare(`
      SELECT r.*, u.username 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.game_id = ?
      ORDER BY r.created_at DESC
    `).all(req.params.id);
    res.json(reviews);
  });

  app.post("/api/reviews", (req, res) => {
    const { game_id, user_id, rating, comment } = req.body;
    const result = db.prepare("INSERT INTO reviews (game_id, user_id, rating, comment) VALUES (?, ?, ?, ?)").run(game_id, user_id, rating, comment);
    res.json({ id: result.lastInsertRowid });
  });

  // Simple Auth (Mock for now, but functional)
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user) {
      // Auto-register for demo purposes
      const result = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)").run(email.split('@')[0], email, password);
      user = { id: result.lastInsertRowid, username: email.split('@')[0], email };
    }
    res.json(user);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
