# npm, package.json, node_modules

statut: [non testé]

## Épreuve-portier

1. `package.json` déclare `"build": "vite build"`. Comment lances-tu ce script depuis un terminal, exactement ?
2. `node_modules/` fait des centaines de Mo et n'est jamais commité sur Git. Pourquoi peut-on le recréer sans rien perdre ?

*Réussi les deux → coche et continue. Raté → lis ci-dessous.*

## Explication (si ratée)

`package.json` liste les dépendances d'un projet JS (React, Vite, axios...) et des **scripts** nommés (`dev`, `build`, `start`), lancés avec `npm run <nom>`. `npm install` lit ce fichier et télécharge chaque dépendance dans `node_modules/` — un dossier entièrement reconstructible à partir de `package.json`/`package-lock.json`, jamais versionné. Équivalent JS du `pom.xml` + dossier `.m2` que Maven gère pour Spring Boot (SGS) — même rôle, écosystème différent.
