<template>
  <div class="container">
    <navbar></navbar>
    <div v-if="isLoading" class="flex-column content-container">
      <h1>Person Page</h1>
      <h2>Loading . . .</h2>
    </div>
    <div v-else-if="error" class="flex-column content-container">
      <h1>Unable to load the Person Page</h1>
      <p>{{ error }}</p>
    </div>
    <div v-else-if="isEditing" class="flex-column content-container">
      <h1>Edit Person Information</h1>
      <p>
        First Name<br /><input
          v-model="person.firstName"
          type="text"
          placeholder="Enter First Name"
        />
      </p>
      <p>
        Last Name<br /><input
          v-model="person.lastName"
          type="text"
          placeholder="Enter Last Name"
        />
      </p>
      <p>
        Description<br /><textarea
          v-model="person.description"
          placeholder="Enter Description"
        ></textarea>
      </p>
      <h2>Select Company</h2>
      <p v-if="!organizations || organizations.length === 0">
        There are no companies added to the application yet! Go to the
        <nuxt-link to="/companies">Companies</nuxt-link> page and add a new
        company
      </p>
      <div v-else class="tile-container">
        <div class="tile" v-for="org in organizations" :key="org.id"></div>
      </div>
      <h2>Select Position</h2>
      <p v-if="!positions || positions.length === 0">
        There are no positions added to the application yet! Go to the
        <nuxt-link to="/positions">Positions</nuxt-link> page and add a new
        position
      </p>
      <div v-else class="tile-container">
        <div class="tile" v-for="pos in positions" :key="pos.id"></div>
      </div>
      <div class="flex-row">
        <button @click="updatePerson">Save Changes</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
    </div>
    <div v-else-if="isCreatingNew" class="flex-column content-container">
      <h1>Create New Person</h1>
      <p>
        First Name<br /><input
          v-model="newPerson.firstName"
          type="text"
          placeholder="Enter First Name"
        />
      </p>
      <p>
        Last Name<br /><input
          v-model="newPerson.lastName"
          type="text"
          placeholder="Enter Last Name"
        />
      </p>
      <p>
        Description<br /><textarea
          v-model="newPerson.description"
          placeholder="Enter Description"
        ></textarea>
      </p>
      <h2>Select Company</h2>
      <p v-if="!organizations || organizations.length === 0">
        There are no companies added to the application yet! Go to the
        <nuxt-link to="/companies">Companies</nuxt-link> page and add a new
        company
      </p>
      <div v-else class="tile-container">
        <div class="tile" v-for="org in organizations" :key="org.id"></div>
      </div>
      <h2>Select Position</h2>
      <p v-if="!positions || positions.length === 0">
        There are no positions added to the application yet! Go to the
        <nuxt-link to="/positions">Positions</nuxt-link> page and add a new
        position
      </p>
      <div v-else class="tile-container">
        <div class="tile" v-for="pos in positions" :key="pos.id"></div>
      </div>
      <div class="flex-row">
        <button @click="createPerson">Save Changes</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
    </div>
    <div v-else class="flex-column content-container">
      <h1>Person Page</h1>
      <h2>{{ person.firstName }} {{ person.lastName }}</h2>
      <p>
        <span v-if="position && position.name">{{ position.name }}</span
        ><span v-else-if="organization && organization.name">Works</span
        ><span v-if="organization && organization.name">
          at {{ organization.name }}</span
        >
      </p>
      <p v-if="person && person.dateContacted">
        Connected since {{ formatDate(person.dateContacted) }}
      </p>
      <p v-if="person && person.description">{{ person.description }}</p>
      <div class="flex-row">
        <button @click="isEditing = true">Edit Person Information</button>
        <button @click="isCreatingNew = true">Create New Person</button>
        <button v-if="!person.rootPerson" @click="deletePerson">
          Delete Person
        </button>
      </div>
      <div v-if="network && network.length > 0">
        <h2>{{ person.firstName }} {{ person.lastName }}'s Network:</h2>
        <ul>
          <li v-for="per in network" :key="per.id">
            <nuxt-link :to="'/persons/' + per.id"
              >{{ per.firstName }} {{ per.lastName }}</nuxt-link
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { state } from "@/store/accounts";
import moment from "moment";

export default {
  data() {
    return {
      isLoading: false,
      error: null,
      isEditing: false,
      isCreatingNew: false,
      person: null,
      organizations: null,
      positions: null,
      organization: null,
      position: null,
      network: [],
      newPerson: {
        rootPerson: false,
        firstName: "",
        lastName: "",
        organizationId: "",
        positionId: "",
        network: [],
        dateRequested: new Date(),
        dateContacted: new Date(),
        replied: false,
        description: "",
      },
    };
  },
  methods: {
    async getPerson() {
      try {
        this.isLoading = true;
        this.error = null;
        const response = await fetch(
          "http://localhost:3000/api" + this.$route.path,
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
    async updatePerson() {
      try {
        this.error = null;
        this.isLoading = true;
        const response = await fetch(
          "http://localhost:3000/api/persons/" + this.person.id,
          {
            method: "PUT",
            body: JSON.stringify({
              rootPerson: this.person.rootPerson,
              firstName: this.person.firstName,
              lastName: this.person.lastName,
              organizationId: this.person.organizationId
                ? this.person.organizationId
                : "",
              positionId: this.person.positionId ? this.person.positionId : "",
              network: this.person.network
                ? this.person.network
                : [this.person.id],
              dateRequested: this.person.dateRequested,
              dateContacted: this.person.dateContacted,
              replied:
                this.person.replied !== null ? this.person.replied : false,
              description: this.person.description,
            }),
            headers: {
              authtoken: state().token,
              "Content-Type": "application/json",
            },
          }
        ).then((res) => {
          return res.json();
        });
        if (!response.success) {
          throw Error(response.message);
        }
        this.isEditing = false;
      } catch (err) {
        console.error(err);
        this.error = err;
      } finally {
        this.isLoading = false;
      }
    },
    async createPerson() {
      try {
        this.error = null;
        this.isLoading = true;
        this.newPerson.network.push(state().person);
        const response = await fetch("http://localhost:3000/api/persons", {
          method: "POST",
          body: JSON.stringify(this.newPerson),
          headers: {
            authtoken: state().token,
            "Content-Type": "application/json",
          },
        }).then((res) => {
          return res.json();
        });
        if (!response.success) {
          throw Error(response.message);
        }
        await this.addPersonToNetwork(response.personId);
        this.$router.push("/persons/" + response.personId);
      } catch (err) {
        console.error(err);
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    async deletePerson() {
      try {
        this.isLoading = true;
        this.error = null;
        const response = await fetch(
          "http://localhost:3000/api/persons/" + this.person.id,
          {
            method: "DELETE",
            headers: {
              authtoken: state().token,
            },
          }
        );
        if (response.status !== 204) {
          throw Error("Unable to delete Person");
        }
        this.$router.push("/");
      } catch (err) {
        console.error(err);
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    async addPersonToNetwork(id) {
      try {
        this.isLoading = true;
        this.error = null;
        const response = await fetch(
          "http://localhost:3000/api/persons/" + id + "/network",
          {
            method: "POST",
            headers: {
              authtoken: state().token,
            },
          }
        );
      } catch (err) {
        console.error(err);
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    async deletePersonFromNetwork(id) {
      try {
        this.isLoading = true;
        this.error = null;
        const response = await fetch(
          "http://localhost:3000/api/persons/" + id + "/network/" + id,
          {
            method: "DELETE",
            headers: {
              authtoken: state().token,
            },
          }
        );
      } catch (err) {
        console.error(err);
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    async getOrganization() {
      if (!this.person || !this.person.organizationId) {
        return;
      }
      try {
        this.isLoading = true;
        this.error = null;
        const response = await fetch(
          "http://localhost:3000/api/organizations/" +
            this.person.organizationId,
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
        this.organization = response.data;
      } catch (err) {
        console.error(err);
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    async getPosition() {
      if (!this.person || !this.person.positionId) {
        return;
      }
      try {
        this.isLoading = true;
        this.error = null;
        const response = await fetch(
          "http://localhost:3000/api/positions/" + this.person.positionId,
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
        this.position = response;
      } catch (err) {
        console.error(err);
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    async getOrganizations() {
      try {
        this.isLoading = true;
        this.error = null;
        const response = await fetch(
          "http://localhost:3000/api/organizations",
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
        this.organizations = response.organizations;
      } catch (err) {
        console.error(err);
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    async getPositions() {
      try {
        this.isLoading = true;
        this.error = null;
        const response = await fetch("http://localhost:3000/api/positions", {
          method: "GET",
          headers: {
            authtoken: state().token,
          },
        }).then((res) => {
          return res.json();
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        this.positions = response.positions;
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
          for(let i = 0; i < this.person.network.length; i++) {
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
    cancelEdit() {
      this.getPerson();
      this.isEditing = false;
      this.isCreatingNew = false;
    },
    formatDate(date) {
      return moment(date).format("d MMMM YYYY");
    },
  },
  async created() {
    await this.getPerson();
    await this.getOrganization();
    await this.getPosition();
    await this.getNetwork();
    await this.getOrganizations();
    await this.getPositions();
  },
};
</script>
<style scoped>
.tile-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: inherit;
}

.tile {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #284b63;
  color: white;
  padding: 15px;
  margin: 15px;
}

.tile:hover {
  cursor: pointer;
  background-color: darkblue;
}

button {
  margin: 15px;
}

.content-container {
  margin-bottom: 50px;
}
</style>