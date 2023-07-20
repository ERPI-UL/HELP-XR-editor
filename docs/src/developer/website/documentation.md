# Documentation

L'entièreté de la documentation du projet HelpXR est écrite en [Markdown](https://fr.wikipedia.org/wiki/Markdown), et est générée en HTML grâce à [MkDocs](https://www.mkdocs.org/).

Les fichiers sources de la documentation peuvent être trouvés dans le dossier `/docs` du projet, avec le contenu de la documentation dans le dossier `docs/src/`.

## Lancer le serveur de développement

Pour lancer le serveur de développement de la documentation, il est nécessaire d'avoir [Python](https://www.python.org/) installé sur votre machine, ainsi que [pip](https://pypi.org/project/pip/) (automatiquement ajouté à l'installation de Python).

## Construire la documentation

Bien que la documentation du projet soit dans le site web, cette dernière est un module à part et doit donc être générée séparément du reste du site.

Pour construire la documentation, allez dans le dossier du projet (`/docs`) et lancez la commande suivante :

```bash
pip install -r requirements.txt
```
Pour installer toutes les dépendances du projet.

Une fois les dépendances installées, vous pouvez générer la documentation en lançant la commande suivante :

```bash
mkdocs build
```
Cela générera une version statique HTML de la documentation dans le dossier `/docs/site` du projet.

## Ajouter la documentation au site web

Pour ajouter la documentation au site web, il faut copier le dossier `/docs/site` dans le dossier `/public/` du site web et renommer ce dossier `site` en `doc`.
(Vous devriez donc avoir un dossier `/public/doc` avec les sources de la documentation à l'intérieur)

!!! bug "Attention"
    A cause de la configuration de Vite en mode développement, la navigation dans la documentation a partir du site web ne fonctionnera pas.
    Si vous voulez tester une version complète du site web et de sa documentation en local, veuillez vous référer à la partie [Docker](./docker.md) de la documentation.