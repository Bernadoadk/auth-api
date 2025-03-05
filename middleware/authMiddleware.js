const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware pour vérifier le token et récupérer l'utilisateur
exports.protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé, aucun token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // Exclure le mot de passe
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};

// Middleware pour vérifier si l'utilisateur est admin
exports.restrictToAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé, rôle administrateur requis" });
  }
  next();
};
