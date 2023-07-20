# Informations

Le code source de l'API est disponible [ici](https://gitlab.univ-lorraine.fr/labos/erpi/HelpXR/HelpXR-api/-/tree/v2/api) sur le GitLab de l'Université de Lorraine.

L'API de HelpXR est au format REST. Elle est accessible uniquement via HTTPS et WebSockets.

## Principales technologies utilisées

- [FastAPI](https://fastapi.tiangolo.com/)
- [Python 3.10](https://www.python.org/)
- [Tortoise ORM](https://tortoise.github.io/)
- [PostgreSQL 14.7](https://www.postgresql.org/)
- [Python Socket.IO](https://python-socketio.readthedocs.io/en/latest/)

Les dépendances ainsi que les versions sont disponibles dans le fichier `requirements.txt`.

Certaines fonctinoalités de l'API utilisent des WebSockets, qui sont gérés par [Socket.IO](https://socket.io/) ce qui implique certaines configurations supplémentaires sur le serveur.
``` nginx title="Configuration reverse proxy Nginx" linenums="1" hl_lines="7-12"
server {

    server_name HelpXR-api.lf2l.fr;

    location ~ /* {
        proxy_pass http://localhost:5000; 
        client_max_body_size 20M;
        proxy_set_header Upgrade $http_upgrade; # (1)!
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/HelpXR-api.lf2l.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/HelpXR-api.lf2l.fr/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
```

1.  :man_raising_hand: Ceci est nécessaire pour que les WebSockets fonctionnent correctement derrière un reverse proxy.

## Hiérarchie des fichiers

<!-- dessine la hiérachie des fichiers -->
```bash
.
├── api                                         # Code source de l'API
│   ├── app
│   │   ├── controllers
│   │   │   ├── __init__.py
│   │   │   ├── statement.py
│   │   ├── models                              # Modèles de Tortoise ORM
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── workplace.py
│   │   │   ├── [...]
│   │   │
│   │   ├── routers                             # Routeurs FastAPI
│   │   │   ├── __init__.py
│   │   │   ├── artifacts.py
│   │   │   ├── [...]
│   │   ├── static
│   │   │   ├── templates                       # Templates Jinja2 des emails
│   │   │   │   ├── invite.html
│   │   │   │   ├── reset.html
│   │   ├── types
│   │   ├── main.py
│   │   ├── mail.py
│   │   ├── utils.py
│   │   ├── langs.json
│   │   ├── verbs.json
│   ├── tests                                   # Tests unitaires          
│   │   ├── __init__.py
│   │   ├── test_main.py
├── database
│   ├── Dockerfile
├── .env.example
├── docker-compose.yml
```

## Standards de données

HelpXR API utilise le format JSON pour les données. Les dates sont au format ISO 8601.

Voici la liste des objets utilisés dans HelpXR :

- User
> Représente un utilisateur de l'application ( ex: Un étudiant, un enseignant, un administrateur )
- Workplace
> Représente un environnement de travail constitué de plusieurs artifacts ( ex: Le LF2L )
- Activity
> Scénario d'apprentissage constitué de plusieurs étapes appelées actions
- Action
> Une action est une étape d'un scénario d'apprentissage, elle concerne une cible de la machine qui sera mis en évidence ainsi que des indications textuelles et vocales pour l'étudiant.
- Statement
> Implémentation partielle d'un Statement xAPI , permet d'enregistrer les interactions de l'utilisateur avec l'environment de travail et l'activité joué dans le casque.
- Artifact
> Représente un objet instanciable dans un environnement de travail ( ex: Une découppeuse laser, une imprimante 3D, un pot de fleur ) , il possède un modèle 3D et des targets.
- Target
> Représente les parties du modèle 3D de l'artifact utilisées dans la logique machine ( ex: cube sur le pupitre pour un bouton poussoir) on y associe des composants.
- Component
> Un composant s'ajoute à une cible de la machine et permet d'en modifier le comportement ( ex: Un bouton poussoir, un axe , un son )

!!! warning
    Les noms des objets sont issues de standards IEEE, mais ne supporte encore peut-être pas toutes les fonctionnalités de ces standards.