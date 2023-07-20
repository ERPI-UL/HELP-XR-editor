# Composants
Un composant est un ensemble d'attributs qui peuvent être ajoutés à une cible d'artéfact pour modifier son comportement.
Chaque composant contient:

- Un Id
- Une étiquette
- Une cible
- Un type
- Un [script lua](./scripts.md)
- Un [script blockly](../website/blockly.md)

## Types de composants
Un composant contient un type, permettant de définir plusieurs attributs:

- Son nom
- Son utilisation
- Son icône *(pas encore implémenté, mais le champ est présent)*
- Ses [évènements](./events.md)
- Ses [propriétés](./properties.md)
- Ses [méthodes](./methods.md)

Il existe 7 types de composants de base dans HelpXR, en voici la liste:

| Nom        | Description             |
| ---------- | ----------------------- |
| **Button** | Bouton poussoir         |
| **Switch** | Contacteur              |
| **Crank**  | Manivelle               |
| **Slider** | Axe de translation      |
| **Hinge**  | Axe de rotation         |
| **Color**  | Modification de couleur |
| **Sound**  | Ajout de sons           |

Pour en savoir plus sur la structure d'un composant, visitez la page [représentation](./representation.md).