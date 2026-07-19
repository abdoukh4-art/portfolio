# Build statique et déploiement

## Prérequis

> Pour chaque prérequis [non testé] : passe son épreuve-portier d'abord. Réussie → coche et continue. Ratée → lis la fiche, comble, repasse l'épreuve. Ne lis jamais avant d'avoir tenté.

- [npm-node-modules](/learn/prerequis#npm-node-modules) — statut: [non testé]

## Avant de lire — Reconnaître (à froid)

1. Dans SGS, que produit `mvn package` ? Ce fichier doit-il continuer à "tourner" quelque part pour que les utilisateurs accèdent à l'app ?
2. `package.json` liste les scripts `dev`, `build`, `start`. À ton avis, lequel utilises-tu pour développer, lequel pour préparer la mise en prod ?
3. Le README dit "the site is fully static". Ce portfolio lit-il une base de données ou un cookie à chaque visite, comme le ferait un contrôleur Spring Boot ?

## Explication ancrée

Dans SGS, `mvn package` produit un `.jar`. Ce `.jar` ne sert à rien tant qu'un processus Java ne le fait pas tourner en continu sur un serveur : chaque requête HTTP entrante déclenche à ce moment-là l'exécution du contrôleur, qui interroge PostgreSQL via JPA, construit une réponse, la renvoie. Le serveur doit rester vivant en permanence.

Ce portfolio n'a besoin de rien de tout ça, parce qu'il n'a **aucune donnée qui change selon qui regarde ou quand** : `lib/content.ts` contient tout le texte, en dur, connu à l'avance. Il n'y a ni base de données, ni cookie de session, ni requête réseau au moment où quelqu'un visite le site. Next.js peut donc générer le HTML final **une fois, au build**, plutôt qu'à chaque requête. C'est ce que `npm run build` (le script `build` de `package.json`) déclenche : il exécute chaque Server Component (voir le concept sur Server vs Client Components), produit du HTML statique, et l'écrit dans `.next/`. À la fin du build, Next.js affiche un tableau des routes avec un symbole `○ (Static)` — le signal que la route a été entièrement pré-générée.

La conséquence directe : une fois `npm run build` terminé, le résultat est un ensemble de fichiers HTML/CSS/JS **fixes**, servables par n'importe quel serveur web basique, sans processus Node qui tourne en continu, sans logique métier exécutée à la demande. C'est fondamentalement différent du `.jar` Spring Boot, qui doit rester un processus vivant.

C'est pourquoi le README recommande Vercel plutôt que `npm run start` sur un VPS : Vercel est fait pour héberger exactement ce type de sortie statique (upload des fichiers, CDN, zéro serveur à administrer), alors que `npm run start` relancerait un serveur Next.js complet — inutile ici puisqu'il n'y a rien de dynamique à calculer par requête.

`npm run dev` (utilisé pendant tout ce parcours d'apprentissage) est un troisième mode : un serveur de développement avec rechargement à chaud, jamais utilisé en production.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : `npm run build` va-t-il afficher la route `/` comme Static (`○`) ou Dynamic (`ƒ`) ?
- Prédiction 2 : le dossier `.next/` (déjà présent dans le projet) va-t-il grossir, être recréé à l'identique, ou rester inchangé après ce build ?

Lance `npm run build` dans le projet, lis le tableau de sortie dans le terminal, vérifie tes deux prédictions.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, explique en 3 phrases la différence entre "build-time" et "request-time" pour ce portfolio précis. Quand exactement le HTML de la page d'accueil est-il produit ?
2. **Discrimination** : un `.jar` Spring Boot doit tourner en continu pour répondre aux requêtes. Une fois que `npm run build` a produit les fichiers statiques de ce portfolio, a-t-on encore besoin d'un serveur Node qui tourne ? Pourquoi précisément ce portfolio s'y prête (pense à `lib/content.ts`) ?
3. **Piège** : pourquoi ne pas simplement utiliser `npm run start` sur un VPS que tu contrôles, plutôt que Vercel comme le suggère le README ? Quel est le compromis réel (coût, effort, ce que ça t'apprendrait) ?
4. Si demain tu ajoutais un formulaire de contact qui envoie un email via une API appelée au moment où l'utilisateur clique "envoyer", ce morceau resterait-il "Static" au sens du build, ou faudrait-il un comportement différent ? Justifie.

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
