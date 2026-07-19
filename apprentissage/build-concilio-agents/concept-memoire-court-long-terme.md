# Mémoire des agents — RunResult (court terme) vs SQLite (long terme)

## Prérequis

> Pour chaque prérequis [non testé] : passe son épreuve-portier d'abord. Réussie → coche et continue. Ratée → lis la fiche, comble, repasse l'épreuve. Ne lis jamais avant d'avoir tenté.

- [sql-de-base](/learn/prerequis#sql-de-base) — statut: [non testé]
- [decorateurs-python](/learn/prerequis#decorateurs-python) — statut: [non testé]

## Avant de lire — Reconnaître (à froid)

1. En JPA/Hibernate (SGS), une entité `@Entity` mappée à PostgreSQL survit après la fin de la requête HTTP ; un objet Java simple non persisté disparaît à la fin de la méthode qui l'a créé. `RunResult` (`orchestrator.py`) survit-il à la fin de `orchestrator.run()` ?
2. `memory/store.py` définit deux tables : `runs` et `facts`. Grep `app.py` et `orchestrator.py` : `save_fact` et `search_facts` sont-elles appelées quelque part dans le projet ?
3. Si tu relances `streamlit run app.py` (nouveau process), l'onglet « Mémoire » affiche-t-il encore les runs précédents ? Et l'écran affiché avant le redémarrage (le dernier livrable visible) ?

## Explication ancrée

`memory/store.py` utilise du `sqlite3` brut (pas de JPA, pas d'ORM) mais joue exactement le rôle que tenait ton `Repository` + PostgreSQL dans SGS : du stockage qui survit à la fin du process. `init_db()` (`CREATE TABLE IF NOT EXISTS`) est l'équivalent d'une migration minimale ; `save_run()` est un `INSERT` ; `recent_runs()`/`get_run()` sont des `SELECT` — même logique relationnelle, moteur différent (fichier local `data/consilio.db`, pas de serveur à démarrer, contrairement à PostgreSQL).

Le **court terme**, lui, n'est jamais écrit sur disque : `RunResult` (une simple `@dataclass`, dans `orchestrator.py`) ne vit que le temps du process Python, le temps d'un appel `orchestrator.run()` — puis, dans l'UI, tant que `st.session_state["result"]` (`app.py`, ligne 83) garde une référence dessus. C'est l'équivalent d'un DTO construit à l'intérieur d'une méthode `@Service` de Spring et jeté après la réponse HTTP — sauf qu'ici rien ne force à le jeter, `session_state` le garde juste tant que la session du navigateur est ouverte.

Le **long terme** est `data/consilio.db`, écrit explicitement par `app.py` juste après un run réussi (`memory.save_run(result)`, ligne 81). Il survit au redémarrage du process, contrairement à `RunResult`.

Détail à connaître pour la défense : `save_fact`/`search_facts` existent (une table `facts`, pensée pour que les agents « retiennent » des faits réutilisables d'un run à l'autre — le genre de mémoire qui influence un futur run, plus proche de ce qu'on entend habituellement par « mémoire d'agent ») — mais un grep du dépôt montre qu'elles ne sont **jamais appelées**, ni par `orchestrator.py`, ni par `app.py`, ni par aucun agent. La « mémoire long terme » réellement active aujourd'hui n'est qu'un historique des runs, pas une mémoire qui influence le raisonnement futur.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si tu fais deux runs à la suite dans l'UI (sans relancer `streamlit run`), l'onglet « Mémoire » affichera-t-il 1 ou 2 lignes ?
- Prédiction 2 : si tu tues le process Streamlit puis le relances, l'onglet « Mémoire » affiche-t-il encore ces runs, alors que le livrable affiché à l'écran juste avant (tenu par `st.session_state["result"]`) est reparti à zéro ?

Vérifie avec `PYTHONPATH=src .venv/bin/python -c "from consilio.memory import store; print(store.recent_runs())"` avant et après un run fait dans l'UI, puis en relançant `streamlit run app.py`.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, écris le schéma minimal (colonnes) de la table `runs`, et le corps de `save_run` qui y insère un `RunResult`.
2. **Discrimination** : dans SGS, JPA t'imposait `@Entity`, un `Repository extends JpaRepository`, une configuration de datasource. `memory/store.py` fait tout ça « à la main » avec `sqlite3` brut. Qu'est-ce que ça coûte par rapport à JPA (que dois-tu écrire toi-même que JPA t'offrait) et qu'est-ce que ça évite (dépendances, configuration à faire tourner) ?
3. **Piège** : puisqu'un seul utilisateur lance l'appli en local pour la démo, pourquoi ne pas garder tous les runs en mémoire court terme (une simple liste Python globale), plutôt que d'écrire dans SQLite ? Qu'apporte concrètement SQLite ici que la liste Python n'apporte pas ?
4. `search_facts` fait une recherche `LIKE '%query%'` plutôt qu'une recherche par similarité d'embedding (comme le RAG). Pourquoi cette différence de mécanisme est-elle défendable — et est-ce grave que cette fonction ne soit aujourd'hui jamais appelée ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
