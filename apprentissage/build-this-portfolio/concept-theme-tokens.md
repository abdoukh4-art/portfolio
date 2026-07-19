# Tokens de design — @theme et next/font

## Prérequis

> Pour chaque prérequis [non testé] : passe son épreuve-portier d'abord. Réussie → coche et continue. Ratée → lis la fiche, comble, repasse l'épreuve. Ne lis jamais avant d'avoir tenté.

- [jsx-syntaxe](/learn/prerequis#jsx-syntaxe) — statut: [non testé]

## Avant de lire — Reconnaître (à froid)

1. Dans SGS, où mettais-tu une valeur de config utilisée à plusieurs endroits (ex. une URL, un timeout) — codée en dur partout, ou centralisée quelque part ?
2. Regarde `app/globals.css` ligne 3-14 (`@theme inline { ... }`). Que penses-tu qu'il se passe si tu changes `--color-accent: #2438c9;` par une autre couleur ?
3. `app/layout.tsx` importe des polices Google (`Bricolage_Grotesque`, etc.) avec une option `variable: "--font-bricolage"`. À ton avis, à quoi sert ce nom `--font-bricolage`, et où réapparaît-il ?

## Explication ancrée

Dans SGS, tu ne codais pas l'URL de la base de données en dur dans chaque classe DAO — tu la mettais une fois dans `application.properties`, et Spring Boot l'injectait partout où c'était nécessaire. Un seul endroit de vérité, consommé à plusieurs endroits.

`@theme` dans `app/globals.css` joue exactement ce rôle pour le design :

```css
@theme inline {
  --color-accent: #2438c9;
  --font-display: var(--font-bricolage);
  ...
}
```

Tu déclares une fois `--color-accent`. Tailwind (v4) génère **automatiquement** à partir de ce nom les classes utilitaires `text-accent`, `bg-accent`, `border-accent`, etc. — celles que tu as vues dans le concept précédent. Change la valeur ici, et chaque usage de `text-accent`/`bg-accent` sur tout le site change avec — pas besoin de toucher `components/site.tsx`.

Différence importante avec `application.properties` : ce n'est pas un fichier lu au démarrage d'un serveur qui tourne. `@theme` est traité **au build** par l'outil Tailwind, qui génère du CSS statique. Une fois généré, c'est figé dans les fichiers CSS livrés au navigateur — pas de lecture "à chaque requête" comme le ferait Spring Boot avec sa config.

Les polices bouclent le même circuit. `next/font` (dans `app/layout.tsx`) télécharge la police Google **au build**, et l'expose comme variable CSS `--font-bricolage` posée sur la balise `<html>`. `@theme` la remappe ensuite vers un nom sémantique, `--font-display`, ce qui fait exister la classe utilitaire `font-display` utilisée dans `components/site.tsx` (ex. `font-display text-2xl font-semibold` sur les titres de projet). La chaîne complète : Google Fonts → `next/font` (build) → variable CSS sur `<html>` → `@theme` la renomme → classe Tailwind utilisable dans le JSX.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si tu changes `--color-accent: #2438c9;` en `--color-accent: #16a34a;` (vert), quels éléments visibles du site vont changer de couleur ?
- Prédiction 2 : devras-tu relancer `npm run dev` pour voir le changement, ou est-il instantané ?

Fais le changement dans `app/globals.css`, observe le site, puis reviens à la couleur d'origine.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder le code, écris de mémoire les 4 étapes qui relient "police Google Bricolage" à "classe `font-display` utilisable dans un `className`".
2. **Discrimination** : `application.properties` en Spring Boot est lu au démarrage du serveur et peut changer sans recompiler le code Java (juste relancer). `@theme` ici est traité au build par Tailwind. Quelle différence de nature cela crée-t-il si tu veux changer une couleur en production, sans repasser par un déploiement ?
3. **Piège** : pourquoi ne pas simplement écrire `#2438c9` en dur dans chaque `className` qui a besoin de cette couleur, plutôt que de définir `--color-accent` une seule fois ?
4. `--color-accent-soft` existe aussi (`#eef0fb`, utilisé dans le bloc de status du Hero). Pourquoi une variante "soft" séparée plutôt que réutiliser `--color-accent` avec une opacité réduite en CSS ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
