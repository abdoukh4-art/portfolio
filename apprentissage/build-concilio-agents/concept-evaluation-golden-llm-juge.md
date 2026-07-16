# Évaluer un système LLM — golden set et LLM-as-judge

## Avant de lire — Reconnaître (à froid)

1. `golden.py` contient 4 questions, chacune associée à un `expected_source` (ex. `"2210.03629.pdf"` pour la question sur ReAct). Comment ce fichier permet-il de savoir, **automatiquement**, si le système a bien répondu — sans relire chaque réponse à la main ?
2. `_faithfulness()` (`eval/run_eval.py`) appelle un LLM pour juger la réponse produite par... un autre appel LLM. Si le juge peut lui-même se tromper, à quoi sert de mesurer avec un outil faillible ?
3. `_faithfulness` demande au juge de répondre « UNIQUEMENT par OUI ou NON », plutôt que « donne une note de fidélité entre 0 et 100 ». Pourquoi ce choix, à ton avis ?

## Explication ancrée

Aucune techno de ton profil ne colle directement ici — pense à un **corrigé d'examen** : une liste de questions avec la bonne réponse fixée à l'avance par un humain, indépendamment de ce que le système répondra réellement. Comparer les réponses du système à ce corrigé donne une mesure **objective et reproductible** — tu n'as plus à te fier à ton impression que « ça avait l'air bon ».

`eval/run_eval.py` combine deux types de vérifications très différentes :

**(a) Métriques par règles (déterministes)** — pas d'appel LLM, pur Python : `citation_present` (le motif `\[(\d+)\]` apparaît-il ?), `citation_valid` (les numéros cités existent-ils parmi les sources récupérées ?), `source_retrieved`/`source_cited` (le fichier attendu apparaît-il parmi les sources récupérées/citées ?). Toujours la même réponse pour la même entrée — mais superficiel : ça vérifie la **forme**, pas le fond.

**(b) LLM-as-judge** — `_faithfulness()` demande au **même genre** de modèle (juste un autre prompt système, `_JUDGE_SYSTEM`) de lire les extraits et la réponse, et de juger si chaque affirmation est étayée. Ça attrape ce que les règles ne peuvent pas voir (ex. « cite `[1]` correctement mais déforme ce que dit `[1]` ») — mais c'est un modèle qui juge un modèle, donc intrinsèquement moins fiable qu'une règle.

Pourquoi forcer un verdict binaire OUI/NON plutôt qu'une note chiffrée : un petit modèle local (`qwen2.5:3b`) interrogé pour une note 0-100 produit des chiffres peu stables et mal calibrés (72 est-il vraiment différent de 78 pour un modèle de cette taille ?). Un choix binaire est un jugement bien plus simple et stable pour un juge faible — et l'agrégat (`fidélité_moy_%` = % de « OUI » sur l'ensemble des cas) redonne un pourcentage exploitable au niveau du rapport, même si chaque verdict individuel est grossier. C'est littéralement le commentaire du code source : *« un verdict binaire OUI/NON est bien plus fiable qu'une note chiffrée avec un petit modèle local »*.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si tu modifies volontairement `expected_source` dans `golden.py` en `"2210.03629.PDF"` (majuscules) alors que le fichier réel s'appelle `2210.03629.pdf`, `source_retrieved`/`source_cited` resteront-ils corrects ?
- Prédiction 2 : le juge LLM (`_faithfulness`) reçoit-il, dans son prompt, la question d'origine posée par l'utilisateur — ou seulement la réponse et les extraits ?

Relis attentivement la construction du `user` dans `_faithfulness` (`f"EXTRAITS :\n{evidence}\n\nRÉPONSE :\n{answer}"`) pour vérifier la prédiction 2, puis lance `PYTHONPATH=src .venv/bin/python -m consilio.eval.run_eval` (Ollama démarré) et observe si un changement de casse dans `expected_source` fait bien basculer `source_retrieved` à `False`.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, écris de zéro le squelette de `_faithfulness` — prompt système, entrées passées au juge, transformation OUI/NON en score.
2. **Discrimination** : `expected_source in retrieved` est une comparaison de chaîne exacte, déterministe, comme une assertion classique. La fidélité, elle, est jugée par un LLM. Pourquoi ne pas avoir tout mesuré uniquement par des règles déterministes, sans juge LLM du tout ?
3. **Piège** : le juge LLM ne reçoit **pas** la question d'origine dans son prompt, seulement les extraits et la réponse. Oubli, ou voulu ? Justifie en fonction de ce que « fidélité » est censé mesurer précisément — fidèle à quoi ?
4. Le même modèle (`qwen2.5:3b`) sert à la fois pour l'Analyst (rédiger la réponse) et pour le juge (l'évaluer). Qu'est-ce que ça fragilise dans l'objectivité de la mesure, et comment le corrigerais-tu ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
