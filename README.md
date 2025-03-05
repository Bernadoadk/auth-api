# 🚀 API d'Authentification Avancée

## 📌 Introduction
Cette API permet aux utilisateurs de s'inscrire, se connecter et gérer leur session de manière sécurisée avec **JWT et OAuth2 (GitHub)**. Elle inclut :
- Authentification par **email/password** et **GitHub OAuth2**
- Gestion des rôles (`user`, `admin`)
- Mise à jour du profil utilisateur
- Changement de mot de passe
- Sécurisation des routes avec JWT

---

## ⚙️ Installation

### 1️⃣ **Cloner le projet**
```bash
git clone https://github.com/Bernadoadk/auth-api.git
cd auth-api
```

### 2️⃣ **Installer les dépendances**
```bash
npm install
```

### 3️⃣ **Créer un fichier `.env`**
Ajoutez vos variables d'environnement :
```ini
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/auth-api
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=1d
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 4️⃣ **Lancer le serveur**
```bash
npx nodemon src/server.js
```

---

## 🔑 **Routes Principales**

### **1️⃣ Inscription**
```http
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### **2️⃣ Connexion**
```http
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### **3️⃣ Connexion via GitHub**
Redirige l'utilisateur vers :
```
GET http://localhost:5000/api/auth/github
```
Après connexion, un **token JWT** est retourné.

---

## 👤 **Gestion des utilisateurs**

### **1️⃣ Récupérer son profil**
```http
GET /api/users/profile
Authorization: Bearer <token>
```

### **2️⃣ Mettre à jour son profil**
```http
PUT /api/users/profile
Authorization: Bearer <token>
{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

### **3️⃣ Changer son mot de passe**
```http
PUT /api/users/password
Authorization: Bearer <token>
{
  "currentPassword": "ancienMotDePasse",
  "newPassword": "nouveauMotDePasse"
}
```

### **4️⃣ Accéder à une route admin**
```http
GET /api/users/admin
Authorization: Bearer <token>
```

---

## 🛠 **Technologies utilisées**
- **Node.js** + Express.js
- **MongoDB (MongoDB Atlas)**
- **Passport.js** pour OAuth2 (GitHub)
- **JWT** pour l'authentification
- **Bcrypt.js** pour le hashage des mots de passe
- **Helmet, CORS, Express-rate-limit** pour la sécurité

---

## ✅ **Tests**
Utilisez Postman ou Curl pour tester les endpoints.

---

## 📜 **Auteur**
Développé par **Bernado Adikpeto**. 🚀
