# Server Components vs "use client"

## Prérequis

> Pour chaque prérequis [non testé] : passe son épreuve-portier d'abord. Réussie → coche et continue. Ratée → lis la fiche, comble, repasse l'épreuve. Ne lis jamais avant d'avoir tenté.

- [jsx-syntaxe](/learn/prerequis#jsx-syntaxe) — statut: [non testé]

## Avant de lire — Reconnaître (à froid)

1. En React classique (comme dans SGS), où s'exécute le code d'un composant : dans le navigateur de l'utilisateur, ou sur le serveur ?
2. Regarde `app/page.tsx` : il n'y a pas de `"use client"` en haut. Regarde `components/site.tsx` et `components/language.tsx` : il y en a un. À ton avis, pourquoi cette différence ?
3. `language.tsx` utilise `useState` et `useEffect`. Penses-tu que ces hooks pourraient fonctionner sans `"use client"` ?

## Explication ancrée

Dans React tel que tu l'as pratiqué dans SGS (avec [Vite — expliqué dans le sujet SGS](/learn/build-sgs-fullstack#vite)), **tout** ton code de composants s'exécute dans le navigateur : `useState`, `useEffect`, `onClick` — tout ça vit côté client, dans le JS qui tourne sur la machine de l'utilisateur. C'est le seul mode que React "classique" connaît.

Next.js App Router ajoute un deuxième mode, actif **par défaut** : le **Server Component**. Un composant sans directive spéciale (comme `app/page.tsx`) s'exécute sur le serveur (ou au build, comme tu le verras dans le concept sur le build statique) pour produire du HTML, puis n'envoie **aucun JavaScript** au navigateur pour ce composant. Pas de `useState` possible, pas de `onClick` possible : il n'y a tout simplement pas de runtime JS client pour ce code-là.

La directive `"use client"` en première ligne d'un fichier bascule ce fichier (et tout ce qu'il importe en cascade) dans l'ancien mode que tu connais : exécution dans le navigateur, hooks et événements disponibles. C'est pour ça que `components/language.tsx` (qui utilise `useState`, `useEffect`, `window.localStorage`) et `components/reveal.tsx` (qui utilise `useRef`, `useEffect`) portent `"use client"` — ce sont des besoins impossibles à satisfaire côté serveur.

`components/site.tsx` porte aussi `"use client"`, alors que tous ses sous-composants (`Nav`, `Hero`, `Footer`...) n'ont pas chacun besoin d'un hook. Mais la directive s'applique **au fichier entier**, pas ligne par ligne : dès qu'un fichier appelle `useLanguage()` (qui vient de `language.tsx`, un hook client), tout le fichier doit être marqué client. `app/page.tsx`, lui, reste un Server Component pur : il ne fait que rendre `<Site/>`, sans hook, donc il n'a besoin de rien côté client.

## À exécuter — Casser

Avant de lancer, écris deux prédictions :
- Prédiction 1 : si tu retires la ligne `"use client"` en haut de `components/language.tsx`, que va afficher `npm run dev` — une erreur au build, une page blanche, ou rien de visible ?
- Prédiction 2 : le message d'erreur (s'il y en a un) va-t-il mentionner `useState`, `"use client"`, ou autre chose ?

Retire temporairement la ligne, relance `npm run dev`, lis l'erreur exacte dans le terminal. Remets la ligne ensuite.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder le code, écris la règle complète — qu'est-ce qui est exécuté par défaut côté serveur, quel mot-clé bascule côté client, où doit-il être placé, et jusqu'où se propage-t-il (à un composant seul ou à ses imports) ?
2. **Discrimination** : en React "classique" (SGS), un composant est toujours capable d'utiliser `useState`. Ici, `app/page.tsx` ne le pourrait pas tel quel. Qu'est-ce qui, structurellement, rend `app/page.tsx` incapable d'avoir un état local sans passer par un enfant `"use client"` ?
3. **Piège** : pourquoi ne pas simplement mettre `"use client"` en haut de tous les fichiers, par sécurité, comme tu le ferais par réflexe en React classique ? Quel est le coût concret si tu fais ça sur tout le site ?
4. Le fichier `components/reveal.tsx` a-t-il vraiment besoin d'être un Server Component un jour, ou est-il condamné à rester client pour toujours ? Justifie avec ce qu'il fait concrètement.

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
