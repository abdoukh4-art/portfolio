# Index des prérequis

Un prérequis n'est jamais lu directement : on tente son épreuve-portier d'abord. Réussie → coché, on continue. Ratée → on lit l'explication micro, on comble, on repasse l'épreuve. Un statut ne passe à `[validé le <date>]` que par épreuve réussie.

## Top 5 — priorité de validation (par nombre de leçons qui s'appuient dessus)

1. **[jsx-syntaxe](jsx-syntaxe.md)** — 9 leçons : react-fondamentaux, react-router, routes-protegees-multirole, server-client-components, approuter-fichiers, tailwind-utility-first, context-i18n, intersection-observer, theme-tokens
2. **[http-requete-reponse](http-requete-reponse.md)** — 6 leçons : cors-jwt-client, spring-ioc-annotations, spring-security-chaine-filtres, architecture-sans-backend, tool-use-orchestre, docker-compose
3. **[sql-de-base](sql-de-base.md)** — 5 leçons : jpa-hibernate-entites, memoire-court-long-terme, rag-similarite-citations, spring-ioc-annotations, docker-compose
4. **[npm-node-modules](npm-node-modules.md)** — 4 leçons : vite, architecture-sans-backend, build-deploiement, approuter-fichiers
5. **[json-format](json-format.md)** — 3 leçons : jwt-structure-emission, spring-ioc-annotations, tool-use-orchestre *(quasi ex-aequo avec variables-environnement et dom-bases, également à 3)*

## Liste complète

| Fichier | Statut | Leçons référentes |
|---|---|---|
| [jsx-syntaxe](jsx-syntaxe.md) | [non testé] | 9 (voir top 5) |
| [http-requete-reponse](http-requete-reponse.md) | [non testé] | 6 (voir top 5) |
| [sql-de-base](sql-de-base.md) | [non testé] | 5 (voir top 5) |
| [npm-node-modules](npm-node-modules.md) | [non testé] | 4 (voir top 5) |
| [json-format](json-format.md) | [non testé] | 3 (voir top 5) |
| [variables-environnement](variables-environnement.md) | [non testé] | 3 : docker-compose, provider-protocol, vite |
| [dom-bases](dom-bases.md) | [non testé] | 3 : intersection-observer, audio-analyser-reactif, tts-web-speech-synthesis |
| [decorateurs-python](decorateurs-python.md) | [non testé] | 2 : embeddings-chunking, memoire-court-long-terme |
| [promesses-async-js](promesses-async-js.md) | [non testé] | 2 : tts-web-speech-synthesis, cors-jwt-client |

## Non retenus comme prérequis (référence unique ou déjà couverts ailleurs)

- **Regex de base** (`\[(\d+)\]`) — une seule leçon (evaluation-golden-llm-juge), trop mineur pour un fichier dédié.
- **Base64** — une seule leçon (jwt-structure-emission), déjà expliqué en une phrase dans cette leçon même.
- **Annotations Java (mécanisme générique)** — pas un prérequis : c'est le sujet même de la leçon complète `concept-spring-ioc-annotations.md`.
- **useState/useEffect** — idem, déjà une leçon complète (`concept-react-fondamentaux.md`) ; les leçons qui les utilisent comme ancre doivent y renvoyer, pas dupliquer ici.
