<template>
  <div class="login-form">
    <h2>Login</h2>
    <form @submit.prevent="login">
    <div class="form-group">    
      <input type="text" v-model="username" required placeholder="Username" />
    </div>
    <div class="form-group">    
      <input type="password" v-model="password" required placeholder="Password" />
    </div>
      <button type="submit">Login</button>
      <div v-if="message">{{ message }}</div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      message: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch('http://localhost:8000/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed!');
        }

        const data = await response.json();
        this.$store.dispatch('saveToken', data.access); 
        this.$router.push({ name: 'WarehousePage' });
      } catch (error) {
        this.message = error.message;
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

input {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.message {
  margin-top: 10px;
  color: red;
}
</style>
