# Vite — l'outillage qui fait tourner et compile le frontend

## Avant de lire — Reconnaître (à froid)

1. Quand tu fais `mvn spring-boot:run` (ou Run dans l'IDE), Spring Boot démarre un serveur Tomcat embarqué sans que tu configures rien à part. Côté React/TypeScript, un navigateur peut-il exécuter directement un fichier `.tsx` tel quel ?
2. Dans `frontend/src/api/axios.ts` : `baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'`. À ton avis, d'où vient cette valeur `VITE_API_BASE_URL` ?
3. `package.json` du frontend a deux scripts : `"dev": "vite"` et `"build": "vite build"`. Que produit chacun, à ton avis ?

## Explication ancrée

Tu as ce confort avec Spring Boot : `mvn spring-boot:run` te donne un serveur qui tourne immédiatement, sans configurer Tomcat à la main (mastered). Côté frontend, il faut un outil équivalent, pour une raison différente : le navigateur ne comprend ni TypeScript ni JSX nativement — il faut les transformer en JavaScript avant de les servir. **Vite** est cet outil : un serveur de développement qui transforme et sert ton code React/TypeScript à la volée, et un compilateur pour produire la version finale.

Deux commandes, deux usages (`frontend/package.json`) :
- `vite` (le script `dev`) : démarre un serveur local avec rechargement instantané — tu modifies un composant, le navigateur se met à jour sans recharger toute la page (HMR).
- `vite build` (le script `build`) : produit le dossier `frontend/dist/` — des fichiers JS/CSS statiques optimisés, prêts à être déposés sur un serveur web, sans dépendre de Vite pour tourner.

Vite lit aussi des **variables d'environnement** exposées au code du navigateur — c'est `import.meta.env`, déclarées dans `frontend/.env.local` :

```
VITE_API_BASE_URL=http://localhost:8081
```

Règle de sécurité stricte : **seules les variables préfixées `VITE_` sont injectées dans le code envoyé au navigateur**. Toute variable sans ce préfixe reste invisible côté client — contrairement à Spring Boot où `@Value("${etab.admin.password}")` (mastered) lit une variable qui ne quitte jamais le serveur. Ici, tout ce qui commence par `VITE_` finit littéralement dans le JavaScript que n'importe qui peut lire dans l'onglet Network du navigateur — donc jamais de secret derrière ce préfixe.

Enfin, `vite.config.ts` déclare l'alias `@` → `./src` (`resolve.alias`), qui permet d'écrire `import { useAuth } from '@/context/AuthContext'` au lieu d'un chemin relatif `../../context/AuthContext`.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si dans `frontend/.env.local` tu renommes `VITE_API_BASE_URL` en `API_BASE_URL` (sans le préfixe), que va valoir `import.meta.env.VITE_API_BASE_URL` dans `axios.ts` une fois le serveur redémarré ?
- Prédiction 2 : est-ce que ça fait planter l'appli, ou est-ce que ça se rabat silencieusement sur autre chose ? Regarde la ligne `baseURL: ... || 'http://localhost:8080'`.

Fais le changement, redémarre `npm run dev` (Vite ne relit `.env.local` qu'au redémarrage), regarde vers quelle URL part la requête de login dans l'onglet Network, puis annule.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, explique ce que fait `vite` (dev) par rapport à `vite build`, et où finit le résultat de chacun.
2. **Discrimination** : Spring Boot lit `ETAB_ADMIN_PASSWORD` côté serveur via `@Value`, cette valeur ne quitte jamais le backend. Vite expose `VITE_API_BASE_URL` directement dans le bundle JS téléchargé par le navigateur. Pourquoi cette différence de traitement est-elle nécessaire — que se passerait-il si Vite exposait *toutes* les variables d'environnement sans préfixe requis ?
3. **Piège** : pourquoi ne pas simplement charger les fichiers `.tsx` directement dans une balise `<script src="...">`, comme du JavaScript classique, plutôt que passer par tout un outil de build ?
4. Un fichier `.env.local` avec `VITE_API_BASE_URL=http://localhost:8081` existe déjà — pourquoi le hardcoder directement dans `axios.ts` (`baseURL: 'http://localhost:8081'`) serait un mauvais réflexe une fois le projet déployé ailleurs qu'en local ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
