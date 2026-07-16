# IntersectionObserver et prefers-reduced-motion

## Avant de lire — Reconnaître (à froid)

1. En React, comment déclares-tu d'habitude qu'une fonction doit réagir à un événement (clic, changement d'input) ?
2. Regarde `components/reveal.tsx` : il n'y a aucun `onScroll` ni `onVisible` dans le JSX, pourtant l'élément "apparaît" au scroll. Comment, à ton avis ?
3. `app/globals.css` contient un bloc `@media (prefers-reduced-motion: reduce)`. À qui s'adresse cette règle, et pourquoi existe-t-elle ?

## Explication ancrée

En React, tu déclares les réactions aux événements directement en JSX : `onClick={...}`, `onChange={...}`. C'est le composant qui écoute, de façon déclarative. Mais "un élément est entré dans la zone visible de l'écran" n'est pas un événement React — c'est une info que seul le navigateur peut calculer, via une API native du DOM : `IntersectionObserver`.

Regarde `components/reveal.tsx` :

```tsx
useEffect(() => {
  const el = ref.current;
  if (!el) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("is-visible");
        observer.disconnect();
      }
    },
    { threshold: 0.1 },
  );
  observer.observe(el);
  return () => observer.disconnect();
}, []);
```

`useRef` (que tu connais) pointe vers le vrai nœud DOM. `useEffect` (que tu connais aussi) sert ici à faire le pont entre React et une API du navigateur qui n'a rien de "React" : on crée un `IntersectionObserver`, on lui dit de surveiller `el`, et on lui passe un callback qui s'exécute — en dehors du cycle de rendu React — quand l'élément croise le seuil `threshold: 0.1` (10% visible). Le callback ajoute alors directement une classe CSS (`is-visible`) au DOM avec `classList.add`, **sans passer par un `setState`** — parce qu'on ne veut pas re-render le composant, juste déclencher une transition CSS. `observer.disconnect()` arrête l'observation après le premier déclenchement (l'animation ne doit jouer qu'une fois).

L'animation elle-même est pure CSS, dans `app/globals.css` : `.reveal` démarre invisible et décalée (`opacity: 0; transform: translateY(14px)`), `.reveal.is-visible` (la classe ajoutée par l'observer) revient à l'état normal, et la `transition` fait l'interpolation.

Le bloc `@media (prefers-reduced-motion: reduce)` répond à un réglage système que certains utilisateurs activent (vertige, sensibilité aux mouvements). Quand il est actif, `.reveal` saute directement à l'état final (`opacity: 1; transform: none; transition: none`) et `.status-dot` arrête de pulser — le contenu reste identique, seule l'animation disparaît.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si tu changes `threshold: 0.1` en `threshold: 0.9` dans `reveal.tsx`, l'animation se déclenchera-t-elle plus tôt ou plus tard pendant le scroll ?
- Prédiction 2 : dans les DevTools du navigateur (Rendering → Emulate CSS media prefers-reduced-motion: reduce), les sections vont-elles apparaître d'un coup ou toujours en fondu ?

Teste les deux, dans cet ordre, puis reviens à `threshold: 0.1`.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder le code, écris le squelette d'un `useEffect` qui crée un `IntersectionObserver` sur un `ref`, ajoute une classe à l'intersection, et nettoie l'observer au démontage.
2. **Discrimination** : tu gères déjà des événements en React avec `onClick` déclaré en JSX. Pourquoi `IntersectionObserver` ne peut-il pas se déclarer de la même façon (`onIntersect={...}` sur la balise) et doit-il passer par `useEffect`/`useRef` ?
3. **Piège** : pourquoi ne pas simplement écouter `window.addEventListener('scroll', ...)` et calculer à la main la position de chaque élément par rapport à l'écran, plutôt qu'utiliser `IntersectionObserver` ?
4. Le callback de l'observer appelle `el.classList.add(...)` directement sur le DOM plutôt que `setState(true)`. Quelle différence de performance/re-render cela fait-il, et pourquoi ce choix a du sens ici ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
