# Lexique du projet HelpXR
Vous ne comprenez pas certains termes du site ? Un mot vous échappe pendant l'utilisation des applications ?
Ce lexique est là pour vous aider à comprendre les termes utilisés dans le projet HelpXR.

## Activité
Une activité est un ensemble d'actions à réaliser pour compléter un objectif.
Ces actions sont à effectuer dans un ordre bien précis pour que l'activité soit validée.

Une activité contient un titre, une description, des actions, et une liste d'artéfacts visés par cette activité.

Vous pouvez retrouver toutes les activités de l'application sur la page [Activités](https://HelpXR.lf2l.fr/activities) du site web.

!!! Example "Exemple d'activité"
    Imaginons que vous ayez une activité pour apprendre à faire un café.

    Cette activité nommée "Faire un café", pourrait avoir comme artéfact une cafetière, et pourrait contenir trois actions;
    
    - Remplir la cafetière d'eau
    - Mettre du café dans la cafetière
    - Allumer la cafetière

    A la fin de ces trois actions, l'activité sera validée et vous pourrez revenir au menu principal de l'application.

## Action
Une action est une tâche à réaliser pour compléter une activité.
Cette action est souvent reliée à une partie d'un artéfact visé par l'activité.

Une action contient un titre, une description, un indice, une ressource, une position, une cible et un type.

Une action peut être de trois types différents :

- **Information** : L'action ne nécessite pas d'interaction de la part de l'utilisateur, elle sert à donner des informations sur l'activité.
- **Action** : L'action nécessite une interaction de la part de l'utilisateur, elle sert à faire avancer l'activité.
- **Question** : L'action nécessite une interaction de la part de l'utilisateur, elle sert à faire un choix qui va influencer l'activité.

La position d'une action est une position relative à l'artéfact visé par cette action.
Elle permet de situer l'action par rapport à l'artéfact et sera utilisée par le panneau de contrôle pour se placer dans l'espace.

!!! Example "Exemple d'action"
    Imaginons la même activité "Faire un café" que précédemment.

    Une action de type *Action* pourrait avoir comme titre "Remplir la cafetière d'eau", comme description "Ouvrez le couvercle de la cafetière et verser de l'eau dans le réservoir", et comme indice "Le réservoir est situé à l'arrière de la cafetière".

    Cette action pourrait être placée au niveau du réservoir de la cafetière, et pourrait être reliée à une cible qui représente le couvercle de la cafetière.
    Elle pourrait aussi contenir une ressource qui représente une vidéo montrant comment ouvrir le couvercle de la cafetière et comment verser l'eau sans en mettre partout.

    Quand cette action sera validée, l'activité passera à l'action suivante.

## Artéfact
Un artéfact est un objet 3D qui peut être utilisé dans une activité, il peut en exister plusieurs au sein d'un même environnement.
Cet artéfact peut contenir plusieurs cibles, utilisés comme points de repère pour les actions.

Un artéfact contient un titre, une description, un modèle 3D ainsi qu'une liste de cibles.

Vous pouvez retrouver tous les artéfacts de l'application sur la page [Artéfacts](https://HelpXR.lf2l.fr/artifacts) du site web.

!!! Example "Exemple d'artéfact"
    Imaginons la même activité "Faire un café" que précédemment.

    L'artéfact de la cafetière pourrait avoir comme titre "Cafetière", comme description "Cafetière électrique avec un réservoir d'eau et un filtre à café".
    L'artéfact pourrait aussi avoir deux cibles:

    - Une cible nommée "Socle" qui représente le socle de la cafetière
    - Une cible nommée "Réservoir" qui représente le réservoir de la cafetière

    Ces deux cibles pourraient être utilisées par les actions de l'activité "Faire un café".

## Environnement
Un environnement représente un lieu dans lequel se déroule une activité.
Ces lieux sont des reproductions identiques de lieux réels, comme par exemple un laboratoire ou une salle de classe.

Un environnement contient un titre, une description, et une liste d'artéfacts.

Vous pouvez retrouver tous les artéfacts de l'application sur la page [Environnements](https://HelpXR.lf2l.fr/workplaces) du site web.

!!! Example "Exemple d'environnement"
    Imaginons la même activité "Faire un café" que précédemment.

    Cette activité pourrait se dérouler dans un environnement nommé "Cuisine", qui contiendrait l'artéfact de la cafetière.

## Cible
Une cible est une partie du modèle 3D d'un artéfact qui peut être utilisé par une action comme point de repère.
Cette cible peut aussi contenir des composants de manière à personnaliser son comportement.

## Composant
Un composant est un ensemble d'attributs qui peuvent être ajoutés à une cible pour modifier son comportement.
Certains ont des propriétés personnalisables, et peuvent aussi contenir des scripts permettant de réagir a des actions utilisateurs.

Ces attributs peuvent être de plusieurs types différents :

- **Button** : Un bouton poussoir qui peut être préssé par l'utilisateur.
- **Switch** : Un interrupteur qui peut être activé ou désactivé par l'utilisateur.
- **Crank** : Une manivelle qui peut être tournée par l'utilisateur.
- **Slider** : Un axe de translation qui peut être déplacé par un script.
- **Hinge** : Une charnière qui peut être tournée par l'utilisateur.
- **Color** : Une couleur qui peut être modifiée par un script.
- **Sound** : Un son qui peut être joué par un script.

Pour plus d'informations sur les composants, vous pouvez consulter la page développeur [Composants](./developer/components/index.md) de la documentation.
