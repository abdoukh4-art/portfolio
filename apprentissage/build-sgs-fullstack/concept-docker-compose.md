# Docker & docker-compose — faire parler plusieurs services entre eux

## Avant de lire — Reconnaître (à froid)

1. Dans `application.properties`, tu as `spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/sgs_db}`. Que doit contenir ta machine pour que cette ligne fonctionne, aujourd'hui, sans Docker ?
2. Ouvre `docker-compose.yml` : le service `backend` reçoit `SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/${POSTGRES_DB}`. `postgres` n'est ni `localhost` ni une IP. Une hypothèse sur ce que c'est ?
3. Le service `backend` a `depends_on: postgres, redis, minio`. À ton avis, à quoi ça sert concrètement ?

## Explication ancrée

Tu connais déjà la douleur que Docker résout : pour lancer ton backend Spring Boot en local, il faut d'abord que PostgreSQL soit installé, démarré, avec le bon user/password déjà créés — sinon ton `jdbc:postgresql://localhost:5432/sgs_db` (mastered JPA/Hibernate) ne trouve rien. Un **conteneur** Docker est une boîte qui embarque un programme (Postgres, Redis, ton propre backend) avec tout ce qu'il faut pour tourner, isolée du reste de la machine. `docker-compose.yml` déclare *plusieurs* conteneurs qui doivent démarrer ensemble : ici `postgres`, `pgadmin`, `backend`, `minio`, `redis`.

Le point le plus important, et le moins intuitif : **comment ces conteneurs se parlent entre eux**. Chaque conteneur est isolé — il ne voit pas les autres via `localhost`, contrairement à des processus lancés directement sur ta machine. Docker Compose crée un réseau privé où **le nom du service devient une adresse DNS**. C'est pour ça que le `backend` contacte Postgres via `jdbc:postgresql://postgres:5432/...` — `postgres` est littéralement le nom déclaré à la ligne `services: postgres:` du fichier. Si tu mettais `localhost` à la place, le conteneur `backend` chercherait Postgres... en lui-même, et échouerait.

Nuance : `localhost:5432` fonctionne quand tu lances le backend **hors Docker** (directement avec `mvn`) et que seul Postgres tourne dans un conteneur — car le port `5432` est *publié* (`ports: "5432:5432"`) sur la machine hôte. Deux chemins différents pour la même base, selon qui appelle.

`depends_on` ordonne le *démarrage* (Postgres avant Backend), mais ne garantit pas que Postgres soit déjà prêt à accepter des connexions — c'est une limite connue de Docker Compose, pas une garantie de disponibilité.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si dans `docker-compose.yml` tu remplaces `SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/${POSTGRES_DB}` par `jdbc:postgresql://localhost:5432/${POSTGRES_DB}`, que va afficher le conteneur `backend` au démarrage ?
- Prédiction 2 : est-ce que Postgres, lui, va planter aussi ?

Fais le changement, lance `docker compose up backend` (les autres services doivent déjà tourner), lis les logs du conteneur `backend` jusqu'à l'erreur de connexion, puis annule le changement.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder le fichier, écris un `docker-compose.yml` minimal avec deux services — `db` (postgres) et `app` — où `app` doit pouvoir joindre `db`. Quelle valeur d'hôte utilises-tu dans l'URL de connexion de `app`, et pourquoi ?
2. **Discrimination** : tu as deux URL JDBC valides dans ce projet — `jdbc:postgresql://localhost:5432/sgs_db` (application.properties, valeur par défaut) et `jdbc:postgresql://postgres:5432/${POSTGRES_DB}` (docker-compose.yml). Dans quel contexte d'exécution chacune est-elle correcte, et pourquoi la mauvaise combinaison casse tout ?
3. **Piège** : pourquoi ne pas simplement installer PostgreSQL, Redis et MinIO directement sur ta machine (sans Docker), comme tu l'as sûrement fait pour tes premiers projets Spring Boot ? Qu'est-ce que `docker-compose.yml` te fait gagner que l'installation manuelle ne donne pas ?
4. `depends_on` garantit-il que Postgres accepte déjà des connexions quand `backend` démarre ? Que peut-il se passer si non ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
