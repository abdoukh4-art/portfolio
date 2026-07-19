# App Router — routage par fichiers

## Prérequis

> Pour chaque prérequis [non testé] : passe son épreuve-portier d'abord. Réussie → coche et continue. Ratée → lis la fiche, comble, repasse l'épreuve. Ne lis jamais avant d'avoir tenté.

- [jsx-syntaxe](/learn/prerequis#jsx-syntaxe) — statut: [non testé]
- [npm-node-modules](/learn/prerequis#npm-node-modules) — statut: [non testé]

## Avant de lire — Reconnaître (à froid)

1. Dans SGS (Spring Boot), comment le serveur sait-il que `/internships` doit exécuter telle méthode de tel contrôleur ?
2. À ton avis, dans `/home/abdou/ensias/portfolio/app`, comment Next.js sait-il que `page.tsx` correspond à la racine `/` du site ?
3. Que fait `app/layout.tsx` à ton avis, sachant qu'il enveloppe `{children}` ?

## Explication ancrée

Dans SGS, chaque route existe parce que tu l'as déclarée explicitement : `@GetMapping("/internships")` sur une méthode d'un `@RestController`. Sans l'annotation, l'URL n'existe pas. C'est un routage **explicite et centralisé** dans le code.

L'App Router de Next.js fait l'inverse : le routage est **implicite et basé sur l'arborescence des dossiers**. Dans `app/`, un dossier = un segment d'URL, et un fichier `page.tsx` à l'intérieur = le contenu affiché pour cette URL. `app/page.tsx` (vu dans le projet) correspond à `/`. Si tu créais `app/about/page.tsx`, `/about` existerait automatiquement — aucune annotation, aucun fichier de config à toucher.

`app/layout.tsx` n'est pas une route, c'est une coquille partagée. Regarde sa signature :

```tsx
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={...}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

C'est un composant React ordinaire qui reçoit `children` — exactement le pattern de composition que tu connais déjà en React (un composant `<Layout>` qui wrap ses enfants). La différence Next.js : ce layout est **automatiquement** appliqué à toute page du même dossier ou des sous-dossiers, sans que tu aies à l'importer toi-même dans `page.tsx`. C'est Next.js qui fait `<RootLayout><Page/></RootLayout>` pour toi, en se basant sur la position des fichiers.

Deux mots-clés réservés gouvernent ce système : `page.tsx` (le contenu de la route) et `layout.tsx` (la coquille partagée par cette route et ses enfants). Un dossier sans `page.tsx` n'est pas une route visitable, même s'il existe.

## À exécuter — Casser

Avant de lancer quoi que ce soit, écris tes deux prédictions :
- Prédiction 1 : si tu crées `app/about/page.tsx` avec un simple `export default function About() { return <p>test</p>; }`, que va afficher `localhost:3000/about` ?
- Prédiction 2 : ce nouveau `/about` aura-t-il la nav (`Nav`) et le fond de `RootLayout`, ou une page blanche isolée ?

Crée ce fichier, lance `npm run dev`, visite `/about`. Compare avec tes prédictions. Supprime le fichier ensuite.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder le code, dessine (en texte) l'arborescence minimale de dossiers/fichiers nécessaire pour que `/projects/consilio` affiche une page. Nomme précisément chaque fichier.
2. **Discrimination** : dans SGS, pourquoi dois-tu annoter chaque route explicitement (`@GetMapping`) alors qu'ici il suffit de créer un dossier ? Quel est le compromis (avantage/inconvénient) de chaque approche ?
3. **Piège** : pourquoi Next.js n'utilise-t-il pas un routeur centralisé façon `<Route path="/about" element={...} />` (le style React Router que tu as pu croiser) plutôt que la convention par dossiers ? Qu'est-ce que la convention par dossiers rend plus facile ou plus difficile ?
4. `layout.tsx` est-il ré-exécuté à chaque navigation entre `/` et `/about`, ou reste-t-il "stable" ? Justifie ta réponse à partir de ce que tu sais du rôle d'un layout.

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
