import API from './API';
import Lang from './Lang';

/**
 * User class, used to store user information.
 */
class User {
    // User available permissions
    static PERMISSIONS = {
        VISITOR: 0,
        LEARNER: 1,
        TEACHER: 2,
        ADMIN: 3
    }
    static get Roles() {
        return [Lang.CurrentLang.VISITOR, Lang.CurrentLang.LEARNER, Lang.CurrentLang.TEACHER, Lang.CurrentLang.ADMIN];
    }

    // Current user (default at what's in the localstorage)
    static currentUser = User.fromLocalStorage();

    /**
     * Retreives the user's informations in the token and creates a new user with them
     * @param {string|object} token token object or string containing type and token fields
     * @returns a new user created from the given token object or string
     */
    static fromToken(token) {
        if (token == null) return null;
        if (typeof token === 'string') token = JSON.parse(token);
        if (!token.type || !token.token) {
            console.error("Error gettings user from token: missing token fields (type, token)");
            return null;
        }
        try {
            const tokenInfos = JSON.parse(atob(token.token.split(".")[1]));
            return new User(tokenInfos.username??"", "", "", "", {type: token.type, token: token.token}, tokenInfos.adminLevel??User.PERMISSIONS.VISITOR, tokenInfos.id??0);
        } catch(e) {
            console.error("Error getting user from token : "+e);
            return null;
        }
    }

    /**
     * Removes all user informations from the client
     */
    static forgetUser() {
        localStorage.removeItem("user");
        User.currentUser = null;
    }

    /**
     * Returns the user stored in the client's localstorage (new User is null)
     * @returns {User} The user corresponding to the state of the client's local storage
     */
    static fromLocalStorage() {
        const localData = localStorage.getItem("user");
        return localData? User.fromJSON(localData) : null;
    }

    /**
     * Retreives the user from the localstorage and replaces the current one by the new retreived one
     */
    static refreshUser() {
        User.currentUser = User.fromLocalStorage();
    }

    /**
     * Saves a user in the client's localstorage
     * @param {User} user user to save to the localstorage
     */
    static saveUser(user=User.currentUser) {
        localStorage.setItem("user", User.toJSON(user));
        User.currentUser = user;
    }

    /**
     * Creates a user from the given JSON string or object
     * @param {string|object} json json object to use to create the user from
     * @returns the user created from the given JSON string or object
     */
    static fromJSON(json) {
        if (json == null) return new User();
        if (typeof json === 'string') json = JSON.parse(json);
        return new User(json.username, json.email, json.firstname, json.lastname, json.token, json.permissions, json.id);
    }

    /**
     * Converts a user to a JSON string
     * @param {User} user user to convert to JSON
     * @returns json string representing the user
     */
    static toJSON(user) {
        return JSON.stringify(user);
    }

    /**
     * Checks if a given user is connected or not
     * @param {User} user user to test
     * @returns if the user is connected is connected or not
     */
    static isConnected(user) {
        return !(user == null || user.username == null || user.username == "");
    }

    id = 0;
    username = "";
    password = "";
    email = "";
    firstname = "";
    lastname = "";
    token = null;
    permissions = 0;

    constructor(username="", email="", firstname="", lastname="", token=null, permissions=User.PERMISSIONS.VISITOR, id=0) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.token = token;
        this.permissions = permissions;
    }

    /**
     * Fetches all the user's informations from the server with an API call
     * @returns {Promise} a promise containing the user's informations, resolving when the API call is done
     */
    fetchInformations() {
        return new Promise((resolve, reject) => {
            if (!this.token) {
                reject({message: "Fetch error : User not connected"});
                return;
            }
            API.execute_logged(API.ROUTE.USER, API.METHOD.GET, this.getCredentials()).then(data => {
                this.id = data.id;
                this.username = data.username;
                this.email = data.email;
                this.firstname = data.firstname;
                this.lastname = data.lastname;
                this.permissions = data.adminLevel;
                User.forgetUser();
                User.saveUser(this);
                resolve(this);
            }).catch(err => {
                User.forgetUser();
                window.location.href = "/";
                reject({message: err.message});
            });
        });
    }

    /**
     * Returns the credentials corresponding to this user
     * @returns The credentials of the user
     */
    getCredentials() {
        return this.token ?? {username: this.username, password: this.password}
    }

    // is the user a visitor
    isVisitor() {return this.permissions == User.PERMISSIONS.VISITOR;}
    // is the user a teacher
    isTeacher() {return this.permissions == User.PERMISSIONS.TEACHER;}
    // is the user a learner
    isLearner() {return this.permissions == User.PERMISSIONS.LEARNER;}
    // is the user an admin
    isAdmin() {return this.permissions == User.PERMISSIONS.ADMIN;}

    // does the user have visitor permissions (or above)
    canVisitor() {return this.permissions >= User.PERMISSIONS.VISITOR;}
    // does the user have teacher permissions (or above)
    canTeacher() {return this.permissions >= User.PERMISSIONS.TEACHER;}
    // does the user have learner permissions (or above)
    canLearner() {return this.permissions >= User.PERMISSIONS.LEARNER;}
    // does the user have admin permissions (or above)
    canAdmin() {return this.permissions >= User.PERMISSIONS.ADMIN;}
}

export default User;