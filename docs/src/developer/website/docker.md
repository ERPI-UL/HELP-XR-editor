# Docker

Pour simplifier la mise en place et le déploiement de l'application web, l'entièreté du site web d'Indico peut être lancé dans un conteneur dans sa version de production ou de développement grâce à [Docker](https://www.docker.com/).

## Prérequis

Pour pouvoir lancer le site web dans un conteneur Docker, il est nécessaire d'avoir [Docker](https://www.docker.com/) installé sur votre machine.

Enfin, certaines variables d'environnement sont à indiquer pour que le site web puisse fonctionner correctement:

- `VITE_API_URL`: L'URL de l'API Indico (Par défaut : `https://indico.apis.furwaz.fr`)

Ces variables d'environnement peuvent être indiquées dans un fichier `.env` à la racine du projet, ou alors modifiées dans les fichier `docker-compose.dev.yml` ou `docker-compose.prod.yml` pour les versions de développement ou productions respectivement.


## Lancer le site web

Pour lancer le site web dans un conteneur Docker en version de production, il suffit de lancer la commande suivante :

```bash
docker compose -f docker-compose.prod.yml up
```

!!! note "Note"
    Pour lancer le site web en version de développement, il suffit de remplacer `docker-compose.prod.yml` par `docker-compose.dev.yml`.

## Accéder au site web

Dans la version de production, par défaut le site web est ouvert sur le port 80 de la machine. Pour y accéder, il suffit donc d'ouvrir un navigateur et d'aller à l'adresse `http://localhost`.

Dans la version de développement, par défaut le site web est ouvert sur le port 81 de la machine. Il faut donc spécifier le port 81 dans l'url pour y accéder, à l'adresse `http://localhost:81`.
