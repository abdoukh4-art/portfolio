# La couche provider LLM — une interface sans héritage (Protocol)

## Prérequis

> Pour chaque prérequis [non testé] : passe son épreuve-portier d'abord. Réussie → coche et continue. Ratée → lis la fiche, comble, repasse l'épreuve. Ne lis jamais avant d'avoir tenté.

- [variables-environnement](/learn/prerequis#variables-environnement) — statut: [non testé]

## Avant de lire — Reconnaître (à froid)

1. En Spring Boot (SGS), tu as déjà défini une interface (Repository, Service) avec plusieurs implémentations, et laissé Spring choisir laquelle injecter. Qu'est-ce qui, côté classe, doit être écrit explicitement pour que Java accepte qu'une classe « implémente » cette interface ?
2. Dans `providers/base.py`, `LLMProvider` hérite de `Protocol`, pas de `ABC`. Ni `AnthropicProvider` ni `OllamaProvider` n'écrivent `class AnthropicProvider(LLMProvider):`. Comment Python peut-il alors savoir qu'une classe « respecte » cette interface ?
3. `get_provider()` (`providers/__init__.py`) ne lit qu'une chaîne (`config.PROVIDER`, une variable d'environnement). Où, dans `planner.py` ou `analyst.py`, ces agents savent-ils s'ils parlent à Claude ou à Ollama ?

## Explication ancrée

En Spring Boot, une interface + plusieurs `@Service` qui l'implémentent (avec `implements`) laissent le conteneur Spring injecter la bonne classe — mais Java **vérifie à la compilation** que chaque implémentation fournit bien toutes les méthodes déclarées. Consilio a besoin du même découplage (le code des agents ne doit jamais savoir s'il parle à Claude ou à un modèle local), mais Python n'a pas de compilateur qui vérifie les interfaces.

`providers/base.py` définit `LLMProvider(Protocol)` : une méthode, `complete(system, user, max_tokens) -> LLMResponse`. Un `Protocol` (module `typing`) décrit une **forme** attendue, pas une classe à hériter — c'est du *duck typing* formalisé : « si ça a une méthode `complete()` avec cette signature, ça compte comme un `LLMProvider` », sans jamais écrire `implements` ni `extends`.

`AnthropicProvider.complete()` et `OllamaProvider.complete()` ont la même signature mais des internes radicalement différents — l'un parcourt les blocs de contenu du SDK `anthropic`, l'autre fait un `requests.post()` brut et parse du JSON. Les deux **normalisent** leur résultat vers le même `LLMResponse` (dataclass avec `text`, `input_tokens`, `output_tokens`, `model`) : c'est ce type de retour commun, pas une classe parente commune, qui rend le reste du code (agents, orchestrateur) indifférent au fournisseur réel.

Le seul endroit où le choix se fait est `get_provider()` :

```python
if config.PROVIDER == "anthropic":
    from consilio.providers.anthropic_provider import AnthropicProvider
    return AnthropicProvider()
if config.PROVIDER == "ollama":
    from consilio.providers.ollama_provider import OllamaProvider
    return OllamaProvider()
```

C'est le pattern **Strategy** : changer d'algorithme (quel LLM appeler) sans toucher au code appelant, ici piloté par la variable d'env `CONSILIO_PROVIDER` (ADR 0001).

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si tu renommes temporairement la méthode `complete` en `complete2` dans `ollama_provider.py`, l'erreur apparaîtra-t-elle à l'import du module, à l'appel de `get_provider()`, ou seulement quand `.complete(...)` est effectivement invoquée ?
- Prédiction 2 : le message d'erreur ressemblera-t-il à une erreur Java de compilation (« ne respecte pas l'interface ») ou à autre chose ?

Fais le changement, lance `PYTHONPATH=src .venv/bin/python -c "from consilio.providers import get_provider; get_provider().complete('a','b',10)"` (avec `CONSILIO_PROVIDER=ollama`), observe l'erreur exacte, puis annule.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder, écris de zéro le squelette d'un `Protocol` avec une méthode, et deux classes qui le « satisfont » sans déclarer d'héritage explicite.
2. **Discrimination** : en Spring, si une classe `implements MonInterface` oublie une méthode, tu le découvres **à la compilation**. Avec `Protocol` (sans `@runtime_checkable`), à quel moment exact découvres-tu qu'une implémentation est incomplète ? Que perd-on, que gagne-t-on ?
3. **Piège** : pourquoi ne pas avoir utilisé une classe abstraite (`ABC` + `@abstractmethod`), plus courante en Python, plutôt qu'un `Protocol` ? Qu'est-ce que `ABC` aurait forcé à écrire dans `anthropic_provider.py` et `ollama_provider.py` que `Protocol` ne force pas ?
4. Si demain tu ajoutais un troisième provider (ex. OpenAI), combien de fichiers exactement devrais-tu modifier en dehors de `providers/` ? Justifie avec les noms de fichiers.

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
