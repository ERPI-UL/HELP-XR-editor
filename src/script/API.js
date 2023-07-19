import Lang from './Lang.js';
import User from './User.js';

class Credentials {
    static get TYPE() {
        return {
            UNKNOWN: 0,
            TOKEN: 1,
            CREDENTIALS: 2
        };
    }

    static fromToken(token) {
        return new Credentials({token: token, type: Credentials.TYPE.TOKEN});
    }

    static fromCredentials(username, password) {
        return new Credentials({username: username, password: password, type: Credentials.TYPE.CREDENTIALS});
    }

    token = "";
    username = "";
    password = "";
    type = Credentials.TYPE.UNKNOWN;

    constructor(infos) {
        this.token = infos.token ?? this.token;
        this.username = infos.username ?? this.username;
        this.password = infos.password ?? this.password;
        this.type = infos.type ?? this.type;
    }

    isValid() {
        return this.type != Credentials.TYPE.UNKNOWN;
    }

    getToken() {
        return this.token;
    }

    getUsername() {
        return this.username;
    }

    getPassword() {
        return this.password;
    }
}

class Pagination {
    constructor (page = 1, size = 10) {
        this._page = 1;
        this._pages = 1;
        this._size = 10;
        this._total = 1;

        this.page = page;
        this.size = size;

        this._onChanged = null;
    }

    fromRequest(res) {
        const props = ["page", "pages", "size", "total"];
        for (let prop of props) {
            if (res[prop] === undefined) return false;
        }
        this._page = res.page;
        this._pages = res.pages;
        this._size = res.size;
        this._total = res.total;
        return true;
    }

    set page(page) {
        this._page = page ?? 1;
        this._onChanged?.();
    }

    set pages(pages) {
        this._pages = pages;
    }

    set size(size) {
        this._size = size ?? 10;
        this._onChanged?.();
    }

    set total(total) {
        this._total = total;
    }

    next() {
        if (!this.hasNext) return;
        this.page += 1;
        this._onChanged?.();
    }

    previous() {
        if (!this.hasPrevious) return;
        this.page -= 1;
        this._onChanged?.();
    }

    get hasPrevious() {
        return this.page > 1;
    }

    get hasNext() {
        return this.page < this.pages;
    }

    get page() {
        return this._page;
    }

    get pages() {
        return this._pages;
    }

    get size() {
        return this._size;
    }

    get total() {
        return this._total;
    }

    onChanged(callback) {
        this._onChanged = callback;
    }

    toString() {
        return API.createParameters({page: this.page, size: this.size});
    }
}

class API {
    static Credentials = Credentials;

    // API constants
    static API_URL = import.meta.env.VITE_API_URL;
    static get METHOD() {
        return {
            GET: "GET",
            PUT: "PUT",
            POST: "POST",
            PATCH: "PATCH",
            DELETE: "DELETE"
        };
    }
    static get TYPE() {
        return {
            FORM: "application/x-www-form-urlencoded",
            JSON: "application/json",
            FILE: "multipart/form-data",
            NONE: undefined
        }
    }
    static get AuthorizationHeader() { return "x-indico-authorization"; };

    static setURL(url) {
        if (!url) return;
        if (url.endsWith("/")) url = url.substring(0, url.length - 1);
        API.API_URL = url;
    }

    // API routes
    static ROUTE = {
        LOGIN: "/auth/token/",
        RESET: "/auth/reset/",
        PASSWORD: "/auth/password/",
        LANGUAGES: "/langs/",
        USER: "/users/me/",
        USERS: "/users/",
        INVITE: "/users/invite/",
        ACTIVITIES: "/activities/",
        ACTIVITIES_SEARCH: "/activities/search",
        EASYCONNECT: "/easy/connect",
        ARTIFACTS: "/artifacts/",
        TARGETS: "/targets/",
        COMPONENTS: "/components/",
        CHANGE_ADMIN_LEVEL: "/admin/changeAdminLevel/",
        ADMIN: {
            DELETE_USER: "/admin/deleteUser/",
        },
        RESSOURCES: "/data/ressources/",
        ACTIONS: "/actions/",
        WORKPLACES: "/workplaces/",
        INSTANCES: "/workplaces/instances/",
        STATS: {
            ACTIVITIES: {
                AVERAGE_TIME: "/stats/activities/averageTime/",
                SKIP_RATE: "/stats/activities/skipRate/",
                PERFORM_RATE: "/stats/activities/performRate/",
                PERFORM_TIME: "/stats/activities/performTime/"
            },
            USERS: "/stats/users/",
            __SESSIONS: "/sessions/",
            SESSIONS: "/stats/sessions/"
        }
    };

    /**
     * Makes an API call with the specified parameters
     * @param {string} path API call url path (see API.ROUTES for possible routes)
     * @param {string} method API call method (see API.METHOD for possible values)
     * @param {object|string} body API call body (data to send, ignored if METHOD.GET is used)
     * @param {string} type API call data type (see API.TYPE for possible values))  
     * @param {object[]} headers API call additional headers
     * @returns a promise resolving when the API call is done
     */
    static execute(path, method = this.METHOD.GET, body = {}, type = this.TYPE.JSON, headers = [], file_name='model') {
        return new Promise((resolve, reject) => {
            if (API.API_URL == null) reject("Error : API host not set");
            path = path.replace("/?", "?").replace(/\/\//g, "/");
            let urlparts = path.split("?");
            let base = urlparts.splice(0, 1);
            let params = (urlparts.length > 0)? ("?" + urlparts.join("&")) : "";
            path = base + params;

            let reqHeaders = {
                "Accept": "application/json",
                "Accept-Language": Lang.CurrentCode
            };
            if (type != this.TYPE.NONE && type != this.TYPE.FILE) reqHeaders["Content-Type"] = type;

            if (headers)
                for (let key in headers)
                    reqHeaders[key] = headers[key];

            let reqBody = type == this.TYPE.FORM ? "" : {};
            if (body && type != this.TYPE.FILE) {
                switch (typeof (body)) {
                case "string":
                    if (body.startsWith("{") && body.endsWith("}"))
                        body = JSON.parse(body);
                    // pas de break, pour faire le traitement "object" suivant
                case "object":
                    if (type == this.TYPE.FORM)
                        reqBody = new URLSearchParams(body).toString();
                    else reqBody = JSON.stringify(body);
                    break;
                default: break;
                }
            }

            if (type == this.TYPE.FILE) { // create a form data from the body
                reqBody = new FormData();
                reqBody.append(file_name, body);
            }

            const sendError = (err) => {
                if (err.json) {
                    err.json().then(data => {
                        reject({
                            status: err.status,
                            message: data.detail ?? User.LANGUAGE.DATA.COMMON.UNKNOWN_ERROR
                        });
                    }).catch(err => reject(err));
                } else {
                    reject(err);
                }
            };

            fetch(API.API_URL + path, {
                credentials: "omit",
                method: method,
                body: method == this.METHOD.GET ? undefined : reqBody,
                headers: reqHeaders,
                referrer: window.location.origin,
                mode: "cors"
            }).then(response => {
                if (!response.status.toString().startsWith("2")) {
                    if (response.status === 498) { // token expired
                        User.forget();
                        window.location.reload();
                    }
                    sendError(response);
                } else {
                    switch (response.headers.get("content-type")) {
                    case 'application/json':
                        response.json().then(data => {
                            resolve(data);
                        }).catch(err => sendError(err));
                        break;
                    default:
                        response.arrayBuffer().then(data => {
                            resolve(data);
                        }).catch(err => sendError(err));
                        break;
                    }
                }
            }).catch(err => sendError(err));
        });
    }

    /**
     * Makes a logged API call with the specified parameters, using the specified credentials (token + token type / username + password)
     * @param {string} path API call url path (see API.ROUTES for possible routes)
     * @param {string} method API call method (see API.METHOD for possible values)
     * @param {Credentials} credentials API call credentials to use (use User.currentUser.getCredentials() to get the current user's credentials)
     * @param {object|string} body API call body (data to send, ignored if METHOD.GET is used)
     * @param {string} type API call data type (see API.TYPE for possible values))
     * @param {object[]} headers API call additionnal headers
     * @returns A promise resolving when the API call is done
     */
    static execute_logged(path, method = API.METHOD.GET, credentials, body = {}, type = this.TYPE.JSON, headers = [], file_name='model') {
        return new Promise((resolve, reject) => {
            if (!credentials) {
                reject({status: -1, message: "Please provide credentials (token/type or username/password)"});
                return;
            }
            const token_mode = (credentials.token != undefined)
            const login_mode = (credentials.password != undefined && credentials.username != undefined)

            if (!login_mode && !token_mode) {
                reject({status: -1, message: "Error: Invalid credentials"});
                return;
            }

            let reqHeaders = {};
            if (headers)
                for (let key in headers)
                    reqHeaders[key] = headers[key];

            if (token_mode) {
                reqHeaders[API.AuthorizationHeader] = "Bearer " + credentials.token;
                this.execute(path, method, body, type, reqHeaders, file_name).then(resolve).catch(reject);
            } else {
                this.execute(API.ROUTE.LOGIN, this.METHOD.POST, { username: credentials.username, password: credentials.password }, this.TYPE.FORM).then(data => {
                    reqHeaders[API.AuthorizationHeader] = data;
                    this.execute(path, method, body, type, reqHeaders, file_name).then(resolve).catch(reject);
                }).catch(err => reject(err));
            }
        });
    }

    /**
     * Creates API parameters from an object
     * @param {object} params key-value pairs of parameters to add to the url
     * @returns string corresponding to the query parameters part of the url
     */
    static createParameters(params) {
        switch (typeof (params)) {
        case "string":
            if (params.startsWith("?")) return params;
            if (params.startsWith("{") && params.endsWith("}"))
                params = JSON.parse(params);
        case "object":
            return "?" + new URLSearchParams(params).toString();
        default:
            console.error("API Error: Error while creating parameters with argument: ", params);
            return "";
        }
    }

    /**
     * Creates pagination parameters from a page index and page number of elements
     * @param {number} page number of elements to skip
     * @param {number} size number of elements in one page
     * @returns a string corresponding to the pagination's parameters part of the url
     */
    static createPagination(page = 0, size = 10) {
        return new Pagination(page, size);
    }
}

export default API;