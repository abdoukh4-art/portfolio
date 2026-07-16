# Reconnaissance vocale : l'API jumelle qui, elle, a besoin du réseau

## Avant de lire — Reconnaître (à froid)

1. Tu viens de voir (fichier précédent) que `speechSynthesis` (texte → voix) tourne à 100% en local sur l'appareil. À ton avis, `SpeechRecognition` (voix → texte, utilisée pour la recherche vocale dans Rawiya) fonctionne-t-elle exactement pareil, en local ? Justifie.
2. Le projet cible des zones rurales sans internet. Si la reconnaissance vocale nécessitait une connexion réseau, quel problème cela poserait-il pour le pitch "hors ligne" du hackathon ?
3. Le code tente d'abord de reconnaître la voix en `ar-MA` (arabe marocain). Que devrait-il faire si le moteur échoue sur cette langue précise ?

## Explication ancrée

On vient de voir que `speechSynthesis` (sortie voix) est purement local. `SpeechRecognition` / `webkitSpeechRecognition` (entrée voix, recherche vocale dans `CategoriesPage.jsx`) porte un nom presque jumeau et une API similaire (`new SpeechRecognitionAPI()`, `.start()`, callbacks `onresult`/`onerror`/`onend`) — mais dans Chrome, l'implémentation par défaut envoie l'audio enregistré vers les serveurs de reconnaissance vocale de Google pour être transcrit, puis renvoie le texte. Contrairement à la synthèse, ce n'est **pas** systématiquement un calcul local. C'est la faille silencieuse du pitch "100% hors ligne" : la recherche vocale, elle, a besoin du réseau pour fonctionner sur la plupart des Android/Chrome.

Le code gère un vrai problème linguistique concret. `startVoiceSearch()` lance d'abord une tentative en `ar-MA`. Si `onerror` se déclenche (langue non supportée par le moteur, ce qui arrive souvent pour l'arabe marocain), le code relance immédiatement une seconde tentative en `fr-FR` via un flag `voiceRetryPendingRef` — une cascade de secours en deux langues avant d'abandonner et d'afficher "لم أفهم، حاول مرة أخرى" (je n'ai pas compris).

Ce n'est pas une reconnaissance continue : `recognition.continuous = false` et `recognition.interimResults = false` — une seule phrase captée, un seul résultat final, pas de flux en temps réel affiché au fur et à mesure. Volontairement simple pour un hackathon.

## À exécuter — Casser

Prédis d'abord : si tu coupes le réseau de ton appareil et cliques sur le micro de recherche vocale dans `CategoriesPage.jsx`, que va-t-il se passer — ça plante, ça reste bloqué en "listening", ou `onerror` se déclenche proprement ?

Fais le test réel (Chrome desktop ou Android), réseau coupé, et observe quel callback se déclenche et ce que voit l'utilisateur à l'écran.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder le code, écris le squelette JS (`onresult`, `onerror`, `onend`) qui lance une reconnaissance vocale en `ar-MA`, puis retente en `fr-FR` si la première échoue.
2. **Discrimination** : `speechSynthesis` vs `SpeechRecognition` — laquelle des deux peut honnêtement être qualifiée de "hors ligne" dans Chrome, et laquelle ne le peut pas ? Qu'est-ce que dans le code (pas dans la doc) te permet de vérifier ça toi-même ?
3. **Piège de justification** : pourquoi le projet n'a-t-il pas remplacé cette reconnaissance vocale par un modèle de reconnaissance vocale local dans le navigateur, pour respecter vraiment la promesse "hors ligne" ? Qu'est-ce que ça aurait coûté en temps/complexité pendant un hackathon ?
4. `recognition.lang = "ar-MA"` échoue souvent en pratique. Pourquoi le code ne teste-t-il pas d'abord `"fr-FR"` (plus fiable) avant `"ar-MA"` ? Qu'est-ce que cet ordre dit des priorités de l'équipe ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
