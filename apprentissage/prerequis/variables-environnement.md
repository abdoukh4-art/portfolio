# Variables d'environnement

statut: [non testé]

## Épreuve-portier

1. `CONSILIO_PROVIDER=ollama python app.py` — cette variable est-elle lue depuis un fichier du projet, ou depuis autre chose ?
2. `VITE_API_BASE_URL` (frontend) et `jwt.secret` (backend, `application.properties`) sont-elles toutes deux visibles dans les DevTools du navigateur ?

*Réussi les deux → coche et continue. Raté → lis ci-dessous.*

## Explication (si ratée)

Une variable d'environnement est une paire clé-valeur définie **hors** du code source — shell (`export X=y`), fichier `.env`, ou `docker-compose.yml` (section `environment:`) — lue au runtime (`os.environ`, `System.getenv`, `import.meta.env`). Elle fait varier un comportement (quel provider LLM, quelle URL) sans modifier ni recompiler le code entre environnements (local, Docker, prod). Piège : une variable injectée dans un bundle **frontend** (`VITE_*`) finit dans le JS téléchargé par le navigateur — jamais un secret là-dedans, contrairement à une variable lue seulement côté serveur.
