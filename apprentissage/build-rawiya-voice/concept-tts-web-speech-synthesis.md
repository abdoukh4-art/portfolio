# Le "pipeline TTS" : en réalité l'API vocale native du navigateur

## Prérequis

> Pour chaque prérequis [non testé] : passe son épreuve-portier d'abord. Réussie → coche et continue. Ratée → lis la fiche, comble, repasse l'épreuve. Ne lis jamais avant d'avoir tenté.

- [dom-bases](/learn/prerequis#dom-bases) — statut: [non testé]
- [promesses-async-js](/learn/prerequis#promesses-async-js) — statut: [non testé]

## Avant de lire — Reconnaître (à froid)

1. En JS, une Promise résolue par `fetch()` se résout de façon asynchrone. La voix qui raconte les histoires dans Rawiya — d'après toi, appelle-t-elle une API externe de synthèse vocale (type modèle IA hébergé), ou fait-elle autre chose ? Justifie avant de lire la suite.
2. Que se passe-t-il, selon toi, si tu appelles `speechSynthesis.getVoices()` juste au chargement de la page, avant que le navigateur ait fini de charger la liste des voix installées ?
3. Le projet doit lire du texte en arabe (Darija) ET en français. Comment choisirais-tu, en JS, quelle voix utiliser pour quelle langue, sachant que les voix disponibles changent selon l'appareil (Android bas de gamme vs PC) ?

## Explication ancrée

Contrairement à Concilio, où "parler à l'IA" veut dire faire un vrai appel réseau à un modèle de langage, la voix de Yemma qui raconte dans Rawiya n'appelle **aucune** API et **aucun** modèle IA de synthèse vocale. Elle utilise `window.speechSynthesis`, une API native du navigateur (Web Speech API) qui délègue le calcul au moteur vocal déjà installé sur l'appareil (TTS Android, moteur système...). Texte vers audio, entièrement local, zéro réseau. Le "pipeline TTS" du hackathon, dans le code, c'est : texte → `new SpeechSynthesisUtterance(texte)` → `synth.speak(utterance)`.

Premier piège découvert dans `waitForSpeechVoices.js` : `getVoices()` renvoie souvent un tableau **vide** au premier appel, car le chargement de la liste des voix est asynchrone (surtout sous Chrome). Le code empile trois filets de sécurité parce qu'aucun n'est fiable seul sur tous les navigateurs : l'événement `voiceschanged`, un polling de secours toutes les 80ms, et un timeout de 2,5s qui force la résolution.

Une fois les voix chargées, `pickFrenchVoice.js` et `pickArabicVoice.js` font une sélection **heuristique par score** : préférence stricte `ar-MA` (arabe marocain) > dialectes maghrébins > arabe standard des autres pays > `ar` générique, avec un bonus si le nom du moteur contient "neural/premium/enhanced". Nécessaire car le téléphone du jury n'a peut-être aucune voix marocaine installée — il faut un plan B qui dégrade proprement plutôt que de planter.

Chaque lecture crée un `SpeechSynthesisUtterance` jetable, accompagné d'un numéro de séquence (`utterSeqRef`) qui sert à ignorer les callbacks `onstart`/`onend` d'une lecture déjà annulée entre-temps — la race condition classique quand l'utilisateur clique "stop" puis relance vite.

## À exécuter — Casser

Prédis d'abord : dans la console du navigateur, si tu tapes `speechSynthesis.getVoices()` juste après le chargement de la page (avant toute interaction), obtiens-tu une liste vide ou remplie ? Et si tu cliques d'abord n'importe où sur la page, puis retapes la commande ?

Fais-le réellement, dans Chrome puis si possible dans Firefox — compare. Ensuite, dans `src/utils/pickArabicVoice.js`, commente temporairement la ligne du bonus `neural|premium...` et observe (via un `console.log(arabic[0].voice.name)` ajouté) si la voix choisie sur ta machine change.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder le fichier, écris le code minimal (10-15 lignes) qui fait parler le navigateur en français avec la meilleure voix disponible, en gérant le cas où `getVoices()` est vide au démarrage.
2. **Discrimination** : quelle est la différence fondamentale entre "appeler un modèle IA de synthèse vocale via une API HTTP" (ce que ferait Concilio pour un LLM) et "appeler `speechSynthesis.speak()`" ? Qui fait le calcul lourd, et où s'exécute-t-il ?
3. **Piège de justification** : pourquoi le code ne fixe-t-il jamais `utter.voice` sur une voix codée en dur (ex. "Microsoft Hortense") au lieu de refaire cette heuristique de score à chaque lecture ?
4. Si `pickArabicVoice` ne trouve strictement aucune voix `ar-*` sur l'appareil, que renvoie la fonction, et que se passe-t-il ensuite dans `VoiceGuideContext.speak()` ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
