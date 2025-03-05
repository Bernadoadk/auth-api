require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("../config/db");
const passport = require("../config/passport");
const session = require("express-session");
const authRoutes = require("../routes/authRoutes");

// Initialisation de l'application
const app = express();

// Connexion à la base de données
connectDB();

// Middleware de sécurité
app.use(cors());
app.use(helmet());
app.use(express.json());

// Limite de requêtes pour éviter les abus
const limiter = rateLimit({
windowMs: 15 * 60 * 1000, // 15 minutes
max: 100, // Limite de 100 requêtes par IP
message: "Trop de requêtes, veuillez réessayer plus tard.",
});
app.use(limiter);


app.use("/api/auth", authRoutes);

app.use(
    session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Mettre à true en HTTPS
    })
);

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require("../routes/userRoutes");
app.use("/api/users", userRoutes);


// Définition du port et lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));

module.exports = app;
