# Streamlit — tout le script re-tourne à chaque interaction

## Avant de lire — Reconnaître (à froid)

1. En React (SGS), un clic qui déclenche `setState(...)` re-rend seulement le sous-arbre de composants concerné ; le reste continue d'exister tel quel. Dans `app.py`, qu'est-ce qui se ré-exécute quand tu cliques sur « 🚀 Lancer l'analyse » — juste le bouton, ou autre chose ?
2. `st.session_state.setdefault("brief", EXAMPLES[0])` (ligne 58) — pourquoi `setdefault` plutôt qu'une simple affectation `st.session_state["brief"] = EXAMPLES[0]` ?
3. Ligne 83, le code fait `st.session_state["result"] = result` juste après avoir calculé `result`. Pourquoi stocker une variable qu'on vient tout juste de calculer, au lieu de continuer à utiliser directement la variable locale ?

## Explication ancrée

En React, un composant re-rend quand son état ou ses props changent ; l'état local d'un autre composant n'est pas touché — `useState` persiste sa valeur entre les rendus d'une **même instance montée**, parce que React associe cet état à sa position dans l'arbre (fiber).

Streamlit fonctionne à l'opposé : à **chaque** interaction (clic, saisie, toggle), Streamlit relance `app.py` en entier, du début à la fin, comme si tu redémarrais `python app.py`. Toute variable Python locale est recréée de zéro — rien ne survit d'une exécution à l'autre, sauf ce qui est explicitement rangé dans `st.session_state` (un dictionnaire que Streamlit, lui, conserve entre les reruns d'une même session navigateur). C'est pour ça que `result = orchestrator.run(...)` (ligne 80) doit être immédiatement sauvegardé dans `st.session_state["result"]` (ligne 83) : sans ça, le rerun suivant — déclenché par n'importe quelle autre interaction, ex. le toggle « recherche web » dans la sidebar — effacerait la variable locale `result` et le livrable affiché disparaîtrait de l'écran.

`st.session_state.setdefault("brief", EXAMPLES[0])` : `setdefault` n'affecte que si la clé n'existe pas encore — nécessaire parce que cette ligne s'exécute à **chaque** rerun ; une affectation directe réinitialiserait le texte tapé par l'utilisateur à `EXAMPLES[0]` à la moindre interaction ailleurs sur la page (ex. cliquer le toggle web), effaçant ce qu'il avait écrit.

`st.rerun()` (ligne 63, après un clic sur un bouton « Exemple ») force un rerun **immédiat** plutôt que d'attendre la prochaine interaction naturelle — nécessaire car un widget lié à une `key` (le `text_area`, `key="brief"`, ligne 65) lit sa valeur dans `session_state` **au début** du script ; modifier `session_state["brief"]` en cours de script ne met pas à jour rétroactivement un widget déjà affiché, il faut relancer le script pour que le changement apparaisse à l'écran.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si tu ajoutes un compteur (`st.session_state.setdefault("n", 0); st.session_state["n"] += 1; st.write(f"rerun #{st.session_state['n']}")`) tout en haut d'`app.py`, puis cliques sur le toggle « Outil recherche web » de la sidebar (sans toucher au bouton « Lancer l'analyse »), ce compteur s'incrémentera-t-il quand même ?
- Prédiction 2 : le dernier livrable affiché (si un run a déjà été fait) restera-t-il visible après ce clic sur le toggle ?

Ajoute le compteur, lance `streamlit run app.py`, fais un run, puis clique sur le toggle et observe le compteur ET la persistance du livrable ; retire le compteur ensuite.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, explique en 3-4 phrases ce qu'est un « rerun » Streamlit, et nomme le seul mécanisme qui survit à un rerun.
2. **Discrimination** : `useState` (React) persiste une valeur entre les **re-rendus** d'un même composant monté ; `st.session_state` persiste une valeur entre les **re-exécutions complètes** du script. Si tu voulais porter le pattern `LanguageProvider`/`useLanguage` ([Context, expliqué dans le sujet portfolio](/learn/build-this-portfolio#context-i18n)) tel quel en Streamlit, ce design (Context + hook) aurait-il encore un sens ici ? Pourquoi ?
3. **Piège** : pourquoi Streamlit ne re-rend-il pas seulement la portion de page affectée par le clic, comme React, plutôt que de tout ré-exécuter ? Regarde `app.py` : y trouve-t-on un seul `useEffect`/`addEventListener` explicite ? Que gagne-t-on en simplicité d'écriture à ce prix ?
4. Si tu retires `key="brief"` du `st.text_area(...)` et que tu utilises uniquement la variable locale `brief = st.text_area(...)` sans passer par `session_state`, le texte tapé par l'utilisateur survivra-t-il au clic sur « 🚀 Lancer l'analyse » (qui déclenche un rerun) ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
