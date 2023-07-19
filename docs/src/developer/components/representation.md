# Représentation
Un composant est représenté par un objet JSON qui contient plusieurs attributs.
Voici par exemple un composant de type *Switch*:
```json
{
    "id": 13,
    "tag": "Nouveau composant",
    "type": "Switch",
    "target": 55,
    "script": "function Start()\n    _G[\"Nouveau composant\"].interactable.SetAngle(25)\n    _G[\"Nouveau composant\"].interactable.SetState(true)\nend\n",
    "blocks": "{}",
    "properties": [
        {
            "name": "angle",
            "value": "25"
        },
        {
            "name": "default_on",
            "value": "True"
        }
    ]
}
```

Un type de composant est aussi représenté par un objet JSON.
Voici par exemple la définition du type *Switch*:
```json
{
    "name": "Switch",
    "display": "SWITCH",
    "icon": "",
    "tooltip": "SWITCH_TOOLTIP",
    "properties": [
        {
            "name": "angle",
            "display": "ANGLE",
            "tooltip": "ANGLE_TOOLTIP",
            "type": "number",
            "default": 25,
            "method": "SetAngle"
        },
        {
            "name": "default_on",
            "display": "DEFAULT_ON",
            "tooltip": "DEFAULT_ON_TOOLTIP",
            "type": "checkbox",
            "default": false,
            "method": "SetState"
        }
    ],
    "events": [
        {
            "name": "OnTurnedOn",
            "display": "WHEN_TURNED_ON",
            "tooltip": "WHEN_TURNED_ON_TOOLTIP",
            "params": []
        },
        {
            "name": "OnTurnedOff",
            "display": "WHEN_TURNED_OFF",
            "tooltip": "WHEN_TURNED_OFF_TOOLTIP",
            "params": []
        }
    ]
}
```
