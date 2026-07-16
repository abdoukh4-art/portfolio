# TypeScript — le typage ajouté à ton JavaScript

## Avant de lire — Reconnaître (à froid)

1. En Java (Spring Boot), si tu écris `String nom = utilisateur.getNom();` mais que `getNom()` renvoie en fait un `int`, à quel moment le problème est détecté : à la compilation, ou seulement quand le code tourne ?
2. En JavaScript pur, si tu écris `user.role` alors que l'objet `user` n'a en réalité pas de champ `role` (faute de frappe : `roles`), que se passe-t-il au moment de l'exécution ?
3. Ouvre `frontend/src/app/types.ts` — `export type UserRole = 'ETUDIANT' | 'ENTREPRISE' | 'ENCADRANT' | 'ADMIN' | 'SUPER_ADMIN';`. À ton avis, qu'est-ce que ça empêche d'écrire ailleurs dans le code ?

## Explication ancrée

En Java, tu bénéficies d'un filet de sécurité que tu ne remarques même plus : chaque variable, chaque champ de DTO a un type déclaré, et le compilateur refuse le programme si tu te trompes (mastered, JPA/Hibernate). En JavaScript pur (mastered), ce filet n'existe pas : un objet peut avoir n'importe quelle forme, et une faute de frappe sur un nom de champ (`user.rol` au lieu de `user.role`) ne plante qu'à l'exécution — souvent bien après, loin de l'endroit fauté. **TypeScript ajoute à JavaScript exactement ce que Java a toujours eu nativement : la vérification de types avant l'exécution.** Il se compile ensuite vers du JavaScript normal — le navigateur ne connaît que le second.

Le projet SGS type ses données à deux niveaux, visibles dans `frontend/src/app/types.ts` :

```ts
export type UserRole = 'ETUDIANT' | 'ENTREPRISE' | 'ENCADRANT' | 'ADMIN' | 'SUPER_ADMIN';

export interface Student extends User {
  role: 'ETUDIANT';
  cne: string;
  level: StudentLevel;
}
```

`type UserRole = 'A' | 'B' | ...` est une **union de littéraux** : la variable ne peut valoir *que* l'une de ces chaînes exactes — l'équivalent structurel d'un `enum` Java, mais vérifié uniquement par le compilateur (aucune trace au runtime). `interface Student extends User` type la *forme* d'un objet — pas une classe qui existe à l'exécution comme en Java, juste un contrat que le compilateur efface après vérification.

Autre exemple, dans `AuthContext.tsx` : `const [user, setUser] = useState<AuthUser | null>(null);` — `useState<...>` est un **générique** : tu précises quel type de donnée cet état va contenir, et TypeScript refuse ensuite d'y stocker autre chose qu'un `AuthUser` ou `null`.

## À exécuter — Casser

Avant de lancer, prédis :
- Prédiction 1 : dans `frontend/src/context/AuthContext.tsx`, si tu changes temporairement `role: UserRole` en `role: 'ETUDIANT'` dans l'interface `AuthUser`, que va dire l'éditeur/le build quand `PrivateRoute.tsx` compare `user.role` à `allowedRoles` (qui contient `'ADMIN'`, `'ENCADRANT'`, etc.) ?
- Prédiction 2 : est-ce que ça empêche l'application de démarrer avec `npm run dev`, ou seulement `npm run build` ?

Fais le changement dans le fichier, observe l'erreur TypeScript (dans l'éditeur puis via `npm run build` dans `frontend/`), puis annule.

## Épreuve — Défendre

1. **Reconstruction** : sans regarder le code, écris de zéro une `interface AuthUser` avec `id: string`, `role: UserRole`, `token: string`, sachant que `UserRole` est une union de 5 chaînes littérales.
2. **Discrimination** : en Java, `class Student extends User` crée une hiérarchie qui existe encore à l'exécution (`instanceof` fonctionne, la JVM connaît la classe réelle de l'objet). En TypeScript, `interface Student extends User` — que devient cette information une fois le code compilé en JavaScript, et qu'est-ce que ça change concrètement pour un `instanceof` ?
3. **Piège** : pourquoi ne pas simplement documenter les formes attendues avec des commentaires JSDoc en JavaScript pur, plutôt qu'ajouter tout un compilateur (TypeScript) au projet ?
4. Le `tsconfig.json` du frontend a `"strict": true` et `"noUnusedLocals": true`. Que perdrait le projet si ces options passaient à `false` ?

## Journal

`[date] concept | où ça a cassé | quelle question m'a eu`
