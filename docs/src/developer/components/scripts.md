# Scripts
Chaque composant contient une section `script` très importante.

Elle sert non seulement à définir les actions à réaliser au déclenchement des différents évènements,
mais aussi à définir les valeurs des propriétés du composant.

Cette section est le script lua qui sera exécuté par le moteur de jeu, et contient deux parties principales:

- La fonction `Start()` qui est exécutée à la création du composant dans l'application et permet de définir les valeurs initiales des propriétés du composant.
- Les fonctions `On<event>()` qui sont exécutées lors du déclenchement des évènements du composant et contiennent le code à exécuter pour ces évènements.

Ces scripts sont constitués d'appels de méthodes, créés à partir des blocs assemblés par l'utilisateurs (voir section [Blockly](../website/blockly.md)).

Voici un exemple de script pour un composant **Crank** (manivelle) nommé `Crank1`, avec un autre curseur `Slider1`.

Le script généré initialise une manivelle `Crank1` qui peut aller de -360° à +360°, par défaut à 45°.
Et la rotation de cette manivelle déplace le curseur `Slider1` de 10 centimètre par degré de rotation:

```lua
_G["Crank1"].events.Start = function()
    _G["Crank1"].interactable.SetAngle(45)
    _G["Crank1"].interactable.SetMinAngle(-360)
    _G["Crank1"].interactable.SetMaxAngle(360)
end

_G["Crank1"].events.OnAngleChanged = function()
    _G["Slider1"].interactable.SetPos(
        _G["Crank1"].interactable.GetAngle() * 0.1
    )
end
```