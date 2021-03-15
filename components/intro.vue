<template>
  <div class="container flex-column">
    <h1>- <font-awesome-icon icon="users" /> NetApp -</h1>
    <h3>
      This application allows you to track Networking interactions with other
      professionals, monitor job applications, and have confidence in your job
      search.
    </h3>
    <div class="flex-row links">
      <hr />
      <a href="https://github.com/codyuhi/net-app"
        ><i class="fa fa-github"></i
      ></a>
      |
      <a href="https://www.linkedin.com/in/codyuhi/"
        ><i class="fa fa-linkedin"></i
      ></a>
      <hr />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faUsers);

Vue.component("font-awesome-icon", FontAwesomeIcon);

export default {};
</script>

<style scoped>
* {
  color: var(--dark-color);
  text-align: center;
}

.container {
    margin-bottom: 15px;
}

hr {
  width: 100%;
}

h3 {
  width: 80%;
}

.flex-row.links {
  justify-content: space-evenly;
  width: 50vw;
}

i {
  font-size: 30px;
}
</style>