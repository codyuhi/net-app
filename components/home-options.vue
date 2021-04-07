<template>
  <div class="container flex-row" @click="redirectView()">
    <nuxt-link :to="link" class="flex-column">{{ name }}</nuxt-link>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["name", "link"],
  methods: {
    redirectView() {
      // window.location.href = this.link;
      // console.log('going to', this.link)
    },
  },
});
</script>

<style scoped>
.container {
  width: 30%;
  height: 15vh;
  margin: 15px;
  background-color: var(--secondary-color);
  text-align: center;
  box-shadow: 10px 10px 5px var(--accent-color);
}

.container:hover {
  cursor: pointer;
}

.container > a {
  color: var(--light-color);
}
</style>