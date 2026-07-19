# JWT côté serveur — fabriquer et vérifier un jeton signé

## Prérequis

> Pour chaque prérequis [non testé] : passe son épreuve-portier d'abord. Réussie → coche et continue. Ratée → lis la fiche, comble, repasse l'épreuve. Ne lis jamais avant d'avoir tenté.

- [json-format](/learn/prerequis#json-format) — statut: [non testé]

## Avant de lire — Reconnaître (à froid)

1. Tu as déjà appelé `jwtService.generateToken(email, role, ecoleId)` dans `AuthService` sans t'arrêter dessus. Colle mentalement un JWT quelconque sur jwt.io : il ressemble à trois blocs de texte séparés par des points. As-tu une idée de ce qu'il y a dans chacun ?
2. En JavaScript (maîtrisé), `JSON.stringify({role: "ADMIN"})` produit du texte lisible par n'importe qui. Un JWT chiffre-t-il vraiment ses informations, ou se contente-t-il de les encoder ?
3. `JwtFilter` appelle `jwtService.isTokenValid(token)`. Si quelqu'un modifie à la main un caractère du jeton (par exemple change `"role":"ETUDIANT"` en `"role":"ADMIN"` dans le texte décodé, puis recolle), cette méthode le détecte-t-elle ?

## Explication ancrée

Un JWT (*JSON Web Token*) est fait de trois parties séparées par des points, chacune encodée en Base64URL — pas chiffrée, seulement encodée, donc lisible par quiconque le décode (comme du `JSON.stringify`, maîtrisé, passé à travers un simple encodage texte) :

```
header.payload.signature
```

Dans `JwtService.generateToken()` de SGS :

```java
Jwts.builder()
    .setSubject(email)                 // payload : "sub"
    .claim("role", role)               // payload : "role"
    .claim("ecoleId", ecoleId)         // payload : "ecoleId" (si présent)
    .setIssuedAt(new Date())           // payload : "iat"
    .setExpiration(new Date(...))      // payload : "exp"
    .signWith(getSigningKey(), SignatureAlgorithm.HS256)  // fabrique la signature
    .compact();
```

Le **header** dit quel algorithme de signature est utilisé (`HS256` ici). Le **payload** contient les *claims* — les informations que le serveur veut retenir sur cette session : qui (`sub` = email), quel rôle, quelle école, et quand ça expire (`exp`). N'importe qui peut décoder ces deux blocs sans rien connaître du secret — ils ne sont **pas confidentiels**, juste lisibles par construction.

Ce qui protège le jeton, c'est la **signature** : `getSigningKey()` transforme la chaîne `jwt.secret` (dans `application.properties`, jamais commitée en clair en production) en clé HMAC, et `signWith(...)` calcule une empreinte du header + payload avec cette clé. Vérifier un jeton (`extractAllClaims`, appelée par `isTokenValid`) consiste à **recalculer** cette signature à partir du contenu reçu et à la comparer à celle jointe au jeton. Si quelqu'un modifie ne serait-ce qu'un caractère du payload (par exemple `ETUDIANT` → `ADMIN`) sans connaître le secret, la signature recalculée ne correspond plus, et `parseClaimsJws(token)` lève une exception — capturée par `isTokenValid`, qui renvoie `false`.

C'est pour ça que le serveur n'a besoin de **rien stocker** pour authentifier une requête : le jeton se suffit à lui-même, signé une fois à l'émission, vérifié à chaque requête sans jamais retourner en base — sauf pour la déconnexion (`TokenBlacklistService`), une exception délibérée à cette logique stateless pour pouvoir invalider un jeton avant son expiration naturelle. Le trajet du jeton côté client — son stockage et l'en-tête `Authorization: Bearer` que l'intercepteur axios attache à chaque requête — est couvert dans [CORS + JWT côté client](/learn/build-sgs-fullstack#cors-jwt-client).

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : connecte-toi via l'API (Postman ou le frontend), copie le token reçu, colle-le sur jwt.io (section debugger, sans le secret) — le payload s'affiche-t-il en clair ?
- Prédiction 2 : si tu modifies un caractère du payload décodé sur jwt.io et regénères un jeton *sans connaître* `jwt.secret`, ce nouveau jeton sera-t-il accepté par `isTokenValid` de ton backend ?

Fais le test (récupère un vrai token, décode-le, modifie-le, rejoue-le contre une route protégée), observe le résultat, note ce qui se passe réellement.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, décris les trois parties d'un JWT, ce que contient chacune, et explique avec tes mots ce que « vérifier un jeton » calcule concrètement.
2. **Discrimination** : « signer » (ce que fait `signWith`) et « chiffrer » sont deux opérations différentes. Un payload JWT signé mais non chiffré est-il confidentiel ? Qu'est-ce que la signature garantit alors, si ce n'est pas la confidentialité ?
3. **Piège** : pourquoi ne pas simplement chiffrer le payload plutôt que le signer, puisque `role` et `ecoleId` sont visibles en clair par quiconque décode le jeton reçu ?
4. Le serveur ne garde en mémoire aucune trace des jetons émis — sauf ceux mis en liste noire à la déconnexion (`TokenBlacklistService`). Pourquoi cette exception est-elle nécessaire, sachant qu'un JWT valide et non expiré serait normalement accepté indéfiniment jusqu'à `exp` ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
