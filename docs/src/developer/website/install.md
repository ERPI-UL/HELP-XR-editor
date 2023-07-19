# Installation
## Cloner le projet

Le projet étant hébergé sur GitLab, il est nécessaire d'avoir un compte GitLab à l'Université de Lorraine pour pouvoir le récupérer.

Si vous en possédez un, vous pouvez cloner le projet se situant à l'adresse `https://gitlab.univ-lorraine.fr/labos/erpi/indico/indico-web` en utilisant la commande suivante :

```bash
git clone https://gitlab.univ-lorraine.fr/labos/erpi/indico/indico-web
```

## Installer le projet

Pour installer le projet, il est nécessaire d'avoir [Node.js](https://nodejs.org/en/) ainsi que [npm](https://www.npmjs.com/) (automatiquement ajouté à l'installation de Node.js) installés sur votre machine.
Ces outils vous permettront d'installer les dépendances du projet et lancer le serveur de développement.

Une fois Node.js et npm installés, rendez-vous dans le dossier du projet et lancez la commande suivante :

```bash
npm install
```
Pour installer toutes les dépendances du projet.

## Lancer le serveur de développement

Le projet du site web utilise l'outil [Vite](https://vitejs.dev/) pour lancer un serveur de développement.
Pour simplifier le lancement du serveur, un script a été ajouté dans le fichier `package.json` du projet, vous permettant de simplement écrire :
    
```bash
npm run dev
```
Pour démarrer le serveur de développement, qui écoutera sur le port 80 de votre machine.
Le site web sera donc disponible à l'adresse `http://localhost:80` (ou `http://localhost` en raccourci).

## Construire le projet

La construction du site web est entièrement prise en charge par Vite, et est donc très simple à effectuer.
De plus, un script a été ajouté dans le fichier `package.json` du projet pour cette fonction, il peut être appelé avec la commande :

```bash
npm run build
```
le site web sera alors construit dans le dossier `dist` du projet, dans une version minimisée et optimisée pour la production.

!!! note
    La documentation du projet ne sera pas générée avec le reste du site web si ce dernier est construit manuellement (à partir de la commande).
    Pour générer la documentation, veuillez vous référer à la partie [Documentation](./documentation.md).
