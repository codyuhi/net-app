<template>
  <div class="container">
    <navbar></navbar>
    <div v-if="isLoading" class="flex-column content-container">
      <h1>Companies Page</h1>
      <h2>Loading...</h2>
      <nuxt-link key="companies" to="/">Return to main page</nuxt-link>
    </div>
    <div v-else-if="error" class="flex-column content-container">
      <h1>Companies Page</h1>
      <h2>Unable to Load this page</h2>
      <p>{{ error }}</p>
      <nuxt-link key="companies" to="/">Return to main page</nuxt-link>
    </div>
    <div v-else-if="isAdding" class="flex-column content-container">
      <h1>Add New Company</h1>
      <nuxt-link key="companies" to="/">Return to main page</nuxt-link>
    </div>
    <div v-else class="flex-column content-container">
      <h1>Companies</h1>
      <home-options
        v-for="company in organizations"
        :key="company.name"
        :name="company.name"
        :link="'/companies/' + company.id"
      ></home-options>
      <nuxt-link key="companies" to="/">Return to main page</nuxt-link>
    </div>
  </div>
</template>

<script>
import homeOptions from "~/components/home-options.vue";

export default {
  data() {
    return {
      isLoading: false,
      isAdding: false,
      error: null,
      organizations: [],
    };
  },
  components: { homeOptions },
  methods: {
    async getOrganizations() {},
  },
  created() {
    this.getOrganizations();
  },
};
</script>

<style scoped>
</style>