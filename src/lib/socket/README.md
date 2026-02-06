# Socket.IO Integration

Cette intégration Socket.IO permet la communication en temps réel pour l'application Talemy.

## Architecture

### Fichiers créés

- **`socketClient.ts`** : Gestion de la connexion Socket.IO
- **`SocketProvider.tsx`** : Context Provider React pour gérer les événements socket
- **`index.ts`** : Exports centralisés

### Configuration

Assurez-vous de définir la variable d'environnement :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Fonctionnalités

### 1. Connexion automatique

Le socket se connecte automatiquement quand l'utilisateur est authentifié et se déconnecte lors de la déconnexion.

### 2. Événements gérés

#### Messages

- ✅ `message:new` - Nouveau message reçu (met à jour les conversations et messages)
- ✅ `message:sent` - Confirmation d'envoi

#### Lessons

- ✅ `lesson:created` - Nouveau cours créé
- ✅ `lesson:statusUpdated` - Statut du cours mis à jour

#### Contact Requests

- ✅ `contactRequest:created` - Nouvelle demande de contact
- ✅ `contactRequest:statusUpdated` - Statut de la demande mis à jour

### 3. Fonctions disponibles

```tsx
import { useSocket } from "@/lib/socket";

function MyComponent() {
  const { socket, isConnected, joinConversation, sendMessage } = useSocket();

  // Rejoindre une conversation
  joinConversation(conversationId);

  // Envoyer un message
  sendMessage(conversationId, "Hello!");
}
```

## Intégrations

### Page Messages

La page messages utilise Socket.IO pour :

- Rejoindre automatiquement la conversation sélectionnée
- Envoyer des messages en temps réel
- Recevoir les nouveaux messages instantanément
- Afficher le statut de connexion (en ligne / hors ligne)

### Mise à jour automatique du cache

Tous les événements socket invalident automatiquement les queries React Query appropriées, ce qui déclenche une actualisation des données affichées.

## Avantages

1. **Temps réel** : Les messages, cours et demandes sont mis à jour instantanément
2. **Synchronisation** : Plusieurs onglets/fenêtres restent synchronisés
3. **Expérience utilisateur** : Feedback immédiat pour toutes les actions
4. **Fallback** : En cas de déconnexion socket, l'API HTTP reste fonctionnelle

## Gestion des erreurs

Les erreurs socket sont capturées et loguées dans la console. Le système bascule automatiquement sur l'API HTTP si le socket n'est pas connecté.
