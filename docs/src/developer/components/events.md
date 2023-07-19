# Évènements
Les évènements sont des fonctions qui sont appelées lorsqu'un évènement se produit sur un composant.

Ces derniers sont définis pour chaque type de composant, et sont appelés par le moteur de jeu lorsqu'un évènement se produit.
Voici la liste des évènements disponibles pour chaque type de composant:

## Button
| Nom        | Description                 |
| ---------- | --------------------------- |
| OnPressed  | Quand le bouton est pressé  |
| OnReleased | Quand le bouton est relaché |

## Switch
| Nom         | Description                    |
| ----------- | ------------------------------ |
| OnTurnedOn  | Quand le contacteur est allumé |
| OnTurnedOff | Quand le contacteur est éteind |

## Crank
| Nom            | Description                    |
| -------------- | ------------------------------ |
| OnAngleChanged | Quand la manivelle est tournée |

## Slider
| Nom | Description |
| --- | ----------- |
|     |             |

## Hinge
| Nom | Description |
| --- | ----------- |
| OnAngleChanged | Quand l'angle de la charnière a changé |

## Color
| Nom            | Description                           |
| -------------- | ------------------------------------- |
| OnColorChanged | Quand la couleur de la cible à changé |

## Sound
| Nom | Description |
| --- | ----------- |
|     |             |