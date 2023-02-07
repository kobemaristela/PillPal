<style scoped>
.register-container {
  display: flex;
  flex-direction: row-reverse;
}

.register-form-container {
  align-items: center;
  display: flex;
  justify-content: center;
}

.register-form-container form {
  background-color: var(--alternate-background-color);
  border-radius: 2em;
  display: flex;
  flex-direction: column;
  height: 60vh;
  justify-content: center;
  padding: 3em;
  margin: 3em;
}

.input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
}

h2 {
  font-size: 1.5em;
  margin: 0;
  margin-bottom: 1em;
}

.register-button-row {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

button {
  background-color: var(--active-color);
  border: 0;
  border-radius: 0.5em;
  color: var(--text-color);
  font-size: 1.3em;
  padding: 0.5em;
  transition: 0.1s;
}

button:active {
  filter: brightness(0.8);
}

input {
  background-color: var(--input-background-color);
  border: 0;
  border-radius: 1em;
  font-size: 1.3em;
  outline: none;
  padding-left: 0.5em;
}

a {
  font-size: 1.3em;
}
</style>

<template>
  <h1>Medicine Tracker</h1>
  <div class="register-container">
    <div class="register-padding"></div>
    <div class="register-form-container">
      <form @submit.prevent="">
        <h2>Create an Account</h2>
        <div class="input-container">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            autocomplete="off"
            required
            v-model="usernameValue"
          />
        </div>
        <div class="input-container">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            autocomplete="off"
            minlength="8"
            pattern="/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/"
            title="Password must contain at least one lowercase, uppercase, numeric, and special character"
            required
            v-model="passwordValue"
          />
        </div>
        <div class="register-button-row">
          <button @click="attemptRegister">Sign Up</button>
          <router-link to="/login">Login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import Api from "./Api.js";

export default {
  data() {
    return {
      usernameValue: "",
      passwordValue: "",
    };
  },
  methods: {
    async attemptRegister() {
      try {
        await Api.register(this.usernameValue, this.passwordValue);

        this.$router.push("/dashboard");
      } catch (err) {
        alert(err);
      }
    },
  },
  mounted() {
    Api.isLoggedIn() && this.$router.push("/dashboard");
  },
};
</script>
