<template>
  <div class="container">
    <p>Bar</p>
    <nuxt-link to="/">Home</nuxt-link>
    <nuxt-link to="/foo">Foo</nuxt-link>
    <nuxt-link to="/bar">Bar</nuxt-link>
    <div>
      <Logo />
      <h1 class="title">
        NetApp
      </h1>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          rel="noopener noreferrer"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      company: "Company Title",
      name: "",
      phone: "",
      bgcolor: "white",
      form: {
        colors: ["red", "blue", "green", "orange", "yellow"],
      },
    };
  },
});
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

/* form {
  margin: 20px;
}

.example {
  border: 1px solid black;
  border-radius: 4px;
  display: inline-block;
  width: 400px;
}

.company {
  font-size: 120%;
}

.color-selector {
  padding: 15px;
}

.color-selector span {
  display: inline-block;
  width: 70px;
  height: 45px;
} */
</style>
