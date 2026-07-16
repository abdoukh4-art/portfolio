# Web Audio API : lire l'intensité du son, pas juste le jouer

## Avant de lire — Reconnaître (à froid)

1. Dans `AudioPlayer.jsx`, la balise `<audio>` lit déjà le mp3 (play/pause/volume/currentTime) — une API que tu connais. Le fond d'écran de Rawiya "pulse" au rythme de la voix pendant la narration. Comment ferais-tu, en JS, pour savoir à chaque instant si le son est fort ou faible, à partir de cette balise ?
2. `currentTime`, `duration`, `volume` sont des propriétés simples de l'élément `<audio>`. Te donnent-elles l'intensité/fréquence réelle du son en train de jouer ? Pourquoi ou pourquoi pas ?
3. Un `<canvas>` doit se redessiner en boucle pour animer un halo qui grossit avec le son. Quelle fonction JS utiliserais-tu pour boucler à ~60 images/seconde sans bloquer la page ?

## Explication ancrée

La balise `<audio>` de `AudioPlayer.jsx` te donne le contrôle de **lecture** (play/pause/seek) — l'API HTMLMediaElement classique. Mais elle ne dit jamais "à quelle intensité le son sonne maintenant". Pour ça, `AudioReactiveBg.jsx` branche une pièce séparée : le **Web Audio API**, un graphe de traitement de signal.

Le montage, dans l'ordre : `new AudioContext()` crée le graphe ; `audioCtx.createMediaElementSource(audioEl)` capture le flux de la balise `<audio>` existante et l'injecte dans ce graphe (analogie du quotidien : une table de mixage — tu branches la même source son sur un ampli ET sur un vumètre, en parallèle) ; `audioCtx.createAnalyser()` est ce vumètre, il ne modifie pas le son, il expose juste ses données de fréquence via `getByteFrequencyData()`. Piège de câblage : `source.connect(analyser)` PUIS `analyser.connect(audioCtx.destination)` — sans cette deuxième connexion jusqu'à `destination`, plus aucun son ne sort des haut-parleurs.

Boucle : `requestAnimationFrame(draw)` — la même primitive que pour toute animation fluide — relit `analyser.getByteFrequencyData(dataRef.current)` à chaque frame, calcule une moyenne (`avg`), et l'utilise pour faire grossir un dégradé radial dessiné sur un `<canvas>` 2D. Plus la voix est forte, plus le halo doré s'étend.

Piège technique réel présent dans le code : `createMediaElementSource(audioEl)` ne peut être appelé qu'**une seule fois** par élément `<audio>` — un second appel sur le même élément lève une exception. Le code s'en protège avec `trySetup()` retenté via `requestAnimationFrame` (jusqu'à 120 tentatives), qui attend que la référence `audioPlayerRef.current` existe — pas un mécanisme qui retenterait le branchement plusieurs fois sur le même élément déjà connecté.

## À exécuter — Casser

Prédis d'abord :
1. Si tu commentes la ligne `analyser.connect(audioCtx.destination)` dans `AudioReactiveBg.jsx`, le son de l'histoire sort-il encore des haut-parleurs ? Le halo réagit-il encore ?
2. Si tu ouvres la page et cliques play sans jamais avoir interagi avec la page avant (aucun clic préalable), le halo réagit-il dès la première frame, ou y a-t-il un délai/silence ?

Teste les deux réellement. Pour (2), regarde le `console.warn` du composant et cherche ce que dit la politique d'autoplay des navigateurs sur `AudioContext`.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder le code, dessine le graphe de connexions Web Audio (quels nœuds, dans quel ordre, quels appels `.connect()`) nécessaire pour visualiser le son d'un `<audio>` sans le rendre muet.
2. **Discrimination** : `el.volume` (propriété HTMLMediaElement, dans `AudioPlayer.jsx`) vs `analyser.getByteFrequencyData()` (Web Audio API, dans `AudioReactiveBg.jsx`) — laquelle te donne un nombre que TOI tu as réglé, laquelle te donne une mesure du signal réel en train de jouer ?
3. **Piège de justification** : pourquoi ne pas avoir simplement fait grossir le halo en fonction de `el.volume` (bien plus simple, pas besoin d'`AudioContext`) plutôt que de brancher tout un graphe Web Audio ?
4. Que se passe-t-il si `trySetup()` est appelé une seconde fois sur le même `audioEl` alors qu'un `AudioContext` y est déjà branché (ex. si le composant se démonte puis remonte) ? Le `cleanup` du `useEffect` s'en protège-t-il, et comment ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
