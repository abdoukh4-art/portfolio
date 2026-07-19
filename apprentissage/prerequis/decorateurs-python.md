# Décorateurs Python — `@quelque_chose` au-dessus d'une fonction/classe

statut: [non testé]

## Épreuve-portier

1. `@lru_cache(maxsize=1)` au-dessus de `def _model(): ...` — s'exécute-t-il à chaque appel de `_model()`, ou une seule fois ?
2. `@dataclass` au-dessus de `class RunResult:` remplace quoi, que tu écrirais toi-même en Java pour une classe équivalente ?

*Réussi les deux → coche et continue. Raté → lis ci-dessous.*

## Explication (si ratée)

Un décorateur Python (`@nom` juste au-dessus d'une définition) est une fonction qui **enveloppe** la définition suivante et modifie son comportement sans toucher son code interne — le plus proche dans ton profil est une annotation Java (`@Service`) lue par un framework, sauf qu'ici c'est du Python pur, appliqué au chargement du fichier. `@lru_cache(maxsize=1)` mémorise le résultat du premier appel et le renvoie tel quel ensuite. `@dataclass` génère `__init__`/`__repr__`/égalité à partir des champs déclarés, comme un Lombok `@Data` en Java, mais natif au langage.
