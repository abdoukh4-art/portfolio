# JSX — la syntaxe qui mélange HTML et JavaScript

statut: [non testé]

## Épreuve-portier

1. Dans `<div className="card">{user.name}</div>`, à quoi servent les accolades `{}` — et pourquoi `className` plutôt que `class` ?
2. `<Outlet />` (SGS, `Layout.tsx`) ressemble à une vraie balise HTML. L'est-elle ? Que devient-elle une fois compilée ?

*Réussi les deux → coche et continue. Raté → lis ci-dessous.*

## Explication (si ratée)

JSX n'est pas du HTML : c'est du sucre syntaxique compilé (par Vite/Next.js) en appels JS purs — `<div className="card">{x}</div>` devient un appel de fonction type `createElement('div', {className:'card'}, x)`. Les accolades marquent un retour au JS *dans* le balisage : `{user.name}` insère une valeur, `{cond && <p/>}` insère du JSX si `cond` est vrai. `className`/`onClick` (pas `class`/`onclick`) sont des conventions JSX, pas du HTML réel. Déjà manipulé partout dans SGS (`OfferCard`, `PrivateRoute`) et ce portfolio (`site.tsx`) sans jamais s'y arrêter.
