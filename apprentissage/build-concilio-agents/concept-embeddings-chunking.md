# Vectoriser du texte — chunking et embeddings

## Avant de lire — Reconnaître (à froid)

1. Le PDF `2005.11401.pdf` (papier RAG) fait des dizaines de pages. Si Consilio donnait « tout le PDF » au LLM à chaque question posée, quelle limite technique concrète rencontrerait-il en premier ?
2. `_chunk()` (`rag/ingest.py`) découpe le texte en fenêtres de `CHUNK_SIZE=1100` caractères avec un `CHUNK_OVERLAP=150`. Pourquoi ne pas couper à chaque 1100 caractères pile, sans chevauchement ?
3. `embed_texts()` et `embed_query()` (`rag/embeddings.py`) appellent le même modèle mais sont deux fonctions distinctes (`.embed()` vs `.query_embed()`). Une question tapée par l'utilisateur et un paragraphe de PDF, est-ce le même genre de texte à transformer ?

## Explication ancrée

Aucune techno de ton profil (Spring, React, PostgreSQL) ne fait ça directement — l'analogie la plus proche est celle d'un plan avec des coordonnées : au lieu de chercher un texte par mot-clé exact, on le place à une **position** dans un espace où les textes de sens proche se retrouvent proches. Cette position, c'est un **embedding** : un vecteur (une liste fixe de nombres) produit par un petit modèle ML (`BAAI/bge-small-en-v1.5`, chargé via `fastembed`, en ONNX — sans `torch`, pour rester léger à installer, cf. `docs/adr/0003-rag-chroma-fastembed.md`).

Avant de vectoriser, il faut découper. Un LLM (et un modèle d'embedding) a une capacité limitée par appel, et pour **citer** une source il faut des unités assez petites pour être précises. `_chunk()` dans `ingest.py` :

```python
size, overlap = config.CHUNK_SIZE, config.CHUNK_OVERLAP
step = max(1, size - overlap)
return [text[i : i + size] for i in range(0, len(text), step) if text[i : i + size].strip()]
```

`step` (950 caractères, ici) est plus petit que `size` (1100) : chaque fenêtre **chevauche** la précédente de `overlap` (150) caractères. Sans ce chevauchement, une idée coupée pile à la frontière entre deux chunks (ex. une phrase tronquée) risquerait de n'être entièrement lisible dans **aucun** des deux morceaux — l'overlap garde une chance qu'elle apparaisse intacte dans l'un des deux.

`embed_texts()` (pluriel, pour les chunks du corpus à l'ingestion) et `embed_query()` (singulier, pour la question de l'utilisateur) appellent le même modèle chargé une seule fois (`@lru_cache(maxsize=1)` sur `_model()` — coûteux à charger, réutilisé ensuite) mais via deux méthodes différentes de `fastembed`. Ce n'est pas un détail : certains modèles d'embedding sont entraînés de façon **asymétrique** — un document long et une question courte ne sont pas vectorisés de façon strictement identique pour obtenir la meilleure précision de récupération.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : avec `CHUNK_SIZE=1100` et `CHUNK_OVERLAP=150`, combien de chunks `_chunk()` produit-il pour un texte de exactement 1100 caractères ? Et pour 2200 caractères ?
- Prédiction 2 : si tu mets `CHUNK_OVERLAP=1100` (égal à `CHUNK_SIZE`), que devient `step = max(1, size - overlap)`, et quel comportement ça cause côté nombre de chunks générés ?

Vérifie en lançant `PYTHONPATH=src .venv/bin/python -c "from consilio.rag.ingest import _chunk; print(len(_chunk('x'*1100))); print(len(_chunk('x'*2200)))"`, puis modifie temporairement l'appel avec `overlap` égal à `size` pour observer l'écart avec ta prédiction.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, écris de zéro une fonction `chunk(text, size, overlap)` qui produit des fenêtres chevauchantes.
2. **Discrimination** : une clé primaire auto-incrémentée en PostgreSQL identifie une ligne de façon **exacte et unique**. Un vecteur d'embedding ne fait pas ça — explique en une phrase précise ce qu'un embedding représente à la place, et pourquoi `WHERE embedding = X` n'aurait aucun sens.
3. **Piège** : pourquoi ne pas simplement demander au LLM (Claude/Ollama) « quel passage du PDF est pertinent pour cette question ? » à chaque fois, plutôt que précalculer des embeddings à l'ingestion ? Qu'est-ce que ça coûterait en latence et en tokens à chaque question posée ?
4. Pourquoi `embed_texts` et `embed_query` sont-elles deux fonctions séparées plutôt qu'une seule fonction générique `embed(texts)` appelée aussi bien pour les chunks que pour la question ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
