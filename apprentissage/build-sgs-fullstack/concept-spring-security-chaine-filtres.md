# Spring Security — la chaîne de filtres qui décide avant le contrôleur

## Prérequis

> Pour chaque prérequis [non testé] : passe son épreuve-portier d'abord. Réussie → coche et continue. Ratée → lis la fiche, comble, repasse l'épreuve. Ne lis jamais avant d'avoir tenté.

- [http-requete-reponse](/learn/prerequis#http-requete-reponse) — statut: [non testé]

## Avant de lire — Reconnaître (à froid)

1. Dans SGS, une requête `GET /api/admin/offres` arrive avec un header `Authorization: Bearer <token>`. Avant même que le code de `StageController.offresAdmin()` s'exécute, penses-tu que quelque chose d'autre a déjà lu ce header ?
2. `JwtFilter extends OncePerRequestFilter` et sa méthode s'appelle `doFilterInternal(request, response, filterChain)`. Le dernier paramètre, `filterChain` — à ton avis, que se passe-t-il si `JwtFilter` ne l'appelle jamais ?
3. Dans `SecurityConfig.java`, un token absent produit un `401`, un token valide mais un rôle insuffisant produit un `403`. Ce sont deux blocs de code séparés (`authenticationEntryPoint` / `accessDeniedHandler`). Pourquoi cette distinction, plutôt qu'une seule erreur générique « accès refusé » ?

## Explication ancrée

Tu as écrit ce filtre dans SGS sans avoir tracé, requête par requête, ce qu'il fait réellement dans la chaîne. Une **chaîne de filtres** ressemble à une suite de postes de contrôle qu'une requête HTTP doit traverser avant d'atteindre ta méthode `@GetMapping` : chaque filtre vérifie une chose précise et *laisse passer* — ou bloque net — avant le suivant. `JwtFilter` en est un, inséré explicitement dans `SecurityConfig` :

```java
.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
```

Ce qui distingue un filtre d'une simple fonction : il reçoit le `filterChain` lui-même en paramètre, et c'est *lui* qui décide de continuer (`filterChain.doFilter(request, response)`) ou d'arrêter tout net en écrivant directement une réponse d'erreur — comme le fait `JwtFilter` sur un token blacklisté (`response.setStatus(401); return;`, sans jamais appeler `doFilter`). Si le filtre n'appelle pas `doFilter`, aucun contrôleur ne s'exécute jamais, quoi qu'il arrive.

Quand un token est valide, `JwtFilter` ne se contente pas de le vérifier (ça, c'est `JwtService` — voir [structure et vérification du JWT](/learn/build-sgs-fullstack#jwt-structure-emission)) : il **pose l'identité** de la requête dans un espace partagé pour tout le reste du traitement, `SecurityContextHolder` :

```java
SecurityContextHolder.getContext().setAuthentication(
    new UsernamePasswordAuthenticationToken(email, null, List.of(new SimpleGrantedAuthority(role)))
);
```

C'est cette identité, posée *avant* que le contrôleur ne s'exécute, que consultent ensuite `.requestMatchers("/api/admin/**").hasRole("ADMIN")` (dans `SecurityConfig`) et `@PreAuthorize("hasRole('ADMIN')")` (sur les méthodes de contrôleur — voir [la garde par rôle côté React](/learn/build-sgs-fullstack#routes-protegees-multirole), qui n'est que du confort face à celle-ci, la seule qui compte réellement). `JwtFilter` répond à « qui es-tu ? » (authentification) ; `hasRole`/`@PreAuthorize` répondent à « as-tu le droit ? » (autorisation) — deux étapes distinctes, dans cet ordre.

Dernier détail qui explique le `401` vs `403` : `sessionCreationPolicy(STATELESS)` signifie qu'aucune session serveur n'est gardée entre deux requêtes — chaque requête est ré-authentifiée de zéro par `JwtFilter`. Un `401` (`authenticationEntryPoint`) veut dire « je ne sais pas qui tu es » (token absent ou invalide, l'étape `JwtFilter` a échoué) ; un `403` (`accessDeniedHandler`) veut dire « je sais qui tu es, mais ton rôle ne suffit pas » (l'étape `hasRole`/`@PreAuthorize`, plus loin dans la chaîne, a échoué).

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si tu commentes temporairement `filterChain.doFilter(request, response);` en fin de `JwtFilter.doFilterInternal` (juste avant le `finally`), et que tu appelles n'importe quelle route — même publique comme `/api/auth/login` — que va-t-il se passer ?
- Prédiction 2 : le contrôleur de login s'exécutera-t-il quand même, vu que cette route est `permitAll()` ?

Fais le changement, relance le backend, appelle `/api/auth/login`, observe (aucune réponse ? timeout ? erreur ?), puis annule.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, écris de zéro le squelette d'un `OncePerRequestFilter` qui lit un header, et qui appelle `filterChain.doFilter(...)` uniquement si une condition est vraie.
2. **Discrimination** : `JwtFilter` (authentification, « qui es-tu ») et `@PreAuthorize("hasRole('ADMIN')")` (autorisation, « as-tu le droit ») s'exécutent tous deux avant le corps de ta méthode de contrôleur. Si `JwtFilter` échoue à identifier l'utilisateur, `@PreAuthorize` s'exécute-t-il quand même ensuite ?
3. **Piège** : pourquoi ne pas vérifier le rôle directement avec un `if (!role.equals("ADMIN")) throw ...` au début de chaque méthode de contrôleur, plutôt que ce mécanisme en plusieurs étapes (filtre + `SecurityContextHolder` + `hasRole`/`@PreAuthorize`) ?
4. Un token expiré et un token absent produisent tous deux un `401` dans SGS. Un rôle `ETUDIANT` qui appelle `/api/admin/offres` produit un `403`. Explique à quelqu'un qui ne voit que le code HTTP pourquoi ce ne sont pas la même catégorie de problème.

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
