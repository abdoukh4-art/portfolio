# react-router — synchroniser l'URL avec les composants affichés

## Prérequis

> Pour chaque prérequis [non testé] : passe son épreuve-portier d'abord. Réussie → coche et continue. Ratée → lis la fiche, comble, repasse l'épreuve. Ne lis jamais avant d'avoir tenté.

- [jsx-syntaxe](/learn/prerequis#jsx-syntaxe) — statut: [non testé]

## Avant de lire — Reconnaître (à froid)

1. En React pur (mastered), sans librairie de routing, comment changerais-tu d'« écran » — un state `currentPage` avec du rendu conditionnel ? Quel problème ça pose pour le bouton retour du navigateur ou un lien partagé ?
2. Dans `frontend/src/app/routes.tsx`, la route `/etudiant` a un champ `children: [...]` avec `{ path: 'dashboard', element: <StudentDashboard /> }`. Comment ce `dashboard` (sans `/`) se combine-t-il avec `/etudiant`, à ton avis ?
3. `Layout.tsx` contient `<Outlet />`. À quoi sert un élément dont tu ne connais pas le contenu à l'avance ?

## Explication ancrée

En React seul (mastered), « naviguer » entre écrans se fait souvent avec un `useState` et du rendu conditionnel — mais l'URL du navigateur ne bouge jamais : pas de bouton retour fonctionnel, pas de lien partageable vers une page précise, un F5 qui retombe toujours au même endroit. **react-router** résout ça : il maintient une correspondance entre l'URL affichée et l'arbre de composants rendu, en s'appuyant sur l'API History du navigateur plutôt que sur un rechargement complet.

Le routeur de SGS se déclare en un seul endroit, `frontend/src/app/routes.tsx`, comme un tableau de routes :

```tsx
export const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  {
    path: '/etudiant',
    element: <PrivateRoute allowedRoles={['ETUDIANT']}><Layout /></PrivateRoute>,
    children: [
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'offers', element: <OfferCatalog /> },
    ],
  },
]);
```

Les `children` sont des **routes imbriquées** : `dashboard` (sans `/`) se concatène au `path` du parent → `/etudiant/dashboard`. Le composant parent (`Layout`) doit alors contenir un `<Outlet />` (`Layout.tsx`) : c'est l'emplacement où react-router insère le composant enfant qui correspond à l'URL courante — Navbar et Sidebar restent affichés, seul le contenu change.

Pour les liens, SGS utilise `NavLink` (`Sidebar.tsx`) plutôt que `<a href>` classique (mastered HTML) : `<a>` déclenche un rechargement complet de la page (le navigateur redemande tout depuis zéro), alors que `NavLink`/`Link` interceptent le clic et mettent à jour l'URL + le composant affiché **sans recharger**, en plus d'exposer un état `isActive` pour styliser le lien courant :

```tsx
<NavLink to={item.path} className={({ isActive }) => isActive ? 'text-brand' : '...'}>
```

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si dans `Sidebar.tsx` tu remplaces temporairement un `<NavLink to={item.path}>` par `<a href={item.path}>`, le clic va-t-il toujours t'amener à la bonne page ?
- Prédiction 2 : quelle différence *visible* observes-tu au moment du clic (regarde l'onglet Network : y a-t-il un rechargement complet du document ?) ?

Fais le changement sur un seul lien, clique dessus, observe l'onglet Network (colonne Type/Initiator) et le flash blanc éventuel, puis annule.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, écris un tableau `createBrowserRouter` minimal avec une route parent `/admin` contenant un `<Outlet />` et deux routes enfants `dashboard` et `offers`.
2. **Discrimination** : `<a href="/etudiant/dashboard">` et `<NavLink to="/etudiant/dashboard">` amènent au même endroit visuellement. Qu'est-ce qui se passe différemment au niveau du navigateur (requête réseau, état JS en mémoire) entre les deux ?
3. **Piège** : pourquoi ne pas simplement garder un `useState<string>('dashboard')` au sommet de l'appli et faire du rendu conditionnel, comme en React pur, plutôt qu'installer et configurer toute une librairie de routing ?
4. Le chemin enfant est `'dashboard'` (relatif) et non `'/etudiant/dashboard'` (absolu) dans `routes.tsx`. Que se passerait-il si tu déplaçais ce bloc `children` sous un autre parent avec un `path` différent — devrais-tu réécrire les chemins enfants ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
