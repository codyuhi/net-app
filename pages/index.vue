<template>
  <div class="container">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <navbar></navbar>
    <div v-if="loggedIn">
      <div class="flex-row content-container">
        <intro></intro>
        <home-options
          v-for="view in views"
          :key="view.name"
          :name="view.name"
          :link="view.link"
        ></home-options>
      </div>
    </div>
    <div v-else class="flex-column">
      <div class="flex-column content-container">
        <intro></intro>
        <div v-if="loginSelected" class="flex-column">
          <h2>Login</h2>
          <br />
          <form>
            <p>
              Username<br /><input
                v-model="username"
                type="text"
                placeholder="Enter Username"
              />
            </p>
            <p>
              Password<br /><input
                v-model="password"
                type="password"
                placeholder="Enter Password"
              />
            </p>
            <input value="Login" type="button" @click="login()" />
          </form>
          <br />
          <p>
            Need an account?
            <span @click="toggleLogin()">Create an account now</span>
          </p>
        </div>
        <div v-else class="flex-column">
          <h2>Create Account</h2>
          <br />
          <form>
            <p>
              First Name<br /><input
                v-model="firstname"
                type="text"
                placeholder="Enter First Name"
              />
            </p>
            <p>
              Last Name<br /><input
                v-model="lastname"
                type="text"
                placeholder="Enter Last Name"
              />
            </p>
            <p>
              Username<br /><input
                v-model="username"
                type="text"
                placeholder="Enter Username"
              />
            </p>
            <p>
              Password<br /><input
                v-model="password"
                type="password"
                placeholder="Enter Password"
              />
            </p>
            <input
              value="Create Account"
              type="button"
              @click="createAccount()"
            />
          </form>
          <br />
          <p>
            Already have an account?
            <span @click="toggleLogin()">Log in now</span>
          </p>
        </div>
        <p class="error-text" v-if="error.exists">{{ error.text }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import navbar from "~/components/navbar.vue";
import homeOptions from "~/components/home-options.vue";
import intro from "~/components/intro.vue";
import { mapActions } from "vuex";
import { state } from "@/store/accounts";

export default Vue.extend({
  data() {
    return {
      firstname: "",
      lastname: "",
      username: "",
      password: "",
      views: [
        {
          name: "My Account",
          link: "/accounts",
        },
        {
          name: "My Person",
          link: "/persons/" + state().person,
        },
        {
          name: "My Network",
          link: "/network",
        },
        // {
        //   name: "My Applications",
        //   link: "/applications",
        // },
        {
          name: "Companies",
          link: "/companies",
        },
        {
          name: "Positions",
          link: "/positions",
        },
      ],
      error: {
        exists: false,
        text: "",
      },
      loginSelected: true,
    };
  },
  components: { navbar, homeOptions },
  methods: {
    async login() {
      const result = await this.vuexLogin({
        username: this.username,
        password: this.password,
      });
      if (result.errorExists) {
        this.error.exists = true;
        this.error.text = result.errorText;
      }
    },
    async createAccount() {
      const result = await this.vuexCreateAccount({
        username: this.username,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname,
      });
      if (result.errorExists) {
        this.error.exists = true;
        this.error.text = result.errorText;
      }
    },
    toggleLogin() {
      this.loginSelected = !this.loginSelected;
    },
    ...mapActions({
      vuexLogin: "accounts/login",
      vuexCreateAccount: "accounts/createAccount",
    }),
  },
  computed: {
    loggedIn: () => {
      return state().token;
    },
  },
});
</script>

<style>
:root {
  --primary-color: #284b63;
  --secondary-color: #3c6e71;
  --light-color: #ffffff;
  --dark-color: #353535;
  --accent-color: #d9d9d9;
}

.container {
  width: inherit;
  height: inherit;
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

.content-container {
  height: inherit;
  width: inherit;
  margin-top: 50px;
}

.error-text {
  margin: 15px;
  color: red;
}

span {
  color: var(--secondary-color);
}

span:hover {
  cursor: pointer;
}
</style>