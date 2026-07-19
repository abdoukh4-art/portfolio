# React les fondamentaux — composant, props, useState, useEffect

## Prérequis

> Pour chaque prérequis [non testé] : passe son épreuve-portier d'abord. Réussie → coche et continue. Ratée → lis la fiche, comble, repasse l'épreuve. Ne lis jamais avant d'avoir tenté.

- [jsx-syntaxe](/learn/prerequis#jsx-syntaxe) — statut: [non testé]

## Avant de lire — Reconnaître (à froid)

1. En JavaScript pur (maîtrisé), une fonction `formaterOffre(offer)` reçoit une donnée en paramètre et renvoie un résultat, sans jamais modifier `offer` de l'extérieur. `OfferCard({ offer, actions, onClick })` dans SGS reçoit ses données de la même façon — comment appelle-t-on ce mécanisme en React ?
2. Si tu écrivais `let ouvert = false;` en haut d'un composant React et que tu faisais `ouvert = true;` dans un `onClick`, l'écran se mettrait-il à jour visuellement ? Pourquoi `NotificationBell` utilise-t-il `useState(false)` plutôt que cette variable simple ?
3. `useEffect(() => { ... }, [])` avec un tableau vide, et `useEffect(() => { ... }, [ouvert])` avec une dépendance — s'exécutent-ils au même moment ?

## Explication ancrée

Un composant React est une fonction JavaScript (maîtrisé) qui reçoit des données et renvoie une description de ce qui doit s'afficher — sauf que React la rappelle automatiquement chaque fois que ses données changent, contrairement à une fonction JS classique qui ne s'exécute que quand tu l'appelles toi-même.

Les **props** sont l'équivalent des paramètres de fonction : de la donnée qui descend d'un parent vers un enfant, en lecture seule. `OfferCard` (`OfferCard.tsx`) ne fait que ça :

```tsx
export function OfferCard({ offer, actions, onClick }: OfferCardProps) {
  return <div onClick={onClick}>{offer.title}</div>;
}
```

Il ne détient aucune donnée à lui — tout vient d'en haut. `OfferCatalog` (le parent), lui, a besoin de retenir des choses qui changent *à cause d'une interaction de l'utilisateur* — le texte tapé dans la recherche, le domaine sélectionné. Une variable JS classique (`let searchTerm = ''`) ne suffit pas : la réassigner ne dit rien à React, l'écran ne bougerait jamais. **`useState`** résout ça :

```tsx
const [searchTerm, setSearchTerm] = useState('');
// ...
<input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
```

`setSearchTerm(...)` ne se contente pas de changer la valeur : il dit explicitement à React « rejoue cette fonction composant, l'affichage doit refléter la nouvelle valeur ». C'est ce déclenchement de nouveau rendu que `let` seul ne fait jamais.

**`useEffect`** sert à une chose différente : exécuter du code qui n'a pas sa place dans le rendu lui-même — un effet de bord. `NotificationBell.tsx` l'utilise pour fermer le panneau au clic extérieur :

```tsx
useEffect(() => {
  if (!ouvert) return;
  const surClic = (e: MouseEvent) => { /* ... */ setOuvert(false); };
  document.addEventListener('mousedown', surClic);
  return () => document.removeEventListener('mousedown', surClic);
}, [ouvert]);
```

Le tableau `[ouvert]` en second argument dit *quand* rejouer cet effet : uniquement si `ouvert` a changé depuis le rendu précédent — pas à chaque rendu. La fonction retournée (`return () => ...`) est le *nettoyage* : elle retire l'écouteur avant que l'effet ne se rejoue ou que le composant disparaisse, sinon les écouteurs s'empileraient à chaque ouverture du panneau. Un tableau vide `[]` (comme dans `AuthContext.tsx`, qui relit `localStorage` une fois) signifie « une seule fois, au montage » — pas de dépendance qui changerait pour le redéclencher.

*(L'état partagé entre plusieurs composants sans passer par les props, comme la langue du site ou l'utilisateur connecté, passe par le Context React — voir [Context, expliqué dans le sujet portfolio](/learn/build-this-portfolio#context-i18n) ; ici on reste volontairement à l'état local d'un seul composant.)*

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : dans `NotificationBell.tsx`, si tu remplaces `useEffect(() => {...}, [ouvert])` par `useEffect(() => {...}, [])` (tableau vide), et que tu ouvres puis fermes puis rouvres le panneau plusieurs fois, le clic extérieur fermera-t-il toujours le panneau correctement ?
- Prédiction 2 : le composant plantera-t-il visiblement, ou le bug sera-t-il silencieux (le panneau reste ouvert malgré le clic extérieur, ou pire) ?

Fais le changement, teste en ouvrant/fermant plusieurs fois le panneau de notifications dans le frontend, observe, puis annule.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, écris de zéro un composant `Compteur` avec un `useState<number>(0)`, un bouton qui incrémente, et un `useEffect` qui logue la valeur à chaque changement (avec le bon tableau de dépendances).
2. **Discrimination** : `OfferCard` ne reçoit que des **props** ; `OfferCatalog` a des **props** (aucune ici, en fait) *et* du **state** (`searchTerm`...). Qu'est-ce qui, structurellement, décide si une donnée doit être une prop ou un state dans un composant donné ?
3. **Piège** : pourquoi ne pas simplement garder `ouvert` comme une variable JavaScript classique (`let ouvert = false` en haut du fichier, hors du composant), plutôt que `useState` — qu'est-ce que ça casserait concrètement si deux `<NotificationBell />` existaient sur la même page ?
4. Un `useEffect` sans tableau de dépendances du tout (ni vide, ni rempli) se comporte différemment d'un `useEffect(() => {}, [])`. Lequel s'exécute à *chaque* rendu, et pourquoi c'est presque toujours une erreur pour un effet qui appelle une API ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
