<style scoped>
.login-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 100px;
}

.login-form-container {
  align-items: center;
  display: flex;
  justify-content: center;
}

.login-form-container form {
  background-color: var(--alternate-background-color);
  border-radius: 5em;
  display: flex;
  flex-direction: column;
  height: 30vh;
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

.login-button-row {
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
  <div class="login-container">
    <div class="login-form-container">
      <form @submit.prevent="">
        <h1>Login</h1>
        <div class="input-container">
          <label for="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            autocomplete="off"
            v-model="usernameValue"
          />
        </div>
        <div class="input-container">
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            autocomplete="off"
            v-model="passwordValue"
          />
        </div>
        <button @click="attemptLogin">Login</button>
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
    async attemptLogin() {
      try {
        await Api.login(this.usernameValue, this.passwordValue);

        this.$router.push("/dashboard");
      } catch (err) {
        alert(err);
      }
    },
  },
};
</script>
