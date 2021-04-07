<template>
  <div class="container">
    <navbar></navbar>
    <div v-if="isLoading" class="flex-column content-container">
      <h1>Network Page</h1>
      <h2>Loading . . .</h2>
      <nuxt-link key="network" to="/">Return to main page</nuxt-link>
    </div>
    <div v-else-if="error" class="flex-column content-container">
      <h1>Network Page</h1>
      <h2>Unable to Load the Network</h2>
      <p>{{ error }}</p>
    </div>
    <div v-else class="flex-column content-container">
      <h1>Network Page</h1>
      <p v-if="network.length > 0">Click on any of the tiles below to view that person's information</p>
      <p v-if="network.length === 0">
        There is no one in your network! Create a Person on
        <nuxt-link :to="'/persons/' + personId">the Person page</nuxt-link> to
        add them to your network
      </p>
      <div v-else class="flex-row content-container">
        <home-options
          v-for="per in network"
          :key="per.id"
          :name="per.firstName + ' ' + per.lastName"
          :link="'/persons/' + per.id"
          class="tile"
        ></home-options>
      </div>
    </div>
  </div>
</template>

<script>
import { state } from "@/store/accounts";
import homeOptions from "~/components/home-options.vue";

export default {
  data() {
    return {
      isLoading: false,
      error: null,
      network: [],
      person: null,
      personId: state().person,
    };
  },
  components: { homeOptions },
  methods: {
    async getPerson() {
      try {
        this.isLoading = true;
        this.error = null;
        const response = await fetch(
          "http://localhost:3000/api/persons/" + this.personId,
          {
            method: "GET",
            headers: {
              authtoken: state().token,
            },
          }
        ).then((res) => {
          return res.json();
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        this.person = response.data;
      } catch (err) {
        console.error(err);
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    async getNetwork() {
      if (
        !this.person ||
        !this.person.network ||
        this.person.network.length === 0
      ) {
        return;
      }
      try {
        this.isLoading = true;
        this.error = null;
        for (let i = 0; i < this.person.network.length; i++) {
          let response = await fetch(
            "http://localhost:3000/api/persons/" + this.person.network[i],
            {
              method: "GET",
              headers: {
                authtoken: state().token,
              },
            }
          ).then((res) => {
            return res.json();
          });
          if (!response.success) {
            await this.deletePersonFromNetwork(this.person.network[i]);
            continue;
          }
          this.network.push(response.data);
        }
      } catch (err) {
        console.error(err);
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
  async created() {
    await this.getPerson();
    await this.getNetwork();
  },
};
</script>

<style scoped>
/* .content-container {
  height: inherit;
  width: inherit;
  margin-top: 50px;
} */
.tile {
  width: 200px !important
}
</style>