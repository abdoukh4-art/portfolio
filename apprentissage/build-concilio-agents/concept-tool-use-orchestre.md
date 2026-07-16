# Tool-use dans Consilio — qui décide d'appeler l'outil ?

## Avant de lire — Reconnaître (à froid)

1. Le README classe « Tool-use » comme un des 5 piliers, illustré par `agents/researcher.py`. Ouvre ce fichier : y a-t-il un seul appel à `provider.complete(...)` (donc un appel LLM) dedans ?
2. Si `researcher.py` n'appelle jamais le LLM, qui décide, dans le code, d'aller chercher dans Chroma puis sur le web ?
3. Le « tool use » / « function calling » qu'on associe généralement aux API de LLM (Anthropic incluse) passe par un paramètre `tools=[...]` donné au modèle, qui répond alors par un bloc structuré que ton code doit exécuter. Cherche `tools=` ou `tool_use` dans tout `src/` de Consilio — en trouves-tu ?

## Explication ancrée

Tu maîtrises déjà l'architecture multi-agents de Consilio dans son ensemble — ce concept affine un point précis à l'intérieur : **qui**, concrètement, décide d'appeler un outil. En Spring Boot, un `Controller` appelle un `Service` qui appelle un `Repository` : la chaîne d'appel est écrite en dur dans le code, décidée à l'avance par toi, jamais par une décision prise à l'exécution par une IA. `researcher.research()` fonctionne exactement ainsi : pour chaque requête (le brief + chaque sous-question du plan), il appelle `store.query()` (l'outil RAG) et, si `config.USE_WEB` est vrai, `web_search()` (l'outil web) — **toujours**, de façon déterministe, sans qu'aucun LLM ne « choisisse » quand ou s'il faut chercher.

Ça diffère du function-calling « natif » de certaines API de LLM : on donne au modèle une liste d'outils avec leur schéma JSON, et **le modèle lui-même** décide, dans sa réponse, d'émettre un bloc `tool_use` que ton code exécute ensuite et lui renvoie. Un grep confirme que `anthropic_provider.py` n'envoie jamais de paramètre `tools=` à `messages.create()` — malgré le mot « tool-use » dans le README, **le LLM de Consilio ne décide jamais lui-même d'appeler un outil**. C'est toujours l'orchestrateur/l'agent (code Python) qui décide.

Pourquoi ce choix (voir aussi `docs/adr/0002-orchestrateur-maison.md`) : un pipeline entièrement décidé par le code est **prévisible et traçable** — pas de risque que le LLM invente un mauvais appel d'outil ou oublie d'en faire un. Le prix : moins de flexibilité — le système ne peut pas, par exemple, décider tout seul « cette question ne nécessite pas de recherche web », c'est `config.USE_WEB` qui tranche, en dur.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si `web_search()` échoue (réseau coupé, DNS injoignable), est-ce que ça fait planter tout le pipeline (`orchestrator.run()`), ou est-ce que ça dégrade silencieusement ?
- Prédiction 2 : le RAG (`store.query`) est-il, lui, affecté par une coupure réseau, sachant que Chroma est en local (`data/chroma/`) ?

Lis le `try/except Exception` de `tools/web_search.py` (il renvoie `[]` sur n'importe quelle erreur), puis vérifie en lançant `PYTHONPATH=src .venv/bin/python -c "from consilio.tools.web_search import web_search; print(web_search('test', max_results=1))"` une fois avec le réseau actif, une fois en coupant temporairement le Wi-Fi.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder le code, décris le chemin d'appel exact — brief → `researcher.research()` → quelles fonctions sont appelées, dans quel ordre, avec quels arguments ?
2. **Discrimination** : dans l'architecture multi-agents de Consilio, `researcher.py` (aucun appel LLM) et `analyst.py` (appel LLM systématique) sont tous deux des « agents ». Qu'est-ce qui les distingue structurellement, et pourquoi le Researcher a-t-il été conçu **sans** LLM alors que « choisir les bonnes sources » pourrait sembler demander du jugement ?
3. **Piège** : pourquoi Consilio n'utilise-t-il pas le vrai function-calling de l'API Anthropic (`tools=[...]`) pour laisser le modèle décider lui-même quand chercher sur le web ? Quel risque ça évite, quel confort ça sacrifie ?
4. Si tu voulais que le Planner décide dynamiquement « cette question ne nécessite pas de recherche web », à quel endroit précis du code faudrait-il introduire cette décision — et le système resterait-il du « tool-use orchestré » ou basculerait-il vers du vrai function-calling ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
