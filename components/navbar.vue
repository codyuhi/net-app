<template>
  <div class="container">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/"
            ><font-awesome-icon icon="users" /> NetApp</b-nav-item
          >
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" v-if="loggedIn">
          <b-nav-item href="/accounts">My User</b-nav-item>
          <b-nav-item :href="personLink">Person</b-nav-item>
          <b-nav-item @click="logout()">Logout</b-nav-item>
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
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapState, mapActions } from "vuex";
import {state, actions} from '@/store/accounts'

library.add(faUsers);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(BootstrapVue);

export default {
  data() {
    return {
      personLink: state().token
        ? "/persons/" + state().person
        : "/",
    };
  },
  methods: {
    async logout() {
      if (state() && state().user) {
        this.vuexLogout()
      }
    },
    ...mapActions({
      vuexLogout: "accounts/logout",
    }),
  },
  computed: {
    loggedIn: () => {
      return state().user;
    },
    ...mapState({
      store: "data",
    }),
  },
};
</script>

<style scoped>
:root {
  --primary-color: #284b63;
  --secondary-color: #3c6e71;
  --light-color: #ffffff;
  --dark-color: #353535;
  --accent-color: #d9d9d9;
}
.navbar,
.bg-info {
  background-color: #284b63 !important;
  color: #ffffff !important;
}
</style>