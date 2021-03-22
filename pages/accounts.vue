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
        <p><input v-model="userId" type="text" disabled /></p>
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
import { mapActions } from "vuex";

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
    async getUser() {
      if (this.$store.state.accounts && this.$store.state.accounts.user) {
        const user = await this.vuexGetUser();
        this.username = user.username;
        this.userId = user.userId;
        this.personId = user.personId;
      }
    },
    updateUser() {
      if (
        confirm("Are you sure you want to make these changes?") &&
        this.$store.state.accounts &&
        this.$store.state.accounts.user
      ) {
        let body;
        if (this.password !== "********" && this.password !== "") {
          body = {
            id: this.userId,
            username: this.username,
            personId: this.personId,
            password: this.password,
          };
        } else {
          body = {
            id: this.userId,
            username: this.username,
            personId: this.personId,
          };
        }
        this.vuexUpdateUser({ body: body });
        this.toggleEdit();
      }
    },
    deleteUser() {
      if (
        confirm("Are you sure you want to delete your account?") &&
        this.$store.state.accounts &&
        this.$store.state.accounts.user
      ) {
        this.vuexDeleteUser();
      }
    },
    toggleEdit() {
      this.editing = !this.editing;
    },
    ...mapActions({
      vuexGetUser: "accounts/getUser",
      vuexUpdateUser: "accounts/updateUser",
      vuexDeleteUser: "accounts/deleteUser",
    }),
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