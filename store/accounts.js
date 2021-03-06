export const AUTHENTICATED = 'accounts.authenticated'
export const CREATED = 'accounts.created'

export const state = () => ({
    data: localStorage.token ? JSON.parse(localStorage.token) : {},
    token: localStorage.token ? JSON.parse(localStorage.token).token : '',
    user: localStorage.token ? JSON.parse(localStorage.token).id : '',
    person: localStorage.token ? JSON.parse(localStorage.token).rootPersonId : '',
    editing: false,
    host: 'localhost',
    port: '8000',
    baseUrl: 'http://localhost:8000'
})

export const mutations = {
    setToken(state, { token, user, person }) {
        state.token = token
        state.user = user
        state.person = person
        const localData = {
            token: token,
            id: user,
            rootPersonId: person
        }
        localStorage.token = JSON.stringify(localData)
        return localData
    },
    clearToken(state) {
        state.data = undefined
        state.token = undefined
        state.user = undefined
        state.person = undefined
        if (localStorage.token) localStorage.removeItem('token')
    }
}

export const actions = {
    login({ dispatch }, { username, password }) {
        const result = fetch(state().baseUrl + "/api/accounts/login", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                if (!json.success) {
                    return {
                        errorExists: true,
                        errorText: json.message
                    }
                }
                mutations.setToken(this, { token: json.token, user: json.id, person: json.rootPersonId })
                window.location.reload(true);
                return {
                    errorExists: false,
                    errorText: '',
                }
            })
            .catch((err) => {
                return {
                    errorExists: true,
                    errorText: err.message
                }
            });
        return result
    },
    logout() {
        const data = state()
        const result = fetch(state().baseUrl + "/api/accounts/logout", {
            method: "DELETE",
            headers: {
                "authtoken": data.token
            }
        })
            .then((res) => {
                return res.status;
            })
            .then((res) => {
                if (res !== 204) {
                    throw Error('Something went wrong while logging you out')
                }
                mutations.clearToken(this)
                window.location.href = "/"
            })
            .catch((err) => {
                console.error(err)
            })
    },
    createAccount({ dispatch }, { firstname, lastname, username, password }) {
        const result = fetch(state().baseUrl + "/api/accounts", {
            method: "POST",
            body: JSON.stringify({
                firstName: firstname,
                lastName: lastname,
                username: username,
                password: password,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                if (!json.success) {
                    return {
                        errorExists: true,
                        errorText: json.message
                    }
                }
                mutations.setToken(this, { token: json.token, user: json.id, person: json.rootPersonId })
                window.location.reload(true);
                return {
                    errorExists: false,
                    errorText: '',
                }
            })
            .catch((err) => {
                return {
                    errorExists: true,
                    errorText: err.message
                }
            });
        return result
    },
    getUser() {
        const data = state()
        const user = fetch(state().baseUrl + `/api/accounts/${data.user}`, { headers: { authToken: data.token } })
            .then((res) => {
                return res.json()
            })
            .then((json) => {
                if (!json.success) {
                    console.error(json.message)
                    return null
                }
                return {
                    username: json.data.username,
                    userId: json.data.id,
                    personId: json.data.personId
                }
            })
            .catch((err) => {
                console.error(err)
            })
        return user
    },
    updateUser({ dispatch }, { body }) {
        const data = state()
        const result = fetch(state().baseUrl + `/api/accounts/${data.user}`, {
            method: "PUT",
            headers: {
                authtoken: data.token,
                "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(body),
        })
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                if (!json.success) {
                    console.error(json.message)
                    alert("Something went wrong while updating account");
                    return;
                }
                mutations.setToken(this, {
                    token: data.token,
                    user: data.user,
                    person: json.data.personId
                })
                return json;
            })
            .catch((err) => {
                console.error(err);
            });
    },
    deleteUser() {
        const data = state()
        const result = fetch(state().baseUrl + `/api/accounts/${data.user}`, {
            method: "DELETE",
            headers: {
                authtoken: data.token,
            },
        })
            .then((res) => {
                return res.status;
            })
            .then((res) => {
                if (res !== 204) {
                    alert("Something went wrong while deleting account");
                    return;
                }
                mutations.clearToken(this)
                window.location.href = "/";
            })
            .catch((err) => {
                console.error(err);
            });
    }
}