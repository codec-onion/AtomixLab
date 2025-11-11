# Guide de Déploiement - AtomixLab Backend sur Render

Ce guide vous accompagne étape par étape pour déployer votre API Node.js/Express sur Render.

---

## Prérequis

- [x] Code poussé sur GitHub (repository AtomixLab)
- [x] Compte MongoDB Atlas avec une base de données configurée
- [x] Compte Render (gratuit) : [render.com](https://render.com)

---

## Étape 1 : Préparer MongoDB Atlas

### 1.1 Obtenir l'URL de connexion

1. Connectez-vous à [MongoDB Atlas](https://cloud.mongodb.com)
2. Sélectionnez votre cluster (Cluster0)
3. Cliquez sur "Connect" > "Connect your application"
4. Copiez l'URL de connexion :
   ```
   mongodb+srv://bonnetmatthieu86:<password>@cluster0.pew2mj6.mongodb.net/AtomixLab?appName=Cluster0
   ```
5. **Remplacez `<password>`** par votre mot de passe réel

### 1.2 Configurer l'accès réseau

1. Dans MongoDB Atlas, allez dans "Network Access"
2. Cliquez sur "Add IP Address"
3. Sélectionnez **"Allow access from anywhere"** (0.0.0.0/0)
4. Confirmez

> **Note** : Render utilise des IPs dynamiques, il faut donc autoriser toutes les IPs.

---

## Étape 2 : Créer le Web Service sur Render

### 2.1 Connexion du repository

1. Allez sur [render.com](https://render.com) et connectez-vous
2. Cliquez sur **"New +"** > **"Web Service"**
3. Connectez votre compte GitHub
4. Sélectionnez le repository **AtomixLab**
5. Cliquez sur **"Connect"**

### 2.2 Configuration du service

Remplissez les champs suivants :

| Champ | Valeur |
|-------|--------|
| **Name** | `atomixlab-api` (ou nom de votre choix) |
| **Region** | `Frankfurt (EU Central)` (ou le plus proche) |
| **Branch** | `main` |
| **Root Directory** | `backend` ⚠️ IMPORTANT |
| **Runtime** | `Node` |
| **Build Command** | *(laisser vide)* |
| **Start Command** | `npm start` |

### 2.3 Plan tarifaire

- Sélectionnez **"Free"** (0€/mois)
- Notez les limitations :
  - 512 MB RAM
  - Le service se met en veille après 15 min d'inactivité
  - Temps de démarrage ~1-2 minutes après veille

---

## Étape 3 : Configurer les Variables d'Environnement

Dans la section **"Environment Variables"**, ajoutez les variables suivantes :

### Variables OBLIGATOIRES

| Clé | Valeur | Exemple |
|-----|--------|---------|
| `NODE_ENV` | `production` | `production` |
| `MONGODB_URI` | Votre URL MongoDB Atlas complète | `mongodb+srv://user:pass@cluster0.pew2mj6.mongodb.net/AtomixLab?appName=Cluster0` |
| `JWT_SECRET` | Secret fort pour JWT (générez-en un nouveau) | `votre-secret-ultra-securise-123456` |
| `JWT_EXPIRES_IN` | Durée de validité du token | `7d` |
| `FRONTEND_URL` | URL de votre frontend en production | `https://votre-frontend.vercel.app` |

### Générer un JWT_SECRET sécurisé

Utilisez cette commande dans votre terminal :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Étape 4 : Déployer

1. Cliquez sur **"Create Web Service"**
2. Render va :
   - Cloner votre repo
   - Installer les dépendances (`npm install`)
   - Démarrer le serveur (`npm start`)
3. Attendez que le statut passe à **"Live"** (1-3 minutes)

---

## Étape 5 : Tester l'API

### 5.1 URL de votre API

Une fois déployé, Render vous fournit une URL :
```
https://atomixlab-api.onrender.com
```

### 5.2 Tester les endpoints

**Health check :**
```bash
curl https://atomixlab-api.onrender.com/health
```

Réponse attendue :
```json
{"status":"ok","timestamp":"2025-11-11T15:30:00.000Z"}
```

**Page d'accueil :**
```bash
curl https://atomixlab-api.onrender.com/
```

Vous devriez voir la liste des endpoints disponibles.

**Lister les cours :**
```bash
curl https://atomixlab-api.onrender.com/api/courses
```

---

## Étape 6 : Connecter le Frontend

### 6.1 Mettre à jour l'URL dans le frontend

Dans votre projet frontend, modifiez `front/src/_services/axios.js` :

```javascript
const axiosInstance = axios.create({
  baseURL: 'https://atomixlab-api.onrender.com/api', // ⬅️ Votre URL Render
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 6.2 Déployer le frontend

- Si sur Vercel/Netlify : Push sur GitHub et le frontend se redéploie automatiquement
- Mettez à jour `FRONTEND_URL` dans Render avec la vraie URL de production

---

## Maintenance et Monitoring

### Logs en temps réel

1. Dans Render, allez dans votre service
2. Onglet **"Logs"** pour voir les logs en direct
3. Utile pour déboguer les erreurs

### Empêcher la mise en veille (optionnel)

Pour garder l'API éveillée, utilisez un service de ping gratuit :

**UptimeRobot :**
1. Créez un compte sur [uptimerobot.com](https://uptimerobot.com)
2. Ajoutez un monitor "HTTP(s)"
3. URL : `https://atomixlab-api.onrender.com/health`
4. Intervalle : 5 minutes

**Ou Cron-job.org :**
1. Créez un compte sur [cron-job.org](https://cron-job.org)
2. Créez un cronjob qui appelle `/health` toutes les 5 minutes

### Redéploiements automatiques

Render redéploie automatiquement quand vous push sur la branche `main`.

Pour désactiver : Settings > Build & Deploy > Auto-Deploy : Off

---

## Dépannage

### ❌ Erreur : "Application failed to respond"

**Cause :** Le port n'est pas correctement configuré.

**Solution :** Vérifiez que `server.js` utilise `process.env.PORT` :
```javascript
const PORT = process.env.PORT || 3000
```

---

### ❌ Erreur de connexion MongoDB

**Cause :** URL incorrecte ou accès réseau bloqué.

**Solutions :**
1. Vérifiez que l'URL `MONGODB_URI` est correcte (avec mot de passe)
2. Vérifiez que "0.0.0.0/0" est autorisé dans MongoDB Atlas > Network Access
3. Vérifiez que le nom de la base est bien dans l'URL : `.../AtomixLab?...`

---

### ❌ Service en veille (temps de réponse lent)

**Cause :** Le plan gratuit met le service en veille après 15 min.

**Solutions :**
1. Utiliser un service de ping (voir section Monitoring)
2. Passer au plan payant (~7$/mois) pour éliminer la veille
3. Accepter le délai initial de 1-2 min au premier appel

---

### ❌ CORS Error depuis le frontend

**Cause :** `FRONTEND_URL` mal configuré.

**Solution :**
1. Dans Render, vérifiez la variable `FRONTEND_URL`
2. Elle doit correspondre exactement à l'URL du frontend (sans `/` à la fin)
3. Exemple : `https://monsite.vercel.app` (pas `https://monsite.vercel.app/`)

---

## Sécurité

### Variables sensibles

- ✅ Les variables d'environnement dans Render sont **chiffrées**
- ✅ Le fichier `.env` local n'est **jamais** commité sur GitHub
- ✅ Utilisez un `JWT_SECRET` différent entre dev et production

### HTTPS

- ✅ Render fournit automatiquement un certificat SSL
- ✅ Votre API est accessible en HTTPS par défaut

---

## Ressources

- [Documentation Render](https://render.com/docs)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Guide Express en production](https://expressjs.com/en/advanced/best-practice-performance.html)

---

## Support

En cas de problème :
1. Vérifiez les logs dans Render
2. Testez les endpoints avec `curl` ou Postman
3. Vérifiez les variables d'environnement

**Votre API est maintenant déployée et prête à l'emploi !** 🚀
