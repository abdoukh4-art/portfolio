# Spring Boot le cœur — inversion de contrôle et annotations

## Avant de lire — Reconnaître (à froid)

1. En JavaScript ou Python (maîtrisé), quand une classe `StageService` a besoin d'un `StageRepository` pour fonctionner, comment le lui donnes-tu concrètement — écris la ligne de code ?
2. `StageRepository` dans SGS est une `interface` Java qui étend `JpaRepository<Stage, Long>` — aucune classe `StageRepositoryImpl` n'existe dans le projet. Pourtant `stageRepository.save(stage)` fonctionne. Qui a écrit le code qui s'exécute réellement ?
3. `@GetMapping("/api/offres")` sur une méthode Java — à ton avis, qui lit cette annotation, et quand ?

## Explication ancrée

Tu as déjà écrit ce code dans SGS sans t'arrêter sur ce qu'il déclenche réellement. En JavaScript/Python (maîtrisé), tu contrôles toi-même la construction de tes objets : `const service = new StageService(new StageRepository())` — c'est *toi* qui assembles les pièces, dans cet ordre, à cet endroit précis. Spring Boot inverse ce sens : c'est le framework qui construit les objets (les **beans**) et qui te les *donne*, jamais l'inverse. C'est l'**inversion de contrôle** (IoC).

Regarde `StageController` : son constructeur demande un `StageService`, un `EntrepriseRepository`, etc. — mais nulle part dans le projet tu n'écris `new StageController(new StageService(...), ...)`. Spring construit `StageController` au démarrage, voit que son constructeur réclame ces types, les fabrique (ou les récupère s'ils existent déjà), et les lui **injecte**. C'est l'**injection de dépendances**, le mécanisme concret de l'IoC.

Les annotations sont les instructions que tu donnes à ce constructeur automatique :
- `@RestController` / `@Service` / `@Repository` : « fabrique une instance unique de cette classe, garde-la, donne-la à qui la demande ».
- `@Autowired` sur un constructeur est même devenu inutile ici : avec un seul constructeur (le cas de `StageController`, `AuthService`...), Spring l'utilise automatiquement pour injecter.
- Cas extrême : `StageRepository extends JpaRepository<Stage, Long>` n'est qu'une **interface**, sans implémentation écrite. Spring Data génère la classe réelle au démarrage, à partir du nom des méthodes (`findByEcole_IdEcole` devient une vraie requête SQL) — tu n'écris jamais ce code, tu déclares juste sa signature.

Le cycle requête → réponse, dans `StageController.findAll()` : une requête HTTP `GET /api/offres` arrive → Spring route vers la méthode annotée `@GetMapping("/api/offres")` → cette méthode appelle `stageService.findAll()` (bean injecté) → qui appelle `stageRepository.findAll()` (bean généré) → qui interroge PostgreSQL (maîtrisé) → les `Stage` remontent, sont convertis en DTO, puis sérialisés en JSON par `ResponseEntity.ok(...)`.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si tu retires le mot-clé `@Service` au-dessus de `class StageService` et relances `mvn spring-boot:run`, l'application démarre-t-elle normalement ?
- Prédiction 2 : le message d'erreur (s'il y en a un) parlera-t-il de `StageService` lui-même, ou d'un autre fichier ?

Fais le changement, relance le backend, lis l'erreur au démarrage (pas au moment d'un appel HTTP — avant même que ça arrive là), puis annule.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, écris de zéro une classe `@Service` nommée `TrucService` qui reçoit un `TrucRepository` par constructeur, et une classe `@RestController` qui l'injecte à son tour pour exposer un `@GetMapping("/api/trucs")`.
2. **Discrimination** : en JavaScript, `const s = new StageService(new StageRepository())` construit l'objet une fois, là où tu l'écris. Avec Spring, où et quand `StageService` est-il réellement construit — et combien d'instances existent-elles pendant que dix requêtes HTTP arrivent en même temps ?
3. **Piège** : pourquoi ne pas simplement faire `new StageService(new StageRepository())` directement dans `StageController`, comme tu ferais en JS, plutôt que laisser Spring s'en charger ? Qu'est-ce que l'IoC permet que le `new` manuel ne permet pas (pense à remplacer `StageRepository` par une version de test).
4. `StageRepository` est une interface sans implémentation écrite dans le projet. Explique à quelqu'un qui ne connaît pas Spring pourquoi `stageRepository.findByEcole_IdEcole(id)` ne plante pas au démarrage.

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
