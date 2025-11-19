# 🔧 API SerTiznit - Gestion des Artisans

API REST pour la gestion des artisans de l'entreprise SerTiznit à Tiznit, Maroc.

## 📋 Table des Matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration PostgreSQL](#configuration-postgresql)
- [Démarrage](#démarrage)
- [Tests Postman](#tests-postman)
- [Structure du Projet](#structure-du-projet)

---

## 🛠️ Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 16 ou supérieure) - [Télécharger](https://nodejs.org/)
- **PostgreSQL** (version 12 ou supérieure) - [Télécharger](https://www.postgresql.org/download/)
- **Postman** - [Télécharger](https://www.postman.com/downloads/)
- Un éditeur de code (VS Code recommandé)

---

## 📦 Installation

### 1. Créer le dossier du projet

```bash
mkdir sertiznit-api
cd sertiznit-api
```

### 2. Initialiser le projet Node.js

```bash
npm init -y
```

### 3. Installer les dépendances

```bash
npm install express pg-promise
npm install -D @types/node @types/express typescript tsx
```

### 4. Modifier package.json

Ajoutez ces lignes dans `package.json` :

```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "tsx watch server.ts"
  }
}
```

### 5. Créer les fichiers

Créez deux fichiers :
- `server.ts` (code TypeScript de l'API)
- `database.sql` (script SQL pour créer la base de données)

---

## 🗄️ Configuration PostgreSQL

### 1. Ouvrir pgAdmin ou psql

Pour **pgAdmin** :
- Ouvrir pgAdmin
- Se connecter au serveur PostgreSQL local

Pour **psql** (ligne de commande) :
```bash
psql -U postgres
```

### 2. Créer la base de données

```sql
CREATE DATABASE sertiznit_db;
```

### 3. Exécuter le script SQL

Copiez tout le contenu du fichier `database.sql` et exécutez-le dans pgAdmin ou psql.

### 4. Vérifier les données

```sql
SELECT * FROM artisans;
```

Vous devriez voir 10 artisans de test.

### 5. Configurer les identifiants dans server.ts

Modifiez cette section avec vos informations PostgreSQL :

```typescript
const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'sertiznit_db',
  user: 'postgres',              // ← Votre nom d'utilisateur PostgreSQL
  password: 'votre_mot_de_passe' // ← Votre mot de passe PostgreSQL
});
```

---

## 🚀 Démarrage

### 1. Compiler et démarrer le serveur

```bash
npm run dev
```

Vous devriez voir :
```
✅ Connexion à PostgreSQL réussie
🚀 Serveur SerTiznit démarré sur http://localhost:3000
📚 Documentation disponible sur http://localhost:3000
```

### 2. Tester la connexion

Ouvrez votre navigateur et allez sur :
```
http://localhost:3000
```

Vous verrez la documentation de l'API.

---

## 📮 Tests Postman

### Configuration Rapide

1. **Ouvrir Postman**
2. **Créer une nouvelle collection** nommée "SerTiznit API"
3. **Ajouter les requêtes** suivantes :

### Test 1 : POST - Ajouter un artisan

```
POST http://localhost:3000/artisans
```

**Headers :**
```
Content-Type: application/json
```

**Body (raw JSON) :**
```json
{
  "nom": "Boudali",
  "prenom": "Hicham",
  "profession": "Électricien",
  "telephone": "0612345678",
  "email": "hicham.boudali@email.com",
  "adresse": "Avenue Hassan II, Tiznit",
  "rating": 4.5
}
```

✅ **Statut attendu :** 201 Created

---

### Test 2 : GET - Tous les artisans

```
GET http://localhost:3000/artisans
```

✅ **Statut attendu :** 200 OK

---

### Test 3 : GET - Un artisan par ID

```
GET http://localhost:3000/artisans/1
```

✅ **Statut attendu :** 200 OK

---

### Test 4 : PUT - Modifier un artisan

```
PUT http://localhost:3000/artisans/1
```

**Body :**
```json
{
  "telephone": "0698765432",
  "rating": 5.0
}
```

✅ **Statut attendu :** 200 OK

---

### Test 5 : DELETE - Supprimer un artisan

```
DELETE http://localhost:3000/artisans/11
```

✅ **Statut attendu :** 200 OK

---

### Test 6 : Gestion d'erreur - ID inexistant

```
GET http://localhost:3000/artisans/999
```

✅ **Statut attendu :** 404 Not Found

---

## 🌟 Tests Bonus (Optionnel)

### Recherche par profession

```
GET http://localhost:3000/artisans/search?profession=Plombier
```

### Statistiques totales

```
GET http://localhost:3000/stats/total
```

### Filtrer par rating

```
GET http://localhost:3000/artisans/filter/rating?min=4.5
```

---

## 📁 Structure du Projet

```
sertiznit-api/
│
├── server.ts           # Code principal de l'API
├── database.sql        # Script de création de la base
├── package.json        # Dépendances du projet
├── package-lock.json   # Verrouillage des versions
└── README.md           # Documentation
```

---

## 🎯 Endpoints de l'API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/artisans` | Ajouter un artisan |
| GET | `/artisans` | Liste tous les artisans |
| GET | `/artisans/:id` | Détails d'un artisan |
| PUT | `/artisans/:id` | Modifier un artisan |
| DELETE | `/artisans/:id` | Supprimer un artisan |
| GET | `/artisans/search?profession=` | Recherche par profession (bonus) |
| GET | `/stats/total` | Statistiques générales (bonus) |
| GET | `/artisans/filter/rating?min=` | Filtrer par note (bonus) |

---

## 🔍 Professions Valides

- Électricien
- Plombier
- Peintre
- Menuisier
- Technicien climatisation
- Maçon
- Serrurier
- Jardinier

---

## ✅ Validation des Données

### Téléphone
Format accepté : `06XXXXXXXX` ou `07XXXXXXXX` (10 chiffres)

### Rating
Valeur entre 0 et 5 (décimal)

### Champs Obligatoires
- nom
- prenom
- profession
- telephone

---

## 🐛 Résolution de Problèmes

### Erreur : "Cannot connect to PostgreSQL"

**Solution :**
1. Vérifiez que PostgreSQL est démarré
2. Vérifiez les identifiants dans `server.ts`
3. Vérifiez que la base `sertiznit_db` existe

### Erreur : "Port 3000 already in use"

**Solution :**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Erreur : "Module not found"

**Solution :**
```bash
npm install
```

---

## 📸 Captures d'Écran pour le Rapport

Prenez des captures de :
1. ✅ Postman - POST réussi
2. ✅ Postman - GET all artisans
3. ✅ Postman - GET by ID
4. ✅ Postman - PUT update
5. ✅ Postman - DELETE
6. ✅ Postman - Erreur 404
7. ⭐ pgAdmin - Table artisans
8. ⭐ Terminal - Serveur démarré

---

## 👨‍💻 Auteur

Projet développé pour SerTiznit - Entreprise de services à Tiznit, Maroc

---

## 📝 Licence

Projet éducatif - Libre d'utilisation

---

## 🙏 Support

Pour toute question, contactez votre formateur ou consultez la documentation officielle :
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [pg-promise](https://vitaly-t.github.io/pg-promise/)