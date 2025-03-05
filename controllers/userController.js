const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


// Mise à jour du profil utilisateur
exports.updateProfile = async (req, res) => {
try {
    const { name, email } = req.body;

    // Trouver l'utilisateur connecté
    const user = await User.findById(req.user.id);

    if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Mettre à jour uniquement les champs fournis
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
    message: "Profil mis à jour avec succès",
    user,
    });
} catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
}
};

// Changer le mot de passe
exports.updatePassword = async (req, res) => {
    try {
    const { currentPassword, newPassword } = req.body;

    // Vérifier que l'utilisateur est connecté
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si l'utilisateur a un mot de passe (GitHub users n'en ont pas)
    if (!user.password) {
        return res.status(400).json({ message: "Vous devez d'abord définir un mot de passe." });
    }

    // Vérifier que l'ancien mot de passe est correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Ancien mot de passe incorrect." });
    }

    // Hasher et mettre à jour le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log("Ancien Hash:", user.password); // Affiche l'ancien hash
    console.log("Nouveau Hash:", hashedPassword); // Affiche le nouveau hash
    user.password = hashedPassword;
    
    // Sauvegarder sans validation supplémentaire
    await user.save();

    // Générer un nouveau token JWT après la mise à jour
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ message: "Mot de passe mis à jour avec succès.", token });
    console.log("Mot de passe mis à jour en base !");
    } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
    }
};


exports.setPassword = async (req, res) => {
    try {
    const { newPassword } = req.body;

    // Vérifier que l'utilisateur est connecté
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Vérifier que l'utilisateur vient de GitHub (n'a pas encore de mot de passe)
    if (user.password) {
        return res.status(400).json({
        message: "Vous avez déjà un mot de passe. Utilisez la modification de mot de passe classique.",
        });
    }

    // Vérifier que le mot de passe est fourni
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    // Hacher et enregistrer le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Mot de passe ajouté avec succès. Vous pouvez maintenant vous connecter avec votre email." });
    } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
    }
};
