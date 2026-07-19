# Architecture hors-ligne : zéro backend, pas une PWA cachée

## Prérequis

> Pour chaque prérequis [non testé] : passe son épreuve-portier d'abord. Réussie → coche et continue. Ratée → lis la fiche, comble, repasse l'épreuve. Ne lis jamais avant d'avoir tenté.

- [http-requete-reponse](/learn/prerequis#http-requete-reponse) — statut: [non testé]
- [npm-node-modules](/learn/prerequis#npm-node-modules) — statut: [non testé]

## Avant de lire — Reconnaître (à froid)

1. Dans SGS, quand une page React affichait une liste (utilisateurs, réservations...), écris le chemin complet que suivaient les données, du composant jusqu'à PostgreSQL.
2. Rawiya doit fonctionner dans un village marocain sans internet, distribué via une "box Wi-Fi solaire". Avant de regarder le code : par quel mécanisme ferais-tu ça — un service worker qui met en cache une appli en ligne, ou autre chose ?
3. Le fichier `PROJECT_CONTEXT.md` du repo liste "PWA offline-first" dans la stack technique. Penses-tu que c'est vrai tel quel ? Qu'est-ce qui te ferait dire oui ou non avant de vérifier ?

## Explication ancrée

Dans SGS, ton React frontend appelait un backend Spring Boot en HTTP (JWT à l'appui), qui interrogeait PostgreSQL — trois étages, et chaque affichage dépend d'un aller-retour réseau vers ce backend. Dans Concilio, même schéma : Streamlit parle en réseau à une API LLM. Rawiya casse ce schéma délibérément : `package.json` ne liste aucune dépendance serveur, et aucun `fetch`/appel réseau ne va chercher le contenu des histoires.

D'où viennent les données, alors ? `src/data/stories.js` est un tableau JS codé en dur, empaqueté directement dans le bundle JS au moment du `build` — jamais récupéré à l'exécution. L'audio (`public/audio/*.mp3`), les PDF (`public/books/*.pdf`) et le modèle 3D (`public/models/jrada.glb`) sont des fichiers statiques embarqués dans le même build ; `vite.config.js` précise même explicitement `assetsInclude: ['**/*.mp3', '**/*.pdf', '**/*.glb']` pour que Vite les empaquette (Vite lui-même est expliqué dans [la leçon du sujet SGS](/learn/build-sgs-fullstack#vite)).

`deploy/captive-portal.example.conf` révèle le vrai mécanisme "hors ligne" : un nginx sur un hotspot Wi-Fi local (la fameuse box solaire) sert directement le dossier `dist/` du build aux téléphones connectés — pas de DNS, pas de passerelle internet, juste un réseau local fermé.

Une recherche dans tout `src/` ne trouve **aucun** `serviceWorker`, aucun `manifest.json`, aucun plugin PWA. "PWA offline-first" dans `PROJECT_CONTEXT.md` est donc du langage de vision, pas du code implémenté — même type d'écart que le "tool-use" de Concilio, plus simple que ce que le README annonçait.

Conclusion : ici, "hors ligne" ne veut pas dire "mis en cache pour survivre à une coupure" (ça, ce serait un service worker). Ça veut dire "il n'y a rien d'externe à joindre au départ" — une SPA statique servie depuis une boîte locale.

## À exécuter — Casser

Avant de lancer quoi que ce soit, écris deux prédictions :
1. Si tu fais `npm run build && npm run preview`, ouvres l'app, PUIS coupes complètement le réseau de ta machine et recharges (F5) — l'app va-t-elle s'afficher ?
2. Le texte (polices arabe/latine) va-t-il s'afficher exactement pareil qu'avec réseau ?

Fais-le réellement. Ouvre l'onglet Réseau/Console des devtools pendant le rechargement sans réseau. Indice : regarde `src/index.html` ligne 8 et `src/index.css` ligne 1.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder le code, dessine le schéma de flux de données de Rawiya, du clic utilisateur jusqu'à l'affichage d'une histoire — quels fichiers, quels appels réseau s'il y en a.
2. **Discrimination** : en quoi l'architecture de Rawiya (zéro backend) diffère-t-elle fondamentalement de celle de SGS (React + Spring Boot + PostgreSQL) et de Concilio (Streamlit + agents + API LLM) ? Donne un cas où "zéro backend" serait un mauvais choix pour SGS.
3. **Piège de justification** : pourquoi ne pas avoir quand même ajouté un vrai service worker pour mettre en cache les polices Google Fonts et être VRAIMENT 100% offline, puisque c'était faisable avec Vite ? Qu'est-ce que ça aurait coûté pendant un hackathon d'environ 48h ?
4. Cite le fichier exact qui prouve, par son absence, que le "hors ligne" ne passe pas par un service worker.

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
