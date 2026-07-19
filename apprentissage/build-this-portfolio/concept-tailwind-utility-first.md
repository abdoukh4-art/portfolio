# Tailwind — utility-first

## Prérequis

> Pour chaque prérequis [non testé] : passe son épreuve-portier d'abord. Réussie → coche et continue. Ratée → lis la fiche, comble, repasse l'épreuve. Ne lis jamais avant d'avoir tenté.

- [jsx-syntaxe](/learn/prerequis#jsx-syntaxe) — statut: [non testé]

## Avant de lire — Reconnaître (à froid)

1. En React (SGS), comment appliquais-tu du style à un élément — un fichier `.css` séparé, du CSS inline, autre chose ?
2. Regarde ce `className` tiré de `components/site.tsx` : `"font-mono text-xs tracking-widest lowercase text-accent mb-3"`. À ton avis, chaque mot correspond à quoi ?
3. Pourquoi `app/globals.css` ne contient-il presque aucune règle de style pour les boutons, titres, cartes — alors que le site est visiblement stylé ?

## Explication ancrée

Dans un projet React classique, tu écris une règle CSS une fois (dans un fichier `.css` ou un module CSS), tu lui donnes un nom de classe, et tu réutilises ce nom via `className="ma-carte"`. Le style et le composant vivent dans deux fichiers séparés.

Tailwind inverse ça : au lieu d'inventer un nom de classe et d'écrire la règle ailleurs, tu composes directement dans le `className` une suite de classes **utilitaires**, chacune ne faisant qu'une seule chose. Prends ce `className` de `SectionLabel` dans `components/site.tsx` :

```
"font-mono text-xs tracking-widest lowercase text-accent mb-3"
```

Se lit littéralement : police mono, texte petit, espacement de lettres large, minuscules, couleur accent, marge basse. Chaque classe = une déclaration CSS unique, prête à l'emploi, sans jamais écrire `.css`. Le style vit **dans le JSX**, à côté du composant — pas dans un fichier séparé qu'il faut aller chercher.

Alors pourquoi `app/globals.css` existe-t-il encore, avec `.reveal`, `.status-dot`, `::selection` ? Parce que Tailwind excelle pour du style statique et composable, mais ne remplace pas tout : les `@keyframes` (animation `status-pulse`), les sélecteurs combinés ajoutés dynamiquement par JS (`.reveal.is-visible`, posé par `IntersectionObserver`), ou les pseudo-éléments globaux (`::selection`) restent plus naturels en CSS classique. Le projet utilise donc les deux : Tailwind pour 95% du style visible dans le JSX, CSS classique pour la poignée de cas que les classes utilitaires n'expriment pas bien.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si tu changes `text-4xl sm:text-5xl` en `text-9xl sm:text-5xl` sur le `<h1>` du Hero, à quelle largeur d'écran le changement sera-t-il visible ?
- Prédiction 2 : `sm:` signifie "à partir de quelle largeur d'écran" — petit ou grand écran ?

Modifie temporairement la classe dans `components/site.tsx` (fonction `Hero`), observe en réduisant/agrandissant la fenêtre du navigateur, puis annule ton changement.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder le code, écris le `className` Tailwind pour reproduire `SectionLabel` (texte petit, police mono, minuscules, espacement large, couleur accent) sans copier — à partir de ta mémoire des noms de classes.
2. **Discrimination** : `.reveal` et `.status-dot` sont dans `globals.css`, pas en classes utilitaires inline. Qu'est-ce que ces deux cas ont en commun qui les rend impossibles (ou peu pratiques) à exprimer avec des classes utilitaires seules ?
3. **Piège** : pourquoi ne pas simplement écrire du CSS classique (un fichier `.css` par composant, comme tu ferais naturellement) plutôt que ces classes utilitaires qui rendent le JSX plus long à lire ?
4. Si tu voulais que `text-accent` soit bleu partout sur le site, changerais-tu chaque `className` un par un, ou existe-t-il un seul endroit à modifier ? (Réponds sans regarder — la réponse complète est dans le concept suivant.)

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
