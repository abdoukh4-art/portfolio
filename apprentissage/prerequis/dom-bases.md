# Le DOM — l'arbre d'éléments que JS manipule

statut: [non testé]

## Épreuve-portier

1. `document.querySelector('.card')` renvoie quoi : du HTML texte, ou un objet JS représentant un élément réel de la page ?
2. `ref.current` (React, `useRef`) pointe vers quoi, une fois le composant monté à l'écran ?

*Réussi les deux → coche et continue. Raté → lis ci-dessous.*

## Explication (si ratée)

Le DOM (*Document Object Model*) est la représentation en mémoire, en arbre d'objets JS, de la page HTML affichée — chaque balise est un nœud manipulable (`element.classList.add(...)`). React construit normalement cet arbre depuis le JSX, mais certaines API du navigateur (canvas, `IntersectionObserver`, Web Audio) ont besoin d'un accès **direct** à un vrai nœud, pas au JSX abstrait — rôle de `useRef` : `ref.current` devient, après montage, le nœud DOM réel. `el.classList.add('is-visible')` (portfolio, `reveal.tsx`) modifie ce nœud directement, hors du cycle de rendu React.
