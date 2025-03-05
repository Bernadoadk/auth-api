const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { 
      type: String, 
      minlength: 6, 
      required: function () {
        return !this.githubId; // Le mot de passe est requis si l'utilisateur n'a pas de GitHub ID
      }
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    githubId: { type: String, default: null },
  },
  { timestamps: true }
);

// Hashage du mot de passe AVANT de l'enregistrer en base
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Ne pas re-hasher si le mot de passe n'est pas modifié

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("✅ Nouveau hash généré :", this.password);

  next();
});

// Vérification du mot de passe
UserSchema.methods.comparePassword = async function (password) {
  console.log("📌 Test bcrypt.compare() - Mot de passe fourni :", password);
  console.log("📌 Hash stocké :", this.password);
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
