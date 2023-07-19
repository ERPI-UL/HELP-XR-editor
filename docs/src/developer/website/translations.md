# Le système de traduction
L'entièreté du site est traduisible dans différentes langues.
Et pour ce faire, nous avons mis en place un système de traduction basé sur des fichiers clés-valeurs, un pour chaque langue.

## Fichiers source
Tous les fichiers sources utilisés pour mettre en place le système de traduction sont répertoriés dans ce dossier:
```js
src
|- langs      // Dossier contenant les fichiers de traduction
   |- en.json // Fichier de traduction en anglais
   |- fr.json // Fichier de traduction en français
   |- ...
|- script
    |- Lang.js // Gestion du système de traduction
    ```
```

## Ajouter une traduction
De nouvelles langues peuvent être facilement ajoutés au site web, en suivant les étapes suivantes:

- Créer un nouveau fichier de traduction dans le dossier `src/langs` avec le nom de la langue (ex: `fr.js` pour le français)
- Ajouter les traductions dans ce fichier, en respectant la syntaxe suivante:
```js
export default {
    MOT_CLE: "Traduction",
};
```
Vous pouvez copier-coller le contenu d'un autre fichier de traduction pour gagner du temps.

- Ajouter le nom de la langue dans la classe `Langs` du fichier `src/script/Lang.js` en respectant la syntaxe suivante:
```js
import [nouvelleLangue] from "../langs/[nouvelleLangue].js";

class Langs {
    static Langs = [
        {label: "English", value: "en", data: en},
        {label: "Français", value: "fr", data: fr},
        {label: "[LabelLangue]", value: "[CodeLangue]", data: [nouvelleLangue]},
    ];
}
```
Le reste du site web s'adaptera ainsi automatiquement à cete nouvelle langue si elle est sélectionnée.

## Traduction des pages
Les pages du site web sont traduites en fonction de la langue sélectionnée. Pour ajouter le système de traduction à une nouvelle page, il suffit de suivre les étapes suivantes:

- Importer le système de traduction dans la logique la page:
```js
import Lang from "[chemin]/Langs.js";
```

- Ajouter la langue courante dans les informations de la page:
```js
data() {
    return { lang: Lang.CurrentLang };
},
```

- Assigner la traduction d'un texte à l'élément de la page voulu en indiquant sa clé:
```html
<p> {{ lang.MOT_CLE }} </p>
```

### Optionnel
Pour profiter d'une mise à jour automatique de la page en cas de changement de langue, vous pouvez écouter les changements de langue et mettre à jour la page en conséquence:
```js
mounted() {
    Lang.AddCallback(lang => this.lang = lang);
}
```

## Gestion des langues
Le système de traduction permet à n'importe quel script de modifier la langue courante, ainsi que récupérer les langues disponibles et la langue courante.

- Pour récupérer les données de traduction la langue courante, il suffit de consulter la variable `Lang.CurrentLang`:
```js
const traductions = Lang.CurrentLang;
const trad = traductions.MOT_CLE;
/*
[traductions] est maintenant un objet contenant toutes les traductions de la langue courante sous le format: MOT_CLE: "Traduction".
[trad] est maintenant la chaine de caractères correspondant à la traduction du mot clé "MOT_CLE" dans la langue courante.
*/
```

- Pour récupérer la liste des langues disponibles, il suffit d'utiliser la variable `Lang.Langs`:
```js
const langues = Lang.Langs;
/*
[langues] est maintenant une liste d'objets contenant les informations de chaque langue disponible sous le format:
    {label: "[NomDeLaLangue]", value: "[CodeDeLaLangue]", data: [DonneesDeTraduction]},.
*/
```

- Pour modifier la langue courante, il suffit d'utiliser la méthode `LoadLang(code)` de la classe `Lang`:
```js
button.addEventListener("click", () => {
    const success = Lang.LoadLang("fr");
});
/*
Au clic du bouton, la langue courante sera changée pour le français et toutes les traductions des pages écoutant les évenements de la classe Lang seront mises à jour.
[success] est maintenant un booléen avec la valeur true si le changement de langue a réussi, false sinon.
*/
```
