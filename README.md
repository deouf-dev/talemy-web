# 📚 Talemy

**Talemy** est une plateforme web moderne de mise en relation entre professeurs particuliers et élèves. L'application facilite la recherche de tuteurs qualifiés, la planification de cours et la gestion des sessions d'apprentissage personnalisées.

## ✨ Fonctionnalités

### Pour les Élèves

- 🔍 **Recherche de professeurs** - Parcourez les profils des enseignants avec filtres avancés (matière, disponibilité, tarifs)
- 📅 **Planification de cours** - Réservez des sessions avec vos professeurs préférés
- 💬 **Messagerie en temps réel** - Communiquez directement avec vos enseignants
- 📊 **Tableau de bord personnalisé** - Suivez vos cours à venir, votre progression et vos statistiques
- ⭐ **Système d'avis** - Consultez et laissez des avis sur vos expériences
- 👤 **Gestion de profil** - Personnalisez votre profil d'apprentissage

### Pour les Professeurs

- 📋 **Profil professionnel** - Présentez vos compétences, expériences et disponibilités
- 📆 **Gestion d'emploi du temps** - Définissez vos créneaux disponibles
- 💼 **Gestion des demandes** - Acceptez ou refusez les demandes de cours
- 📨 **Communication élèves** - Restez en contact avec vos élèves via la messagerie intégrée
- 📈 **Suivi des sessions** - Gérez toutes vos sessions d'enseignement

## 🛠️ Technologies

### Frontend

- **Next.js 16** - Framework React avec App Router
- **React 19** - Interface utilisateur moderne et réactive
- **TypeScript** - Typage statique pour une meilleure maintenabilité
- **Tailwind CSS 4** - Styling utilitaire moderne
- **shadcn/ui** - Composants UI accessibles et personnalisables (Radix UI)
- **Framer Motion** - Animations fluides
- **Lucide React** - Icônes élégantes

### State Management & Data Fetching

- **TanStack Query (React Query)** - Gestion des états serveur et cache
- **React Context** - Gestion de l'authentification et des états globaux

### Communication Temps Réel

- **Socket.io Client** - Messagerie instantanée et notifications en temps réel

## 🚀 Installation

### Prérequis

- Node.js 20.x ou supérieur
- npm ou yarn
- Un backend API compatible - [talemy-api](https://github.com/deouf-dev/talemy-api)

### Étapes d'installation

1. **Cloner le repository**

```bash
git clone https://github.com/deouf-dev/talemy-web.git
cd talemy-web
```

2. **Installer les dépendances**

```bash
npm install
# ou
yarn install
```

3. **Configuration des variables d'environnement**
   Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

4. **Lancer le serveur de développement**

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
src/
├── app/                    # Pages et routes Next.js (App Router)
│   ├── (app)/             # Routes protégées (authentifiées)
│   │   ├── dashboard/     # Tableau de bord élève
│   │   └── teachers/      # Navigation des professeurs
│   └── (public)/          # Routes publiques
│       ├── login/         # Connexion
│       └── register/      # Inscription
├── components/            # Composants React réutilisables
│   ├── chat/             # Composants de messagerie
│   ├── dashboard/        # Composants du tableau de bord
│   ├── teachers/         # Composants liés aux professeurs
│   └── ui/               # Composants UI de base (shadcn/ui)
├── features/              # Logique métier par domaine
│   ├── auth/             # Authentification et autorisation
│   ├── conversations/    # Gestion des conversations
│   ├── dashboard/        # Logique du tableau de bord
│   ├── profile/          # Gestion des profils
│   ├── requests/         # Demandes de cours
│   └── teachers/         # Logique des professeurs
├── lib/                   # Utilitaires et configuration
│   ├── api/              # Client API et fetch personnalisé
│   ├── auth/             # Utilitaires d'authentification
│   ├── config/           # Configuration de l'app
│   └── socket/           # Configuration Socket.io
└── providers/             # Providers React (Query, Auth, Socket)
```

## 🔧 Scripts Disponibles

```bash
npm run dev      # Lance le serveur de développement
npm run build    # Compile l'application pour la production
npm run start    # Lance l'application en production
npm run lint     # Vérifie le code avec ESLint
```

## 🎨 Personnalisation

L'application utilise **shadcn/ui** avec une configuration personnalisable via [components.json](components.json). Les thèmes et couleurs peuvent être modifiés dans [src/app/globals.css](src/app/globals.css).

## 🔐 Authentification

L'application gère plusieurs types d'utilisateurs :

- **Élèves** - Accès au tableau de bord, recherche de professeurs, réservation de cours
- **Professeurs** - Gestion du profil professionnel, emploi du temps, demandes de cours

L'authentification est gérée via JWT tokens stockés de manière sécurisée.

## 🌐 Architecture

L'application suit une architecture moderne basée sur :

- **Feature-based structure** - Organisation par domaine métier
- **Server Components** et **Client Components** - Optimisation des performances Next.js
- **API Routes** - Communication avec le backend via des utilitaires dédiés
- **Real-time updates** - Socket.io pour les fonctionnalités temps réel

## 📝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence [LICENSE](LICENSE).

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

---

**Développé avec ❤️ pour faciliter l'apprentissage**
