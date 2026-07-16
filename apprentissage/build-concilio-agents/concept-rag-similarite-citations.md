# Chroma, similarité cosinus et la citation [n] traçable

## Avant de lire — Reconnaître (à froid)

1. En PostgreSQL (SGS), `SELECT * FROM table WHERE id = 42` renvoie une ligne exacte ou rien du tout. `store.query(question, k=5)` (`rag/store.py`) renvoie presque toujours 5 résultats, même hors sujet. Pourquoi ce comportement différent ?
2. Dans `store.py` : `score = round(1.0 - float(dist), 3)`. Chroma renvoie une **distance**, Consilio calcule un **score**. Que devient ce score si `dist=0` ? Et si `dist=1` ?
3. Le prompt système de `qa.py` exige : « chaque phrase doit se terminer par [n] ». Aucun code Python ne vérifie que le LLM respecte vraiment cette règle avant de renvoyer sa réponse. Qui, alors, garantit que `[n]` pointe vers une vraie source ?

## Explication ancrée

PostgreSQL retrouve une ligne par **égalité exacte** sur un index (B-tree). Chroma (`rag/store.py`, `get_collection(...)` avec `metadata={"hnsw:space": "cosine"}`) retrouve les vecteurs **les plus proches** d'une requête, par similarité — jamais d'égalité stricte, toujours une notion de proximité. C'est pourquoi `query()` renvoie systématiquement les `k` plus proches, pertinents ou non : rien dans Chroma ne dit « aucun résultat n'est bon ». `researcher.py` doit donc filtrer après coup (dédoublonnage par texte, tri par score, coupe à `MAX_SOURCES`).

La distance cosinus mesure un angle entre deux vecteurs : 0 = vecteurs identiques en direction (très similaires), 2 = direction opposée. `1.0 - dist` transforme ça en score où proche de 1 = très pertinent, proche de 0 (ou négatif) = peu pertinent — plus intuitif à lire dans l'UI.

Ce que l'embedding ne fait **pas**, c'est permettre de citer : il sert seulement à **trouver**. C'est la métadonnée stockée à côté de chaque vecteur, à l'ingestion (`ingest.py` : `metas.append({"source": path.name, "page": page_num})`), qui permet ensuite de dire « ce passage vient de tel fichier, telle page ». Deux jobs séparés : le vecteur trouve, la métadonnée cite.

Le mécanisme `[n]` relie les deux : `build_sources()` (`agents/base.py`) numérote les passages récupérés de 1 à n selon leur score ; ce même bloc numéroté est injecté dans le prompt (`evidence_block`) avec la consigne de réutiliser ces numéros. La section finale « Sources » (`sources_section`) est générée **par du code déterministe**, jamais par le LLM (`writer.py` : « N'écris PAS la liste des sources »). Mais rien, à ce stade, ne vérifie que le LLM a cité `[2]` en pensant vraiment au passage 2 — cette vérification est le travail du Critic et du harnais d'évaluation (concepts suivants).

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : pour une question totalement hors sujet par rapport au corpus (ex. « quelle est la recette de la tajine ? »), `store.query()` renverra-t-il une liste vide, ou 5 passages quand même ?
- Prédiction 2 : le score de ces passages hors sujet sera-t-il proche de 0, négatif, ou pourrait-il rester « élevé » malgré la non-pertinence ?

Lance `PYTHONPATH=src .venv/bin/python -c "from consilio.rag import store; [print(p.source, p.page, p.score) for p in store.query('recette de la tajine marocaine', k=5)]"` (corpus déjà ingéré) et compare aux scores obtenus pour une vraie question du domaine (ex. « qu'est-ce que ReAct ? »).

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, écris la formule reliant distance cosinus et score de similarité utilisée dans `store.py`, et donne le score pour `dist=0`, `dist=1`, `dist=2`.
2. **Discrimination** : `WHERE source = '2005.11401.pdf'` (PostgreSQL) et `store.query(text, k=5)` (Chroma) trient-ils sur le même type de critère ? Pourquoi Chroma ne pourrait-il pas remplacer PostgreSQL pour gérer, par exemple, les comptes utilisateurs d'une appli ?
3. **Piège** : pourquoi fixer `k=5` (top-k constant) plutôt que renvoyer tous les passages au-dessus d'un seuil de score fixe ? Quel problème un seuil fixe créerait-il sur un corpus hétérogène (certains PDF très proches du sujet, d'autres à peine liés) ?
4. Pourquoi la liste des sources en bas du livrable est-elle assemblée par du code Python déterministe (`sources_section`) plutôt que rédigée par le LLM lui-même ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
