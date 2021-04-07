<template>
  <div class="container">
    <navbar></navbar>
    <div v-if="isLoading" class="flex-column content-container">
      <h1>Company Page</h1>
      <h2>Loading...</h2>
      <nuxt-link key="companies" to="/">Return to main page</nuxt-link>
    </div>
    <div v-else-if="error" class="flex-column content-container">
      <h1>Company Page</h1>
      <h2>Unable to Load this page</h2>
      <p>{{error}}</p>
      <nuxt-link key="companies" to="/">Return to main page</nuxt-link>
    </div>
    <div v-else-if="isEditing" class="flex-column content-container">
      <h1></h1>
      <nuxt-link key="companies" to="/">Return to main page</nuxt-link>
    </div>
    <div v-else class="flex-column content-container">
      <h1 v-if="company && company.name">{{company.name}}</h1>
      
      <nuxt-link key="companies" to="/">Return to main page</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      isAdding: false,
      error: null,
      company: null
    };
  },
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