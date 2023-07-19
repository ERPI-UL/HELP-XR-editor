# Blockly
L'entièreté de la logique associée au composants d'un artéfact est créée par l'utilisateur.

De manière à rendre la programmation de ces composants plus facile et rapide,
nous avons optés pour un système de programmation par blocs à l'aide de la librairie [Blockly](https://developers.google.com/blockly).

## Fichiers source
Tous les fichiers sources utilisés pour mettre en place l'environnement de programmation par blocs sont répertoriés dans ces dossiers:
```js
src                         
|- components
   |- artifacts
      |- BlockEditor.vue  // Composant Vue.JS de l'éditeur de blocs
|- script
   |- artifacts
      |- BlocklyEditor.js // Initialisation de l'éditeur de blocs
      |- BlocklyBlocks.js // Récupération et ajout des blocs personnalisés
      |- components.js    // Liste des composants et de leurs propriétés
      |- toolbox.js       // Boite à outils de l'éditeur de blocs
      |- blocks           // Blocs personnalisés des différents composants
         |- ...
```

## Ajouter des blocs
Pour ajouter des blocs personnalisés à l'éditeur de blocs,
il faut les définir dans les fichiers du dossier `src\script\artifacts\blocks`.
La déclaration d'un nouveau bloc suit la syntaxe suivante:
```js
{
    category: "...",      // Catégorie du bloc (voir src\script\artifacts\toolbox.js)
    block: { ... },         // Déclaration du bloc (voir la section [Bloc personnalisé])
    lua: function (block) { // Déclaration du script (voir la section [Scripting Lua])
        ...
    }
}
```

### Bloc personnalisé
Ces blocs sont définis à l'aide de la [syntaxe JSON de Blockly](https://developers.google.com/blockly/guides/create-custom-blocks/block-factory),
en voici un exemple:
```json
{
    "type": "function_slider_setPos",
    "message0": "Mettre le slider %1 à %2 mètres",
    "args0": [
        {
            "type": "input_value",
            "name": "slider",
            "check": "Slider"
        },
        {
            "type": "field_number",
            "name": "pos",
            "value": 0
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 15,
    "tooltip": "",
    "helpUrl": ""
}
```

De manière à simplifier et unifier les types d'entrées et sorties des blocks,
nous avons définis des types personnalisés disponibles dans le fichier `src\script\artifacts\blocks\Types.js`.

Pour permettre la traduction des blocs dans différentes langues,
nous utilisons aussi le [système de traduction du site]() pour récupérer le message du block.
Ainsi, la clé `message0` du bloc créé ne devrait pas être `"Mettre le slider %1 à %2 mètres"`, mais par exemple `Lang.CurrentLang.SLIDER_METHOD_SETPOS`.

### Scripting Lua
Chaque déclaration de bloc contient une section `lua`. Cette section permet la génération du code Lua associé au bloc.

Pour en savoir plus sur le langage Lua, vous pouvez consulter [la documentation officielle](https://www.lua.org/docs.html).

Pour savoir comment est généré le lua à partir des blocs, vous pouvez consulter la documentation de [Blockly](https://developers.google.com/blockly/guides/create-custom-blocks/generating-code).

Un exemple de fonction pour générer le code Lua associé à un bloc pourrait être:
```js
function (block) {
    var el = luaGenerator.valueToCode(block, 'el', luaGenerator.ORDER_NONE);
    var color = luaGenerator.valueToCode(block, 'color', luaGenerator.ORDER_NONE);
    return `_G["${el}"].interactable.SetColor(${color})\n`;
}
```