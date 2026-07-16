# Le pattern Context — i18n EN/FR

## Avant de lire — Reconnaître (à froid)

1. En React (SGS), si un composant profondément imbriqué a besoin d'une donnée détenue par un composant très au-dessus, comment fais-tu passer cette donnée aujourd'hui ?
2. Regarde `components/language.tsx` : `createContext`, `Provider`, `useContext` apparaissent. As-tu déjà utilisé ces trois-là ensemble dans SGS ?
3. Dans `components/site.tsx`, chaque section (`Nav`, `Hero`, `Projects`...) appelle `const { t } = useLanguage();`. Aucune de ces sections ne reçoit `t` en prop depuis un parent. Comment est-ce possible ?

## Explication ancrée

Dans SGS, tu connais bien le passage de données par **props** : un parent détient une donnée, la transmet explicitement à son enfant via un attribut JSX, qui la retransmet à son propre enfant si besoin — c'est le seul mécanisme que tu as pratiqué jusqu'ici. Le problème : si la donnée est nécessaire à 6 niveaux de profondeur, il faut la faire traverser 6 composants intermédiaires qui n'en ont eux-mêmes aucun usage (le "prop drilling").

Le **Context** est le mécanisme React qui contourne ce problème — un pattern que tu n'as pas encore pratiqué. Trois pièces, visibles dans `components/language.tsx` :

```tsx
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  // ... persistance dans localStorage ...
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: content[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
```

`createContext` crée un "tuyau" global (par défaut vide, `null`). `LanguageProvider` détient l'état réel (`useState<Lang>`) et l'injecte dans ce tuyau via `.Provider value={...}`, en enveloppant tout le site (`components/site.tsx`, fonction `Site`, enveloppe `<Nav/>`, `<main>`, `<Footer/>` dans `<LanguageProvider>`). N'importe quel composant **descendant**, peu importe sa profondeur, peut ensuite piocher dans ce tuyau avec `useContext(LanguageContext)` — sans qu'aucun ancêtre intermédiaire ait besoin de connaître ou retransmettre `lang`.

`useLanguage()` est un **hook personnalisé** : il enveloppe `useContext` et ajoute une vérification — si le composant qui l'appelle n'est pas descendant d'un `LanguageProvider`, `ctx` vaut `null` et il lève une erreur explicite plutôt que de planter silencieusement plus loin. C'est ce hook, pas `useContext` directement, que `Nav`, `Hero`, etc. appellent.

La persistance (`localStorage`) est un détail annexe : deux `useEffect` synchronisent l'état React avec le stockage du navigateur — un à l'ouverture (lire la valeur sauvegardée), un à chaque changement de `lang` (la réécrire, et mettre à jour l'attribut `lang` du HTML pour l'accessibilité).

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : si tu déplaces temporairement `<LanguageToggle />` en dehors de `<LanguageProvider>` dans `components/site.tsx` (fonction `Site`), que va-t-il se passer au chargement de la page ?
- Prédiction 2 : le message d'erreur affiché sera-t-il générique (crash React classique) ou le message précis que tu as vu dans `useLanguage()` ?

Fais le changement, observe le résultat dans le navigateur (et la console), puis annule.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder le code, écris de zéro le squelette minimal d'un Context React : `createContext`, un composant `Provider` avec un `useState`, un hook personnalisé `useX` qui vérifie que le contexte n'est pas `null`.
2. **Discrimination** : `ProjectCard` (dans `components/site.tsx`) reçoit `project` et `learnedLabel` en **props** classiques depuis `Projects`. `lang`/`t` passent par **Context**. Qu'est-ce qui, structurellement, justifie ce choix différent pour ces deux données ?
3. **Piège** : pourquoi ne pas simplement stocker `lang` dans une variable globale JS (`let currentLang = "en"`) partagée entre fichiers, plutôt que tout ce mécanisme Context/Provider/hook ? Que perdrais-tu concrètement ?
4. Si demain tu ajoutais un thème clair/sombre en plus de la langue, réutiliserais-tu le même `LanguageContext`, ou en créerais-tu un second ? Justifie.

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
