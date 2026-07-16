# Qu'est-ce qu'un « agent » ici — un rôle figé par un prompt, pas une classe

Ce concept affine, à l'intérieur du [pipeline orchestrateur](/learn/build-concilio-agents#orchestrateur-pipeline), un point précis : qu'est-ce qui fait qu'un appel LLM compte comme « un agent » et pas juste « un appel LLM de plus » ?

## Avant de lire — Reconnaître (à froid)

1. Ouvre côte à côte `planner.py`, `analyst.py`, `critic.py`, `writer.py` : quelle méthode exacte (nom, signature) chacun appelle-t-il pour parler au LLM ? Est-ce 4 méthodes différentes, ou la même ?
2. `researcher.py` ne contient aucun `provider.complete(...)` (voir [tool-use orchestré](/learn/build-concilio-agents#tool-use-orchestre)). Si « appeler le LLM » n'est pas le critère, qu'est-ce qui reste pour dire que Researcher est quand même « un agent », au même titre que Planner ?
3. `planner.py` finit son `_SYSTEM` par « Réponds UNIQUEMENT par la liste... » ; `critic.py` finit le sien par « Termine OBLIGATOIREMENT par... VERDICT: OK/REVISE ». Ces phrases sont-elles décoratives, ou le code qui suit l'appel LLM (dans `plan()` et `critique()`) casse-t-il si le texte ne respecte pas cette forme ?

## Explication ancrée

En JavaScript ou Python, une même fonction appelée depuis 4 endroits avec des arguments différents reste **une** fonction, pas 4. Structurellement, `provider.complete(system, user, max_tokens)` est exactement ça : la même méthode (`AnthropicProvider.complete` ou `OllamaProvider.complete`), appelée depuis 4 sites — `planner.plan()`, `analyst.analyze()`, `critic.critique()`, `writer.write()`. Si c'était tout, « 4 agents » ne serait qu'un même appel LLM répété avec un texte différent — exactement le soupçon derrière la question.

Ce qui fait réellement de chacun un agent distinct, ce sont trois choses, **jamais vérifiées par Python**, seulement par discipline de code :
- **(a) un `_SYSTEM` figé et distinct** — un rôle écrit en dur, jamais généré ni modifiable à l'exécution (Planner décompose ; Analyst synthétise en citant `[n]` ; Critic vérifie et rend un verdict ; Writer met en forme) ;
- **(b) un contrat d'entrée distinct** — quelle tranche de l'état partagé chacun a le droit de voir : Critic ne reçoit jamais le `brief` ni le `plan`, seulement `evidence_block(sources)` + l'analyse ; Writer ne reçoit jamais le `plan` ;
- **(c) un contrat de sortie distinct** — comment `resp.text` (texte brut) est reparsé en donnée exploitable : Planner découpe ligne à ligne en `list[str]` ; Critic réduit le texte à `"OK"` ou `"REVISE"` via `"REVISE" in resp.text.upper()` ; Analyst et Writer gardent le texte tel quel.

Researcher n'a ni (a) ni aucun appel `provider.complete` — c'est un agent par convention de pipeline (son propre module, son propre `Step` dans la trace), pas par prompt.

Rien de tout ça n'est appliqué par le langage : rien n'empêche, techniquement, d'appeler `provider.complete(critic._SYSTEM, ...)` depuis `analyst.py` — le code tournerait sans erreur, et produirait un « Analyst » qui se comporte comme un Critic.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si tu remplaces temporairement, dans `analyst.py`, `_SYSTEM` par `critic._SYSTEM` importé (Analyst reçoit alors « Tu es un relecteur... termine par VERDICT: OK/REVISE »), `orchestrator.run()` lève-t-il une exception à cause de cette incohérence, ou continue-t-il jusqu'au livrable final sans broncher ?
- Prédiction 2 : le livrable final produit par `writer.write()` sera-t-il une vraie note d'analyse, ou contiendra-t-il visiblement un texte du type « VERDICT: OK » à la place ?

Fais le remplacement, lance `PYTHONPATH=src .venv/bin/python -c "from consilio.orchestrator import run; r = run('Quels sont les risques d\'un agent LLM autonome en production ?', use_web=False); print(r.deliverable)"`, observe le livrable, puis annule le changement.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, énumère les 3 éléments (a)(b)(c) qui distinguent un agent Consilio d'un simple appel LLM générique, avec un exemple concret pour chacun, tiré de deux agents différents.
2. **Discrimination** : en Java/Spring, une classe qui `implements Repository` en oubliant une méthode ne compile pas. Ici, rien n'empêche `analyst.py` d'utiliser le `_SYSTEM` de `critic.py` par erreur de copier-coller. Qu'est-ce qui, dans Consilio, joue (mal) le rôle qu'un type/interface jouerait en Java pour éviter cette confusion, et à quel moment l'erreur serait-elle réellement détectée ?
3. **Piège** : pourquoi ne pas avoir écrit une seule fonction générique `call_agent(system, user, parser)` réutilisée 4 fois avec des arguments différents, plutôt que 4 fichiers séparés qui font tous, au fond, la même chose (construire un prompt, appeler `provider.complete`, parser le résultat) ?
4. Si demain le Planner et l'Analyst partageaient exactement le même `_SYSTEM`, mais recevaient des `user` différents, seraient-ils encore deux agents distincts selon (a)(b)(c) ? Justifie.

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
