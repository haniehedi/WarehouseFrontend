<template>
  <div class="register-form">
    <h2>Create an Account</h2>
    <form @submit.prevent="register">
      <div class="form-group">     
        <input type="text" id="username" v-model="username" required placeholder="Enter your username"/>
      </div>
      <div class="form-group">    
        <input type="email" id="email" v-model="email" required placeholder="Enter your email" />
      </div>
      <div class="form-group">      
        <input type="password" id="password" v-model="password" required placeholder="Enter your password" />
      </div>
      <div class="form-group">     
        <input type="text" id="role" v-model="role" required placeholder="Enter your role" />
      </div>
      <button type="submit" :disabled="isSubmitting">Register</button>
      <div v-if="message" class="message">{{ message }}</div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      role: '',
      message: '',
      isSubmitting: false
    };
  },
  methods: {
    async register() {
      this.isSubmitting = true;
      this.message = '';
      try {
        const response = await fetch('http://localhost:8000/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password,
            role: this.role
          })
        });

        console.log('Response:', response); 

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Registration error:', errorData); 
          throw new Error(errorData.message || 'Registration failed!');
        }

        const data = await response.json();
        this.message = `Registration successful! Welcome, ${data.username}`;
      } catch (error) {
        this.message = error.message;
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
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

button:disabled {
  background-color: #aaa;
}

.message {
  margin-top: 10px;
  color: red;
}
</style>
