# Propriétés
Certains composants ont des propriétés qui peuvent être modifiées.

Ces dernières sont définies pour chaque type de composant,
ce sont des méthodes de ce type composant qui seront appelées à la création du composant pour donner des valeurs par défaut à certains attributs.

L'initialisation de ces propriétés se font dans la fonction `Start` du script lua du composant.
Pour plus d'informations sur le script d'un composant, regardez la section [Scripts](./scripts.md).

Voici la liste des propriétés disponibles pour chaque type de composant, et les méthodes qui sont appelées pour les modifier:

## Button
| Nom | Méthode | Description |
| --- | ------- | ----------- |
|     |         |             |

## Switch
| Nom   | Méthode  | Description                                              |
| ----- | -------- | -------------------------------------------------------- |
| Angle | SetAngle | Angle de rotation du contacteur à l'allumage (en degrés) |

## Crank
| Nom      | Méthode     | Description                                              |
| -------- | ----------- | -------------------------------------------------------- |
| MinAngle | SetMinAngle | Angle minimum de la manivelle (en degrés)                |
| MaxAngle | SetMaxAngle | Angle maximum de la manivelle (en degrés)                |
| Angle    | SetAngle    | Angle par défaut de la manivelle                         |
| Target   | SetTarget   | Cible de la manivelle (objet à attraper pour la tourner) |

## Slider
| Nom             | Méthode            | Description                                                            |
| --------------- | ------------------ | ---------------------------------------------------------------------- |
| MaxDisplacement | SetMaxDisplacement | Déplacement maximum de l'axe de translation (en mètres)                |
| Speed           | SetSpeed           | Vitesse de déplacement de l'axe de translation (en mètres par seconde) |

## Hinge
| Nom        | Méthode     | Description                                                              |
| ---------- | ----------- | ------------------------------------------------------------------------ |
| MinAngle   | SetMinAngle | Angle de rotation minimum de la charnière (en degrés)                    |
| MaxAngle   | SetMaxAngle | Angle de rotation maximum de la charnière (en degrés)                    |
| Angle      | SetAngle    | Angle par défaut de la charnière (en degrés)                             |
| Target     | SetTarget   | Cible de la charnière (objet à attraper pour faire tourner la charnière) |
| UseGravity | UseGravity  | Est-ce que la charnière devrait être soumise à la gravité                |

## Color
| Nom   | Méthode  | Description                                          |
| ----- | -------- | ---------------------------------------------------- |
| Color | SetColor | Couleur par défaut de la cible (valeur hexadécimale) |

## Sound
| Nom   | Méthode    | Description                              |
| ----- | ---------- | ---------------------------------------- |
| Sound | SetSoundId | Id de la ressource son à jouer           |
| Loop  | SetLooping | Est-ce que le son devrait boucler ou non |