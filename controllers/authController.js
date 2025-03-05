const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Cet email est déjà utilisé." });

    // Créer un nouvel utilisateur
    user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ token: generateToken(user), user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Connexion
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      console.log("🔍 Tentative de connexion avec :", email, password);
  
      const user = await User.findOne({ email }).select("+password"); // Vérifier que le mot de passe est bien récupéré
      if (!user) {
        console.log("❌ Utilisateur non trouvé !");
        return res.status(400).json({ message: "Utilisateur non trouvé." });
      }
  
      console.log("✅ Utilisateur trouvé :", user);
      console.log("📌 Mot de passe stocké en base :", user.password);
  
      const isMatch = await user.comparePassword(password);
  
      console.log("🔍 Comparaison du mot de passe...");
      console.log("Mot de passe fourni :", password);
      console.log("Mot de passe stocké :", user.password);
      console.log("Résultat de bcrypt.compare :", isMatch);
  
      if (!isMatch) {
        console.log("❌ Mot de passe incorrect !");
        return res.status(400).json({ message: "Mot de passe incorrect." });
      }
  
      console.log("✅ Connexion réussie !");
      res.json({ token: generateToken(user), user });
  
    } catch (error) {
      console.error("❌ Erreur serveur :", error);
      res.status(500).json({ message: "Erreur serveur", error });
    }
  };
  
