# Routes protégées côté frontend — le garde par rôle (et son piège)

## Avant de lire — Reconnaître (à froid)

1. En Spring Security (mastered), `.requestMatchers("/api/admin/**").hasRole("ADMIN")` est vérifié **où** — sur la machine du client, ou sur le serveur ?
2. Si un utilisateur malveillant modifiait le JavaScript de ton frontend dans les DevTools pour supprimer toute vérification de rôle, pourrait-il accéder aux données `/api/admin/**` de ton backend ?
3. `Array.prototype.includes` (`['A','B'].includes('A')` → `true`) et `String.prototype.includes` (`'SUPER_ADMIN'.includes('ADMIN')` → `true`) portent le même nom. Sont-ils équivalents ?

## Explication ancrée

Tu as déjà ce réflexe côté Spring Security : `.requestMatchers(...).hasRole("ADMIN")` (mastered) — le serveur vérifie le rôle avant de laisser passer une requête, et c'est **la vraie barrière**, celle qui compte vraiment puisqu'un client ne peut pas la contourner. `PrivateRoute.tsx` fait la même vérification côté React, mais avec une nature différente à bien saisir : c'est du confort d'expérience utilisateur (éviter d'afficher un écran interdit, rediriger proprement), **jamais** une sécurité réelle — tout code JS envoyé au navigateur peut être lu et modifié par l'utilisateur qui le reçoit.

```tsx
export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
}
```

Le commentaire du fichier raconte un vrai bug corrigé : *« Correspondance EXACTE de rôle. L'ancien matching par sous-chaîne laissait un ADMIN franchir une garde `['SUPER_ADMIN']` car `'SUPER_ADMIN'.includes('ADMIN')` »*. Autrement dit : une version précédente comparait les rôles avec `String.includes` (test de sous-chaîne : `'SUPER_ADMIN'.includes('ADMIN')` → `true`, car `ADMIN` est *contenu dans* `SUPER_ADMIN`) au lieu d'`Array.includes` (test d'appartenance exacte à une liste). Résultat : un simple `ADMIN` passait une garde censée être réservée au `SUPER_ADMIN`. Le fix garde le même nom de méthode (`.includes`), mais change complètement de type derrière (`Array` au lieu de `String`) — une confusion facile.

Chaque branche de rôle a aussi son propre menu (`Sidebar.tsx`, `roleNavigation: Record<UserRole, NavItem[]>`) : un `ETUDIANT` voit « Mes candidatures », un `ADMIN` voit « Valider affectations ». Cette carte rôle → menu est encore de l'UX, redondante avec — pas un substitut à — la vérification serveur (`SecurityConfig.java`, `@PreAuthorize` sur les controllers).

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si tu remplaces `!allowedRoles.includes(user.role)` par une version bugguée `!allowedRoles.some(r => r.includes(user.role))` dans `PrivateRoute.tsx`, et que tu te connectes en tant que `ADMIN`, arriveras-tu à accéder à `/super-admin` (gardée par `['SUPER_ADMIN']`) ?
- Prédiction 2 : si le backend a bien ses propres `@PreAuthorize`/`hasRole("SUPER_ADMIN")` sur les endpoints `/api/super-admin/**`, cet ADMIN pourra-t-il réellement lire des données de super-admin une fois arrivé sur la page ?

Fais le changement, connecte-toi en ADMIN, navigue vers `/super-admin`, observe si tu passes la garde front — puis regarde si les appels API de cette page réussissent ou renvoient 403 — puis annule le changement.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, réécris de zéro un composant `PrivateRoute` qui redirige vers `/` si non authentifié, et vers `/unauthorized` si le rôle de l'utilisateur n'est pas dans `allowedRoles`.
2. **Discrimination** : `['SUPER_ADMIN'].includes('ADMIN')` (Array) et `'SUPER_ADMIN'.includes('ADMIN')` (String) renvoient des booléens différents. Explique précisément ce que chacun teste, et pourquoi le bug de ce fichier était invisible tant que personne ne testait un rôle dont le nom est une sous-chaîne d'un autre.
3. **Piège** : si `SecurityConfig.java` fait déjà `.requestMatchers("/api/super-admin/**").hasRole("SUPER_ADMIN")` côté serveur, à quoi sert vraiment `PrivateRoute` côté React ? Le backend ne suffit-il pas à lui seul pour la sécurité ?
4. Pourquoi ce bug (`String.includes` au lieu d'`Array.includes`) est-il un problème de **sécurité** et pas seulement un bug d'affichage — sachant que la vraie barrière est côté Spring Security ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
