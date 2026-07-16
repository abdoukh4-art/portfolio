# JPA/Hibernate — des classes Java aux lignes PostgreSQL

## Avant de lire — Reconnaître (à froid)

1. En Laravel (en cours), une migration (`Schema::create('stages', function (Blueprint $table) {...})`) est un fichier séparé qui décrit les colonnes d'une table. Dans SGS, ouvre `Stage.java` — où est le fichier qui décrit la table `stages` de PostgreSQL (maîtrisé) ?
2. `Candidature` a un champ `private Etudiant etudiant;` et un champ `private Stage stage;`. À ton avis, combien de colonnes supplémentaires ça ajoute à la table `candidatures`, et de quel type ?
3. `Etudiant extends Utilisateur` — les deux sont `@Entity`, avec des tables séparées (`utilisateurs`, `etudiants`). Un étudiant vit-il dans une seule table, ou dans deux ?

## Explication ancrée

En Laravel (en cours), tu décris une table dans un fichier de migration, séparé du modèle Eloquent qui la manipule. Ici, il n'y a pas ce deuxième fichier : la classe `Stage.java`, annotée, **est** la définition de la table. `@Entity` dit à Hibernate « cette classe correspond à une table », `@Table(name = "stages")` la nomme, et chaque champ devient une colonne. Au démarrage, `spring.jpa.hibernate.ddl-auto=update` (`application.properties`) lit ces annotations et crée ou modifie la table PostgreSQL (maîtrisé) en conséquence — tu ne l'écris jamais toi-même en SQL.

```java
@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;                              // clé primaire, auto-incrémentée par Postgres

@Enumerated(EnumType.STRING)
@Column(nullable = false)
private StatutOffre statut = StatutOffre.EN_ATTENTE;   // colonne VARCHAR, valeurs limitées à l'enum

@ManyToOne(optional = false)
@JoinColumn(name = "id_entreprise", nullable = false)
private Entreprise entreprise;                // colonne id_entreprise, clé étrangère vers entreprises
```

`@ManyToOne` est la traduction directe d'une clé étrangère PostgreSQL : `Candidature` a un `@ManyToOne` vers `Etudiant` *et* un vers `Stage` → la table `candidatures` a deux colonnes, `id_etudiant` et `id_stage`, chacune référençant une ligne d'une autre table. Manipuler `candidature.getEtudiant().getNom()` en Java déclenche, derrière, une jointure ou une requête séparée vers `etudiants`.

Le cas le plus subtil du projet : `Utilisateur` est abstraite, `@Inheritance(strategy = InheritanceType.JOINED)`, table `utilisateurs` (id, email, mot de passe...). `Etudiant extends Utilisateur`, `@PrimaryKeyJoinColumn(name = "id_utilisateur")`, table `etudiants` (cne, nom, niveau...). Un seul étudiant existe en réalité comme **deux lignes jointes** — une dans `utilisateurs`, une dans `etudiants`, reliées par le même identifiant. Ce n'est pas un `@ManyToOne` (« a un ») : c'est de l'héritage (« est un »), et Hibernate fait la jointure pour toi à chaque lecture.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si tu ajoutes un nouveau champ `private String remarque;` dans `Stage.java` et relances le backend (`ddl-auto=update`), la colonne apparaît-elle automatiquement dans la table `stages` de PostgreSQL, sans rien écrire en SQL ?
- Prédiction 2 : si une ligne existe déjà dans `stages` avant ce changement, que contient sa nouvelle colonne `remarque` après le redémarrage ?

Fais le changement, relance le backend, inspecte la table `stages` (psql ou pgAdmin) pour vérifier, puis annule le changement et relance.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, écris de zéro une entité `Livre` avec un `id` auto-généré, un champ `titre`, et une relation `@ManyToOne` vers une entité `Auteur` — précise le nom de la colonne de clé étrangère générée.
2. **Discrimination** : `Candidature → Stage` (`@ManyToOne`) et `Etudiant → Utilisateur` (héritage `JOINED`) créent tous deux un lien entre deux tables via une colonne partagée. Qu'est-ce qui distingue structurellement ces deux cas — et pourquoi le second n'a-t-il pas simplement été modélisé avec un `@ManyToOne` classique ?
3. **Piège** : pourquoi ne pas mettre toutes les colonnes (celles des étudiants, des entreprises, des encadrants...) dans une seule table `utilisateurs`, avec beaucoup de colonnes vides selon le type de compte — plutôt que `JOINED` et ses jointures à chaque lecture ?
4. `ddl-auto=update` ne supprime jamais une colonne que tu retires d'une entité. Pourquoi ce choix, et quel danger ça repousse simplement à plus tard sur une base déjà peuplée ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
