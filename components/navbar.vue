<template>
  <div class="container">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#"><font-awesome-icon icon="users"/> NetApp</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" v-if="loggedIn">
          <b-nav-item href="">My User</b-nav-item>
          <b-nav-item href="">Person</b-nav-item>
          <b-nav-item href="/" @click="logout">Logout</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-else>
            <b-nav-item href="/">Login</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUsers)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue);

export default {
  data() {
    return {
      username: "",
    };
  },
  methods: {
      logout() {
          
      }
  },
  computed: {
    loggedIn: () => {
      return localStorage.token;
    },
  },
};
</script>

<style scoped>
* {
    color: var(--accent-color) !important;
}
</style>