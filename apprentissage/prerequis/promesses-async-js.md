# Promesses et async/await en JS

statut: [non testé]

## Épreuve-portier

1. `fetch(url).then(res => res.json())` — le code juste après cette ligne s'exécute-t-il avant ou après que la réponse réseau arrive ?
2. Une fonction `async function f() {...}` renvoie-t-elle directement sa valeur, ou toujours une Promise ?

*Réussi les deux → coche et continue. Raté → lis ci-dessous.*

## Explication (si ratée)

JS est mono-thread : une opération lente (réseau, minuteur) ne doit jamais bloquer la page — elle est lancée puis **le code continue immédiatement** sans attendre. Une **Promise** représente « un résultat qui arrivera plus tard » ; `.then(cb)` enregistre ce qu'il faut faire une fois prêt. `async`/`await` réécrit la même mécanique plus lisiblement : `await promise` met en pause *seulement cette fonction* jusqu'au résultat, et une fonction `async` renvoie toujours une Promise, jamais la valeur brute. Les intercepteurs axios (SGS) et tout appel `fetch` reposent là-dessus, silencieusement.
