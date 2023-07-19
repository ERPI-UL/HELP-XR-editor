# Méthodes
Tous les composants possèdent des méthodes permettant de les modifier.

Ces dernières sont définies pour chaque type de composant,
et peuvent être utilisés pour leurs assigner des propriétés par défaut ou les changer au cours de l'exécution de l'application.

Voici la liste des méthodes disponibles pour chaque type de composant, leurs paramètres et descriptions:

## Button
Aucune méthode disponible.

## Switch
### La méthode `SetStop`
Permet de définir l'angle de butée du contacteur.

- Script lua:
    ```lua
    _G[<tag>].interactable.SetStop(<Angle>)
    ```

- Paramètres de la méthode:

    | Nom   | Type   | Description                  |
    | ----- | ------ | ---------------------------- |
    | Angle | Number | Angle de butée du contacteur |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `SetState`
Permet de définir l'état du contacteur.

- Script lua:
    ```lua
    _G[<tag>].interactable.SetState(<Etat>)
    ```

- Paramètres de la méthode:

    | Nom  | Type    | Description              |
    | ---- | ------- | ------------------------ |
    | Etat | Boolean | Etat voulu du contacteur |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `GetState`
Permet de récupérer l'état du contacteur.

- Script lua:
    ```lua
    _G[<tag>].interactable.GetState()
    ```

- Paramètres de la méthode:
    - *Aucun paramètre*

- Retour de la méthode:
    - **Boolean** : Etat du contacteur

## Crank
### La méthode `SetAngle`
Permet de définir l'angle de la manivelle.

- Script lua:
    ```lua
    _G[<tag>].interactable.SetAngle(<Angle>)
    ```

- Paramètres de la méthode:

    | Nom   | Type   | Description                       |
    | ----- | ------ | --------------------------------- |
    | Angle | Number | Angle de la manivelle (en degrés) |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `SetMaxAngle`
Permet de définir l'angle maximum de la manivelle.

- Script lua:
    ```lua
    _G[<tag>].interactable.SetMaxAngle(<Angle>)
    ```

- Paramètres de la méthode:

    | Nom   | Type   | Description                               |
    | ----- | ------ | ----------------------------------------- |
    | Angle | Number | Angle maximum de la manivelle (en degrés) |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `SetMinAngle`
Permet de définir l'angle minimum de la manivelle.

- Script lua:
    ```lua
    _G[<tag>].interactable.SetMinAngle(<Angle>)
    ```

- Paramètres de la méthode:

    | Nom   | Type   | Description                               |
    | ----- | ------ | ----------------------------------------- |
    | Angle | Number | Angle minimum de la manivelle (en degrés) |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `GetAngle`
Permet de récupérer l'angle de la manivelle.

- Script lua:
    ```lua
    _G[<tag>].interactable.GetAngle()
    ```

- Paramètres de la méthode:
    - *Aucun paramètre*

- Retour de la méthode:
    - **Number** : Angle de la manivelle (en degrés)

## Slider
### La méthode `SetPos`
Permet de définir la position du curseur.

- Script lua:
    ```lua
    _G[<tag>].interactable.SetPos(<Position>)
    ```

- Paramètres de la méthode:

    | Nom      | Type   | Description                     |
    | -------- | ------ | ------------------------------- |
    | Position | Number | Position du curseur (en mètres) |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `StartMovement`
Permet de déplacer le curseur à sa vitesse définie.

- Script lua:
    ```lua
    _G[<tag>].interactable.StartMovement(<Direction>)
    ```

- Paramètres de la méthode:

    | Nom       | Type    | Description                     |
    | --------- | ------- | ------------------------------- |
    | Direction | Boolean | Direction du curseur (true=déplacement positif, false=déplacement négatif) |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `Stop`
Permet d'arrêter le déplacement du curseur.

- Script lua:
    ```lua
    _G[<tag>].interactable.Stop()
    ```

- Paramètres de la méthode:
    - *Aucun paramètre*

- Retour de la méthode:
    - *Aucun retour*

### La méthode `SetStop`
Permet de définir la butée du curseur.

- Script lua:
    ```lua
    _G[<tag>].interactable.SetStop(<Distance>)
    ```

- Paramètres de la méthode:

    | Nom      | Type   | Description                      |
    | -------- | ------ | -------------------------------- |
    | Distance | Number | Distance de la butée (en mètres) |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `SetSpeed`
Permet de définir la vitesse du curseur.

- Script lua:
    ```lua
    _G[<tag>].interactable.SetSpeed(<Speed>)
    ```

- Paramètres de la méthode:

    | Nom   | Type   | Description                                |
    | ----- | ------ | ------------------------------------------ |
    | Speed | Number | Vitesse du curseur (en mètres par seconde) |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `GetPos`
Permet de récupérer la position du curseur.

- Script lua:
    ```lua
    _G[<tag>].interactable.GetPos()
    ```

- Paramètres de la méthode:
    - *Aucun paramètre*

- Retour de la méthode:
    - **Number** : position du curseur (en mètres)

### La méthode `GetStop`
Permet de récupérer la distance de la butée du curseur.

- Script lua:
    ```lua
    _G[<tag>].interactable.GetStop()
    ```

- Paramètres de la méthode:
    - *Aucun paramètre*

- Retour de la méthode:
    - **Number** : distance de la butée du curseur (en mètres)

### La méthode `GetSpeed`
Permet de récupérer la vitesse du curseur.

- Script lua:
    ```lua
    _G[<tag>].interactable.GetSpeed()
    ```

- Paramètres de la méthode:
    - *Aucun paramètre*

- Retour de la méthode:
    - **Number** : vitesse du curseur (en mètres par seconde)

## Hinge
### La méthode `SetAngle`
Permet de définir l'angle de la charnière.

- Script lua:
    ```lua
    _G[<tag>].interactable.SetAngle(<Angle>)
    ```

- Paramètres de la méthode:

    | Nom   | Type   | Description                       |
    | ----- | ------ | --------------------------------- |
    | Angle | Number | Angle de la charnière (en degrés) |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `SetMaxAngle`
Permet de définir l'angle maximum de la charnière.

- Script lua:
    ```lua
    _G[<tag>].interactable.SetMaxAngle(<Angle>)
    ```

- Paramètres de la méthode:

    | Nom   | Type   | Description                               |
    | ----- | ------ | ----------------------------------------- |
    | Angle | Number | Angle maximum de la charnière (en degrés) |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `SetMinAngle`
Permet de définir l'angle minimum de la charnière.

- Script lua:
    ```lua
    _G[<tag>].interactable.SetMinAngle(<Angle>)
    ```

- Paramètres de la méthode:

    | Nom   | Type   | Description                               |
    | ----- | ------ | ----------------------------------------- |
    | Angle | Number | Angle minimum de la charnière (en degrés) |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `UseGravity`
Permet de définir si la charnière est soumise à la gravité.

- Script lua:
    ```lua
    _G[<tag>].interactable.UseGravity(<State>)
    ```

- Paramètres de la méthode:

    | Nom   | Type    | Description                                      |
    | ----- | ------- | ------------------------------------------------ |
    | State | Boolean | Est-ce que la gravité doit être appliquée ou non |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `GetAngle`
Permet de récupérer l'angle de la charnière.

- Script lua:
    ```lua
    _G[<tag>].interactable.GetAngle()
    ```

- Paramètres de la méthode:
    - *Aucun paramètre*

- Retour de la méthode:
    - **Number** : Angle de la charnière (en degrés)

## Color
### La méthode `SetColor`
Permet de définir la couleur de la cible du composant.

- Script lua:
    ```lua
    _G[<tag>].interactable.SetColor(<Color>)
    ```

- Paramètres de la méthode:

    | Nom   | Type  | Description                             |
    | ----- | ----- | --------------------------------------- |
    | Color | Color | Couleur de la cible du composant voulue |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `GetColor`
Permet de récupérer la couleur de la cible du composant.

- Script lua:
    ```lua
    _G[<tag>].interactable.GetColor()
    ```

- Paramètres de la méthode:
    - *Aucun paramètre*

- Retour de la méthode:
    - **Color** : Couleur de la cible du composant

## Sound
### La méthode `SetSoundId`
Permet de définir l'identifiant du son à jouer.

- Script lua:
    ```lua
    _G[<tag>].interactable.SetSoundId(<Id>)
    ```

- Paramètres de la méthode:

    | Nom | Type   | Description                |
    | --- | ------ | -------------------------- |
    | Id  | Number | Identifiant du son à jouer |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `SetPlaying`
Permet de jouer ou arrêter le son d'une cible.

- Script lua:
    ```lua
    _G[<tag>].interactable.SetPlaying(<State>)
    ```

- Paramètres de la méthode:

    | Nom   | Type    | Description                            |
    | ----- | ------- | -------------------------------------- |
    | State | Boolean | Est-ce que le son devrait jouer ou non |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `SetLooping`
Permet de définir si un son devrait être joué en boucle ou non.

- Script lua:
    ```lua
    _G[<tag>].interactable.SetLooping(<State>)
    ```

- Paramètres de la méthode:

    | Nom   | Type    | Description                                          |
    | ----- | ------- | ---------------------------------------------------- |
    | State | Boolean | Est-ce que le son devrait être joué en boucle ou non |

- Retour de la méthode:
    - *Aucun retour*

### La méthode `GetPlaying`
Permet de récupérer si le son est actuellement joué ou non.

- Script lua:
    ```lua
    _G[<tag>].interactable.GetPlaying()
    ```

- Paramètres de la méthode:
    - *Aucun paramètre*

- Retour de la méthode:
    - **Boolean** : Est-ce que le son est joué ou non

### La méthode `GetLooping`
Permet de récupérer si le son est joué en boucle ou non.

- Script lua:
    ```lua
    _G[<tag>].interactable.GetLooping()
    ```

- Paramètres de la méthode:
    - *Aucun paramètre*

- Retour de la méthode:
    - **Boolean** : Est-ce que le son est joué en boucle ou non
