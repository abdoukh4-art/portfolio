# L'orchestrateur — qui décide quoi, et comment le contexte circule

## Avant de lire — Reconnaître (à froid)

1. Ouvre `orchestrator.py` sans lire les commentaires : dans `run()`, repère les appels à `planner.plan`, `researcher.research`, `analyst.analyze`, `critic.critique`, `writer.write`. Sont-ils dans un ordre fixe écrit par toi, ou choisis dynamiquement selon le contenu du brief ?
2. `sources` (une `list[Source]`) est produite une seule fois, par `researcher.research()`. Repère combien de fonctions différentes la reçoivent ensuite en paramètre, plus loin dans le fichier.
3. Si `critic.critique()` renvoie `"REVISE"`, quel bout de code décide de rappeler `analyst.analyze()` — un choix pris par le LLM du Critic lui-même dans sa réponse, ou une instruction Python lue après coup ?

## Explication ancrée

Dans SGS, une méthode `@Service` qui enchaîne `repository.findX()` → `calculeY()` → `repository.save(Z)` exécute cette séquence dans l'ordre exact où tu l'as écrite : aucun framework ne « décide » à l'exécution d'appeler `calculeY` avant ou après `findX`, c'est le code source qui fixe l'ordre, une fois pour toutes.

`orchestrator.run()` fait exactement ça : cinq appels — `planner.plan(...)`, `researcher.research(...)`, `analyst.analyze(...)`, `critic.critique(...)`, `writer.write(...)` — dans un ordre écrit en dur (ADR 0002 : « pipeline explicite »). Aucun « agent superviseur » ne choisit dynamiquement la suite ; ce n'est jamais un LLM qui pilote l'enchaînement, seulement le corps de `def run(...)`.

Le contexte circule comme un DTO entre méthodes `@Service` : par argument et valeur de retour, explicitement. `plan` (rendu par le Planner) est passé à `researcher.research(brief, plan)` puis à `analyst.analyze(brief, plan, sources)` ; `sources` (rendu par le Researcher) est passé à Analyst, Critic **et** Writer. Rien d'implicite — pas de contexte partagé automatiquement en arrière-plan. Si un agent a besoin d'une donnée, elle doit apparaître dans sa signature.

La seule branche non linéaire du fichier est `while verdict == "REVISE" and retries < config.MAX_RETRIES:` — une boucle Python ordinaire, déclenchée après coup par du code qui lit le texte renvoyé par le Critic (`"REVISE" in resp.text.upper()`, dans `critic.py`). Le LLM du Critic ne rappelle jamais lui-même l'Analyst ; il écrit du texte, et c'est l'orchestrateur qui, en le lisant, décide de boucler. `MAX_STEPS` (via `record()`) est le garde-fou anti-boucle si jamais ça s'emballait.

Chaque appel est aussi accumulé dans `trace: list[Step]` au fil du pipeline — son cycle de vie (court terme vs sauvegarde) est détaillé dans [mémoire court/long terme](/learn/build-concilio-agents#memoire-court-long-terme).

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si tu forces `verdict = "REVISE"` en dur juste avant le `return` de `critique()` (peu importe ce que dit vraiment le LLM), combien de fois le nom `"Analyst"` (reprises comprises) apparaîtra dans `[s.agent for s in r.trace]` d'un run complet, sachant `config.MAX_RETRIES = 1` ?
- Prédiction 2 : le step de la reprise portera-t-il exactement le nom `"Analyst"` (identique au premier passage) ou un nom différent ?

Force `verdict = "REVISE"` dans `critique()`, lance `PYTHONPATH=src .venv/bin/python -c "from consilio.orchestrator import run; r = run('Quels sont les risques d\'un agent LLM autonome en production ?', use_web=False); print([s.agent for s in r.trace]); print('retries =', r.retries)"`, observe, puis annule le changement.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, dessine (texte suffit) le pipeline de `orchestrator.run()` — les 5 appels dans l'ordre, la boucle, le garde-fou, et ce que chaque fonction reçoit en argument.
2. **Discrimination** : en Spring Security, un `SecurityContextHolder` (thread-local) rend le user JWT-authentifié disponible implicitement à tout controller, sans le passer en paramètre. `sources` est-elle rendue disponible de la même façon implicite à Analyst/Critic/Writer dans `orchestrator.run()` ? Pourquoi ce choix explicite ici, alors qu'un mécanisme implicite existe ailleurs dans ton propre profil et aurait été plus court à écrire ?
3. **Piège** : l'ADR 0002 cite LangGraph comme « comparaison ultérieure, Phase 5 ». Pourquoi ne pas l'avoir utilisé dès le départ plutôt qu'un orchestrateur maison de ~150 lignes ? Quel risque ça évite, quel confort ça sacrifie ?
4. Si tu supprimais entièrement le Critic et sa boucle de reprise, `orchestrator.run()` resterait-il un pipeline « multi-agents », ou deviendrait-il autre chose ? Justifie avec un critère précis, pas juste « il y aurait moins d'agents ».

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
