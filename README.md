# AtomixLab 🧪⚛️

Plateforme web pour consulter et archiver les cours de physique-chimie.

## 📋 Prérequis

- **Node.js** ^20.19.0 ou >=22.12.0
- **MongoDB** (local ou Atlas)
- **npm** ou **yarn**

## 🚀 Démarrage rapide

### 1. Installation MongoDB

**macOS (avec Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Ou utilisez MongoDB Atlas** (cloud gratuit) et modifiez `MONGODB_URI` dans `backend/.env`

### 2. Installation du projet

Cloner le dépôt et installer les dépendances :

```bash
# Racine du projet
git clone <repository-url>
cd AtomixLab

# Frontend
cd front
npm install

# Backend
cd ../backend
npm install
```

### 3. Configuration du Backend

```bash
cd backend

# Les fichiers .env et .env.example existent déjà
# Modifier .env si nécessaire (par défaut MongoDB local)

# Peupler la base de données
npm run seed
```

Cela créera :
- Un admin : `admin@atomixlab.com` / `admin123`
- Tous les cours de démonstration

### 4. Lancer l'application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Serveur disponible sur http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd front
npm run dev
# Application disponible sur http://localhost:5173
```

## 📁 Structure du projet

```
AtomixLab/
├── front/              → Application Vue.js
│   ├── src/
│   │   ├── _services/  → Appels API (axios, auth, courses)
│   │   ├── assets/     → CSS, images
│   │   ├── components/ → Composants Vue
│   │   ├── stores/     → Pinia stores
│   │   ├── views/      → Pages
│   │   └── router/     → Vue Router
│   └── package.json
│
├── backend/            → API REST Node.js/Express
│   ├── src/
│   │   ├── config/     → Configuration DB
│   │   ├── models/     → Modèles Mongoose
│   │   ├── controllers/→ Logique métier
│   │   ├── routes/     → Routes Express
│   │   ├── middlewares/→ Middlewares custom
│   │   ├── server.js   → Point d'entrée
│   │   └── seed.js     → Script de seed
│   └── package.json
│
├── CLAUDE.md           → Documentation technique complète
└── README.md           → Ce fichier
```

## 🛠️ Commandes disponibles

### Frontend (front/)
```bash
npm run dev       # Dev server avec hot reload
npm run build     # Build de production
npm run preview   # Preview du build
npm run format    # Formater le code
```

### Backend (backend/)
```bash
npm run dev           # Dev server avec auto-reload (nodemon)
npm start             # Production server
npm run seed          # Peupler la base de données
npm run seed:delete   # Vider la base de données
npm run lint          # Vérifier le code
npm run format        # Formater le code
```

## 🔐 Authentification

Par défaut, un utilisateur admin est créé lors du seed :
- **Email:** `admin@atomixlab.com`
- **Password:** `admin123`

Pour créer d'autres utilisateurs, utilisez l'endpoint `/api/auth/register`.

## 📚 API Documentation

L'API est documentée dans le fichier `backend/README.md`.

Endpoints principaux :
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/courses` - Liste des cours (avec filtres)
- `POST /api/courses` - Créer un cours (admin)
- `PUT /api/courses/:id` - Modifier un cours (admin)
- `DELETE /api/courses/:id` - Supprimer un cours (admin)

## 🔧 Configuration

### Variables d'environnement Backend

Le fichier `backend/.env` contient :
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/atomixlab
JWT_SECRET=atomixlab-dev-secret-key-2024-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

**⚠️ En production, changez le JWT_SECRET !**

## 🎯 Fonctionnalités

### Frontend
- ✅ Affichage de la liste des cours
- ✅ Filtres par session, niveau, thématique
- ✅ Design responsive
- ✅ Intégration avec l'API REST
- ⏳ Authentification UI (à venir)
- ⏳ CRUD interface pour admin (à venir)

### Backend
- ✅ API REST complète
- ✅ Authentification JWT
- ✅ CRUD complet sur les cours
- ✅ Filtres avancés
- ✅ Protection des routes (role-based)
- ✅ Validation des données
- ✅ Gestion d'erreurs globale

## 🧪 Tests

Pour tester l'API, vous pouvez utiliser :
- **Postman** ou **Insomnia**
- **curl** en ligne de commande
- L'interface frontend une fois connecté

Exemple avec curl :
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@atomixlab.com","password":"admin123"}'

# Récupérer les cours
curl http://localhost:3000/api/courses
```

## 📖 Documentation technique

Pour plus de détails techniques, consultez `CLAUDE.md` qui contient :
- Architecture détaillée frontend/backend
- Patterns de code utilisés
- Structure des données
- Flux d'authentification
- Et bien plus...

## 🤝 Contribution

Pour contribuer au projet, veuillez :
1. Créer une branche depuis `main`
2. Faire vos modifications
3. Tester localement
4. Créer une Pull Request

## 📝 License

ISC