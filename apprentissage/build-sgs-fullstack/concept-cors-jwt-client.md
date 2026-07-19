# CORS et le JWT côté client — le pont front ↔ back

## Prérequis

> Pour chaque prérequis [non testé] : passe son épreuve-portier d'abord. Réussie → coche et continue. Ratée → lis la fiche, comble, repasse l'épreuve. Ne lis jamais avant d'avoir tenté.

- [http-requete-reponse](/learn/prerequis#http-requete-reponse) — statut: [non testé]
- [promesses-async-js](/learn/prerequis#promesses-async-js) — statut: [non testé]

## Avant de lire — Reconnaître (à froid)

1. Quand tu testes ton backend avec Postman, l'origine de la requête n'a jamais posé de problème. Un navigateur qui exécute du JavaScript depuis `http://localhost:5173` et appelle `http://localhost:8080` se comporte-t-il pareil ?
2. Dans `SecurityConfig.java`, ton `JwtFilter` (mastered) lit le header `Authorization: Bearer <token>` sur chaque requête entrante. Ce header ne s'ajoute pas tout seul — qui, côté React, doit l'y mettre, et quand ?
3. `configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173", "http://localhost:5174"))` — pourquoi une liste précise plutôt que « tout le monde » ?

## Explication ancrée

Deux mécanismes distincts se rencontrent ici, à ne pas confondre. Le **JWT**, tu le maîtrises côté serveur : `JwtFilter` lit le header `Authorization`, valide le token, identifie l'utilisateur. Ce que tu n'as pas encore pratiqué, c'est **comment ce header arrive côté client**, et une contrainte de navigateur qui n'existe pas quand Postman appelle ton API : **CORS** (Cross-Origin Resource Sharing).

Un navigateur applique le *Same-Origin Policy* : du JavaScript chargé depuis une origine (`http://localhost:5173`, le serveur Vite) ne peut pas, par défaut, lire la réponse d'un appel vers une origine différente (`http://localhost:8080`, Spring Boot) — même si la requête part bien. Postman ignore cette règle car ce n'est pas un navigateur exécutant du JS tiers. Le serveur doit **explicitement** autoriser l'origine du frontend, dans `SecurityConfig.java` :

```java
configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173", "http://localhost:5174"));
configuration.setAllowCredentials(true);
```

`5173`/`5174` sont les ports par défaut de Vite. Sans cette liste, le navigateur bloque la réponse *avant même qu'elle atteigne ton code React* — l'erreur apparaît dans la console du navigateur, jamais dans tes intercepteurs axios.

Côté client, le JWT est attaché automatiquement via un **intercepteur axios** (`api/axios.ts`), qui s'exécute avant chaque requête :

```ts
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

Un second intercepteur surveille la *réponse* : si le serveur renvoie `401` (token expiré/invalide — le `JwtFilter` mastered a rejeté la requête), il vide le `localStorage` et redirige vers le login — sans que chaque écran ait à y penser individuellement.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si tu retires `"http://localhost:5173"` de `setAllowedOrigins` dans `SecurityConfig.java`, redémarres le backend, puis tentes un login depuis le frontend Vite (port 5173) — l'erreur apparaîtra-t-elle dans l'onglet Network de ton navigateur comme un `401`, ou ailleurs ?
- Prédiction 2 : le même appel de login rejoué dans Postman va-t-il échouer aussi ?

Fais le changement, redémarre le backend, tente le login depuis le frontend (regarde la console *et* l'onglet Network), rejoue exactement le même appel dans Postman, compare, puis annule.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, écris de zéro un intercepteur de requête axios qui ajoute `Authorization: Bearer <token>` depuis `localStorage`, et un intercepteur de réponse qui déconnecte l'utilisateur sur un `401`.
2. **Discrimination** : une requête bloquée par CORS et une requête qui reçoit un `401` du `JwtFilter` ressemblent toutes deux à « ça ne marche pas » depuis l'écran React. Comment distingues-tu les deux dans l'onglet Network du navigateur, et pourquoi l'intercepteur de réponse axios ne voit-il **jamais** passer une erreur CORS ?
3. **Piège** : pourquoi ne pas simplement mettre `setAllowedOrigins(List.of("*"))` (autoriser toutes les origines) plutôt que lister précisément `localhost:3000/5173/5174` ? Qu'est-ce que ça affaiblirait, sachant que `setAllowCredentials(true)` est actif ?
4. Le token est stocké dans `localStorage` (`AuthContext.tsx`). Quelle est la limite de sécurité connue de ce choix, et pourquoi le `JwtFilter` côté serveur ne peut-il rien y faire ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
