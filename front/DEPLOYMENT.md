# Guide de Déploiement - AtomixLab Frontend sur Vercel

Ce guide vous accompagne étape par étape pour déployer votre application Vue 3 + Vite sur Vercel avec auto-déploiement.

---

## Prérequis

- [x] Code poussé sur GitHub (repository AtomixLab)
- [x] Backend déployé sur Render (voir `backend/DEPLOYMENT.md`)
- [x] Compte Vercel (gratuit) : [vercel.com](https://vercel.com)

---

## Étape 1 : Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"**
3. Sélectionnez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repositories GitHub

---

## Étape 2 : Importer le projet

### 2.1 Démarrer l'import

1. Sur le dashboard Vercel, cliquez sur **"Add New..." → "Project"**
2. Dans la liste des repositories, trouvez **AtomixLab**
3. Cliquez sur **"Import"**

### 2.2 Configuration du projet

Vercel détecte automatiquement Vite, mais configurez ces paramètres :

| Champ | Valeur |
|-------|--------|
| **Project Name** | `atomixlab` (ou nom de votre choix) |
| **Framework Preset** | `Vite` (détecté automatiquement) |
| **Root Directory** | `front` ⚠️ IMPORTANT |
| **Build Command** | `npm run build` (auto-détecté) |
| **Output Directory** | `dist` (auto-détecté) |
| **Install Command** | `npm install` (auto-détecté) |

> **Important :** Le Root Directory DOIT être `front` car votre code frontend est dans ce sous-dossier.

---

## Étape 3 : Configurer les Variables d'Environnement

### 3.1 Ajouter les variables

Avant de déployer, dans la section **"Environment Variables"** :

| Nom de la variable | Valeur | Description |
|-------------------|--------|-------------|
| `VITE_API_URL` | `https://votre-backend.onrender.com/api` | URL complète de votre API backend |

**Exemple concret :**
```
VITE_API_URL=https://atomixlab-api.onrender.com/api
```

> **Note :** Remplacez par l'URL réelle de votre backend Render (disponible dans le dashboard Render).

### 3.2 Environnements

Par défaut, la variable s'applique à :
- ✅ Production
- ✅ Preview
- ✅ Development

Vous pouvez différencier si besoin (par exemple, une API de staging).

---

## Étape 4 : Déployer

1. Cliquez sur **"Deploy"**
2. Vercel va :
   - Cloner votre repository
   - Installer les dépendances (`npm install`)
   - Builder l'application (`npm run build`)
   - Déployer sur le CDN global
3. Attendez que le statut passe à **"Ready"** (30-60 secondes)

---

## Étape 5 : Obtenir l'URL de production

Une fois le déploiement terminé, Vercel vous fournit :

### URL de production
```
https://atomixlab.vercel.app
```
(le nom dépend de votre configuration)

### URLs de preview
Chaque branche et pull request aura sa propre URL :
```
https://atomixlab-git-feature-xyz.vercel.app
```

---

## Étape 6 : Configurer le CORS sur le Backend

⚠️ **IMPORTANT** : Votre backend doit autoriser les requêtes depuis le frontend Vercel.

### 6.1 Mettre à jour la variable d'environnement Render

1. Allez dans votre service backend sur Render
2. Section **"Environment"**
3. Modifiez `FRONTEND_URL` :
   ```
   FRONTEND_URL=https://atomixlab.vercel.app
   ```
4. Cliquez sur **"Save Changes"** (cela redémarre le backend)

> **Note :** Utilisez l'URL exacte fournie par Vercel (sans `/` à la fin).

---

## Étape 7 : Tester l'application

### 7.1 Vérifier le chargement

1. Ouvrez votre URL Vercel dans le navigateur
2. L'application devrait s'afficher correctement

### 7.2 Tester l'API

1. Ouvrez la console développeur (F12)
2. Rechargez la page
3. Vérifiez qu'il n'y a pas d'erreurs CORS
4. Les cours devraient se charger depuis votre API Render

### 7.3 Tester les routes

1. Naviguez dans l'application
2. Rafraîchissez la page (F5) sur différentes routes
3. Grâce à `vercel.json`, aucune erreur 404 ne devrait apparaître

---

## Auto-déploiement : Comment ça marche ?

### Déploiement automatique activé

Vercel surveille votre repository GitHub :

| Action GitHub | Résultat Vercel |
|---------------|-----------------|
| **Push sur `main`** | ✅ Déploiement en production automatique |
| **Push sur autre branche** | ✅ Déploiement preview avec URL unique |
| **Pull Request créée** | ✅ Preview automatique avec lien dans PR |
| **Commit dans PR** | ✅ Mise à jour du preview automatique |

### Notifications

- Vous recevrez un email à chaque déploiement
- Les statuses apparaissent dans GitHub (checks)
- Vous pouvez voir les logs en temps réel dans Vercel

---

## Configuration avancée

### Domaine personnalisé

1. Achetez un domaine (ex: `atomixlab.com`)
2. Dans Vercel : **Settings → Domains → Add Domain**
3. Ajoutez votre domaine
4. Configurez les DNS selon les instructions Vercel
5. HTTPS automatique avec certificat SSL gratuit

### Variables d'environnement par branche

Vous pouvez définir des variables différentes pour :
- Production (branche `main`)
- Preview (autres branches)
- Development (local)

### Protection de branches

Dans **Settings → Git** :
- Protection des déploiements de production
- Exiger des reviews avant merge
- Blocage de déploiements si les checks échouent

---

## Workflow complet Dev → Production

### 1. Développement local

```bash
cd front
npm run dev  # Lance sur http://localhost:5173
```

L'API utilisée : `http://localhost:3000/api` (via `.env.local`)

### 2. Créer une feature branch

```bash
git checkout -b feature/nouvelle-fonctionnalite
# ... faire vos modifications ...
git add .
git commit -m "Ajouter nouvelle fonctionnalité"
git push origin feature/nouvelle-fonctionnalite
```

→ Vercel crée automatiquement un preview sur `https://atomixlab-git-feature-xyz.vercel.app`

### 3. Pull Request

1. Créer une PR sur GitHub
2. Vercel ajoute un commentaire avec l'URL du preview
3. Testez le preview avant de merger

### 4. Merge vers main

```bash
git checkout main
git merge feature/nouvelle-fonctionnalite
git push origin main
```

→ Vercel déploie automatiquement en production sur `https://atomixlab.vercel.app`

---

## Maintenance et Monitoring

### Voir les logs de build

1. Dans Vercel, sélectionnez votre projet
2. Onglet **"Deployments"**
3. Cliquez sur un déploiement
4. Onglet **"Building"** pour voir les logs

### Rollback vers une version précédente

1. Onglet **"Deployments"**
2. Trouvez le déploiement stable
3. Cliquez sur **"⋯"** → **"Promote to Production"**

### Analytics (optionnel)

Vercel propose des analytics gratuits :
- Visiteurs uniques
- Pages vues
- Performances Web Vitals

Activez dans **Settings → Analytics**

---

## Dépannage

### ❌ Erreur : "Build failed"

**Cause :** Erreur de compilation ou dépendance manquante.

**Solutions :**
1. Vérifiez les logs de build dans Vercel
2. Testez le build localement : `npm run build`
3. Vérifiez que toutes les dépendances sont dans `package.json`
4. Assurez-vous que Node.js version est compatible (≥20.19.0)

---

### ❌ Erreur : "404 Not Found" sur routes

**Cause :** Les rewrites Vue Router ne fonctionnent pas.

**Solutions :**
1. Vérifiez que `vercel.json` existe à la racine du projet
2. Contenu de `vercel.json` :
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
3. Redéployez l'application

---

### ❌ Erreur CORS depuis le frontend

**Cause :** Le backend n'autorise pas les requêtes du frontend Vercel.

**Solutions :**
1. Vérifiez `FRONTEND_URL` dans Render
2. Elle doit être exactement : `https://atomixlab.vercel.app` (sans `/` final)
3. Redémarrez le backend Render après modification
4. Testez avec `curl` :
   ```bash
   curl -H "Origin: https://atomixlab.vercel.app" \
        -H "Access-Control-Request-Method: GET" \
        -X OPTIONS \
        https://votre-backend.onrender.com/api/courses
   ```

---

### ❌ API retourne des erreurs 500

**Cause :** Problème backend ou variable d'environnement incorrecte.

**Solutions :**
1. Vérifiez les logs du backend sur Render
2. Testez l'API directement : `curl https://votre-backend.onrender.com/api/courses`
3. Vérifiez que `VITE_API_URL` pointe vers la bonne URL
4. Ouvrez la console du navigateur (F12) → onglet Network pour voir les requêtes

---

### ❌ Temps de réponse lent au premier chargement

**Cause :** Le backend Render (plan gratuit) se met en veille après 15 min d'inactivité.

**Solutions :**
1. Première requête prend 1-2 minutes (temps de réveil)
2. Utilisez UptimeRobot pour garder le backend éveillé (voir `backend/DEPLOYMENT.md`)
3. Ou acceptez ce délai (comportement normal du plan gratuit)

---

### ❌ Variables d'environnement non prises en compte

**Cause :** Les variables Vite doivent commencer par `VITE_`.

**Solutions :**
1. Vérifiez que la variable s'appelle `VITE_API_URL` (pas `API_URL`)
2. Redéployez après modification des variables
3. Variables accessibles via `import.meta.env.VITE_API_URL`

---

## Sécurité

### Variables d'environnement

- ✅ Les variables Vercel sont **chiffrées**
- ✅ `.env.local` n'est **jamais** commité (ignoré par git via `*.local`)
- ✅ Seules les variables `VITE_*` sont exposées au frontend

### HTTPS

- ✅ Vercel fournit automatiquement SSL/TLS
- ✅ HTTP est automatiquement redirigé vers HTTPS
- ✅ Certificats auto-renouvelés

### Headers de sécurité

Vercel configure automatiquement :
- X-Content-Type-Options
- X-Frame-Options
- Strict-Transport-Security (HSTS)

---

## Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Vite Guide de déploiement](https://vitejs.dev/guide/static-deploy.html)
- [Vue Router mode history](https://router.vuejs.org/guide/essentials/history-mode.html)
- [Backend Render](../backend/DEPLOYMENT.md)

---

## Support

En cas de problème :
1. Consultez les logs dans Vercel (onglet Deployments)
2. Vérifiez la console du navigateur (F12)
3. Testez l'API backend directement avec curl ou Postman
4. Vérifiez que les variables d'environnement sont correctement configurées

**Votre frontend est maintenant déployé et se met à jour automatiquement !** 🎉
