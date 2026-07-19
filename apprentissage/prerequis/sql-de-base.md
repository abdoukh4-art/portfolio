# SQL — SELECT, INSERT, clé primaire/étrangère

statut: [non testé]

## Épreuve-portier

1. `SELECT * FROM candidatures WHERE id_etudiant = 3;` sans aucune ligne correspondante — erreur, `null`, ou liste vide ?
2. Une clé étrangère (`id_stage` dans `candidatures`) pointe vers quelle colonne d'une autre table, en général ?

*Réussi les deux → coche et continue. Raté → lis ci-dessous.*

## Explication (si ratée)

SQL manipule des tables (lignes/colonnes) avec quatre verbes : `SELECT` (lire), `INSERT` (ajouter), `UPDATE` (modifier), `DELETE` (supprimer), filtrés par `WHERE`. Une requête sans résultat renvoie une liste **vide**, jamais une erreur. Une **clé primaire** (`id`) identifie une ligne de façon unique ; une **clé étrangère** contient l'`id` d'une ligne d'une *autre* table, créant un lien — exactement ce que fait `@ManyToOne` en JPA (SGS), et ce que la table `runs` de Consilio (SQLite brut) réplique en plus simple.
