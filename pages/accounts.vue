<template>
  <div class="container">
    <navbar></navbar>
    <div class="flex-column content-container">
      <div class="flex-column" v-if="!editing">
        <h2>Username:</h2>
        <p>{{ username }}</p>
        <h2>Password:</h2>
        <p>********</p>
        <h2>UserID:</h2>
        <p>{{ userId }}</p>
        <h2>PersonID:</h2>
        <p>{{ personId }}</p>
        <input type="button" value="Edit" @click="toggleEdit()" />
        <input type="button" value="Delete Account" @click="deleteUser()" />
      </div>
      <div class="flex-column" v-else>
        <h2>Username:</h2>
        <p><input v-model="username" type="text" /></p>
        <h2>Password:</h2>
        <p><input v-model="password" type="password" /></p>
        <h2>UserID:</h2>
        <p><input v-model="userId" type="text" disabled/></p>
        <h2>PersonID:</h2>
        <p><input v-model="personId" type="text" /></p>
        <input type="button" value="Edit" @click="updateUser()" />
        <input type="button" value="Delete Account" @click="deleteUser()" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      username: "",
      password: "********",
      userId: "",
      personId: "",
      editing: false,
    };
  },
  methods: {
    getUser() {
      if (localStorage.token && JSON.parse(localStorage.token).id) {
        const token = JSON.parse(localStorage.token);
        fetch(`http://localhost:3000/api/accounts/${token.id}`, {
          headers: {
            authtoken: token.token,
          },
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            if (!res.success) {
              alert(res.message);
              return;
            }
            console.log(res);
            this.username = res.data.username;
            this.userId = res.data.id;
            this.personId = res.data.personId;
          });
      }
    },
    updateUser() {
      if (
        confirm("Are you sure you want to make these changes?") &&
        localStorage.token &&
        JSON.parse(localStorage.token).id
      ) {
        let body;
        if (this.password !== "********" && this.password !== "") {
          body = {
            username: this.username,
            personId: this.personId,
            password: this.password,
          };
        } else {
          body = {
            username: this.username,
            personId: this.personId,
          };
        }
        const token = JSON.parse(localStorage.token);
        fetch(`http://localhost:3000/api/accounts/${token.id}`, {
          method: "PUT",
          headers: {
            authtoken: token.token,
            "Content-type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(body),
        })
          .then((res) => {
              console.log(res)
            return res.json();
          })
          .then((res) => {
              if(!res.success) {
                  alert('Something went wrong while updating account')
                  return
              }
              console.log(res)
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    deleteUser() {
      if (
        confirm("Are you sure you want to delete your account?") &&
        localStorage.token &&
        JSON.parse(localStorage.token).id
      ) {
        const token = JSON.parse(localStorage.token);
        fetch(`http://localhost:3000/api/accounts/${token.id}`, {
          method: "DELETE",
          headers: {
            authtoken: token.token,
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
            localStorage.removeItem("token");
            window.location.href = "/";
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    toggleEdit() {
      this.editing = !this.editing;
    },
  },
  beforeMount() {
    this.getUser();
  },
});
</script>

<style scoped>
.container {
  width: inherit;
  height: inherit;
}

.content-container {
  height: inherit;
  width: inherit;
  margin-top: 50px;
}

h2,
p,
input {
  margin: 5px;
}

.flex-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: inherit;
}

.flex-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: inherit;
}
</style>