# JSON — le format, pas la méthode JS

statut: [non testé]

## Épreuve-portier

1. `{"role": "ADMIN", "exp": 1234}` est du JSON. Une clé JSON peut-elle être un nombre nu, ou seulement une chaîne entre guillemets ?
2. Un payload JWT et un objet JS en mémoire (`{role: "ADMIN"}`) sont-ils la même chose, ou l'un est-il la version texte de l'autre ?

*Réussi les deux → coche et continue. Raté → lis ci-dessous.*

## Explication (si ratée)

JSON (*JavaScript Object Notation*) est un format **texte** pour des données structurées : objets `{clé: valeur}` (clés toujours entre guillemets), tableaux, chaînes, nombres, booléens, `null` — rien d'autre. Format d'échange par défaut entre backend et frontend (SGS : `ResponseEntity.ok(dto)` sérialise un objet Java en JSON) ou entre un LLM et le code appelant (`tools=[...]` attend un schéma JSON). `JSON.stringify`/`JSON.parse` convertissent objet JS ↔ texte JSON — un payload JWT n'est qu'un JSON encodé en Base64URL.
