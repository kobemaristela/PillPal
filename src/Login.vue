<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="">
      <div>
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          autocomplete="off"
          v-model="usernameValue"
        />
      </div>
      <div>
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
