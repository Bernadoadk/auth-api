const express = require("express");
const { protect, restrictToAdmin } = require("../middleware/authMiddleware");
const { updateProfile, updatePassword, setPassword } = require("../controllers/userController");

const router = express.Router();

// Route accessible uniquement aux utilisateurs connectés (Récupération du profil)
router.get("/profile", protect, (req, res) => {
res.json(req.user);
});

// Route pour mettre à jour le profil utilisateur
router.put("/profile", protect, updateProfile);

// Route accessible uniquement aux administrateurs
router.get("/admin", protect, restrictToAdmin, (req, res) => {
res.json({ message: "Bienvenue, administrateur !" });
});

// Route pour changer le mot de passe
router.put("/password", protect, updatePassword);

// Route pour définir un mot de passe si l'utilisateur vient de GitHub
router.put("/set-password", protect, setPassword);

module.exports = router;
