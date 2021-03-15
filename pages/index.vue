<template>
  <div class="container">
    <navbar></navbar>
    <div v-if="loggedIn">
        <p>LOGGED IN</p>
    </div>
    <div v-else>
        <p>LOGGED OUT</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import navbar from "~/components/navbar.vue";

export default Vue.extend({
  components: { navbar },
  methods: {
    login() {},
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

.navbar {
  background-color: var(--primary-color) !important;
}
</style>