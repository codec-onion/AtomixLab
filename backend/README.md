# AtomixLab Backend API

API REST Node.js/Express pour la gestion de cours de physique-chimie.

## 🚀 Démarrage rapide

### Prérequis

- Node.js ^20.19.0 ou >=22.12.0
- MongoDB installé et démarré localement ou accès à MongoDB Atlas

### Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Modifier les variables d'environnement si nécessaire
# Par défaut, MongoDB se connecte à localhost:27017
```

### Configuration MongoDB

Si vous utilisez MongoDB localement, assurez-vous qu'il est démarré :

```bash
# macOS avec Homebrew
brew services start mongodb-community

# Linux systemd
sudo systemctl start mongod
```

### Seed de la base de données

Peupler la base de données avec les données initiales :

```bash
npm run seed
```

Cela créera :
- Un utilisateur admin : `admin@atomixlab.com` / `admin123`
- Tous les cours du fichier `front/public/cours.json`

Pour supprimer toutes les données :

```bash
npm run seed:delete
```

### Lancer le serveur

```bash
# Mode développement (avec auto-reload)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 📚 Documentation API

### Authentification

#### Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "user" // optionnel, par défaut "user"
}
```

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Retourne un token JWT à utiliser dans les requêtes protégées.

#### Récupérer l'utilisateur actuel
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Cours

#### Liste des cours (avec filtres optionnels)
```http
GET /api/courses
GET /api/courses?session=2024-2025
GET /api/courses?niveauScolaire=Seconde Générale
GET /api/courses?thematique=Constitution et transformations de la matière
GET /api/courses?type=Chimie
GET /api/courses?search=réactions
```

#### Récupérer un cours par ID
```http
GET /api/courses/:id
```

#### Créer un cours (admin uniquement)
```http
POST /api/courses
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Titre du cours",
  "thematiqueId": "uuid",
  "thematique": "Nom de la thématique",
  "niveauScolaireId": "uuid",
  "niveauScolaire": "Seconde Générale",
  "sessionIds": ["uuid1", "uuid2"],
  "session": "2024-2025",
  "type": "Chimie"
}
```

#### Modifier un cours (admin uniquement)
```http
PUT /api/courses/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Nouveau titre",
  ...
}
```

#### Supprimer un cours (admin uniquement)
```http
DELETE /api/courses/:id
Authorization: Bearer {token}
```

#### Liste des sessions disponibles
```http
GET /api/courses/sessions/list
```

## 🔒 Sécurité

- Les mots de passe sont hashés avec bcrypt
- Authentification par JWT (JSON Web Tokens)
- Les routes de modification (POST, PUT, DELETE) nécessitent un token valide
- Les opérations CRUD sur les cours sont réservées aux admins

## 🛠️ Scripts disponibles

```bash
npm run dev          # Démarrer en mode développement
npm start            # Démarrer en mode production
npm run seed         # Peupler la base de données
npm run seed:delete  # Vider la base de données
npm run lint         # Vérifier le code avec ESLint
npm run format       # Formater le code avec Prettier
```

## 📁 Structure du projet

```
backend/
├── src/
│   ├── config/          # Configuration (DB, etc.)
│   │   └── db.js
│   ├── models/          # Modèles Mongoose
│   │   ├── User.js
│   │   └── Course.js
│   ├── controllers/     # Logique métier
│   │   ├── authController.js
│   │   └── courseController.js
│   ├── routes/          # Routes Express
│   │   ├── auth.js
│   │   └── courses.js
│   ├── middlewares/     # Middlewares personnalisés
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── server.js        # Point d'entrée
│   └── seed.js          # Script de seed
├── .env                 # Variables d'environnement
├── .env.example         # Exemple de .env
├── package.json
└── README.md
```

## 🌍 Variables d'environnement

```env
# Serveur
PORT=3000
NODE_ENV=development

# Base de données
MONGODB_URI=mongodb://localhost:27017/atomixlab

# JWT
JWT_SECRET=votre-secret-jwt
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

## 🔗 Intégration avec le Frontend

Le frontend Vue.js est configuré pour communiquer avec cette API. Les services sont dans `front/src/_services/` :
- `axios.js` - Configuration Axios avec intercepteurs JWT
- `donnees.service.js` - Appels API pour les cours
- `auth.service.js` - Appels API pour l'authentification

## 📝 Notes

- La base de données MongoDB doit être démarrée avant de lancer le serveur
- Par défaut, les routes GET sont publiques
- Les routes POST/PUT/DELETE nécessitent une authentification admin
- Les tokens JWT expirent après 7 jours (configurable dans .env)
