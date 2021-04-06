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

export default Vue.extend({
  data() {
    return {
      username: "",
      password: "",
      views: [
        {
          name: "My Account",
          link: "/accounts",
        },
        {
          name: "My Person",
          link: "/persons",
        },
        {
          name: "My Network",
          link: "/network",
        },
        {
          name: "My Applications",
          link: "/applications",
        },
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
    login() {
      console.log("0");
      fetch("http://localhost:3000/api/accounts/login", {
        method: "POST",
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (!res.success) {
            this.error.exists = true;
            this.error.text = res.message;
            return;
          }
          this.error.exists = false;
          localStorage.token = JSON.stringify(res);
          window.location.reload(true);
        })
        .catch((err) => {
          console.log("1");
          this.error.exists = true;
          this.error.text = err;
        });
    },
    createAccount() {
      console.log("2");
      fetch("http://localhost:3000/api/accounts", {
        method: "POST",
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (!res.success) {
            this.error.exists = true;
            this.error.text = res.message;
            return;
          }
          this.error.exists = false;
          console.log("3");
          localStorage.token = JSON.stringify(res);
          window.location.reload(true);
        });
    },
    toggleLogin() {
      this.loginSelected = !this.loginSelected;
    },
  },
  computed: {
    loggedIn: () => {
      return localStorage.token;
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