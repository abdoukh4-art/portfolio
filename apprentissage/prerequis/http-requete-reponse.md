# HTTP — requête, réponse, headers

statut: [non testé]

## Épreuve-portier

1. Quand le navigateur charge `http://localhost:8080/api/offres`, qui envoie la première trame — le client ou le serveur ?
2. `Authorization: Bearer <token>` est un header. Fait-il partie de l'URL, du corps (body), ou d'une troisième zone de la requête ?

*Réussi les deux → coche et continue. Raté → lis ci-dessous.*

## Explication (si ratée)

Une requête HTTP part toujours du client (navigateur, Postman, `fetch`) vers un serveur, qui répond une seule fois par requête. Trois zones : une ligne méthode+URL (`GET /api/offres`), des **headers** (métadonnées clé-valeur — `Authorization`, `Content-Type` — jamais dans l'URL ni le body), et un **body** optionnel (souvent du JSON). `JwtFilter` (SGS) lit un header ; `ResponseEntity.ok(dto)` (SGS) écrit un body JSON. Un code de statut (`200`, `401`, `403`) accompagne toujours la réponse.
