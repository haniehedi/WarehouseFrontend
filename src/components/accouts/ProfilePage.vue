<template>
  <div class="profile-container">
    <h2>User Profile</h2>
    <div v-if="profile" class="profile-details">
      <img v-if="profile.profile_picture" :src="profile.profile_picture" alt="Profile Picture" class="profile-picture" />
      <h3>{{ profile.username }}</h3>
      <p>Email: {{ profile.email }}</p>
      <p v-if="profile.bio">Bio: {{ profile.bio }}</p>
      <p v-if="profile.location">Location: {{ profile.location }}</p>
      <p v-if="profile.birth_date">Birth Date: {{ profile.birth_date }}</p>
      <p>Role: {{ profile.role }}</p>
    </div>
    <div v-else>
      <p>Loading profile...</p>
    </div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ProfileComponent',
  data() {
    return {
      profile: null,
      errorMessage: '',
    };
  },
  computed: {
    ...mapGetters(['getToken']),
  },
  async mounted() {
    await this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      const token = this.getToken;
      try {
        const response = await fetch('http://localhost:8000/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        this.profile = await response.json();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}

.profile-details {
  margin-top: 20px;
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.error-message {
  color: red;
  margin-top: 20px;
}
</style>
