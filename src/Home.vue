<style scoped>
.register-container {
  display: flex;
  flex-direction: row-reverse;
  margin-right: 10em;
  margin-top: 3em;
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
  height: 55vh;
  width: 40vh;
  justify-content: center;
  padding: 3em;
  margin: 3em;
}

.input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
}

label {
    font-size: 2em;
  }
  
h2 {
  font-size: 1.5em;
  margin-top: -2em;
  margin-bottom: 2em;
  display: flex;
  justify-content: center;
}

.register-button-row {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 2em;
}

button {
  background-color: var(--active-color);
  border: 0;
  border-radius: 0.5em;
  color: var(--text-color);
  font-size: 2em;
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
  font-size: 2em;
  outline: none;
  padding-left: 0.5em;
}

a {
  font-size: 2em;
}

.container {
  padding: 0.5em;
}

/* Oval 157 */
.oval1 {
  position: absolute; 
  top: 4em; 
  left: -10em; 
  width: 40em; 
  height: 40em; 
  background: #8353E24D; /* secondary-500 */
  border-radius: 50%; 
}

.oval2 {
  position: absolute; 
  top: -10em; /* top: -118px;*/
  right: -8em; 
  width: 35em; 
  height: 35em; 
  background: #8353E24D; /* secondary-500 */
  border-radius: 50%; 
  z-index: -1;
}
.rectangly {
  position: absolute; 
  top: 37em; 
  left: 60em; 
  width: 100em; 
  height: 9.5em; 
  background: #8353E24D; 
  border-radius: .5em;
  z-index: -1;
}
.headline {
  position: absolute; 
  top: 8em; 
  left: 4em;
  font-size: 2em; 
}
  .logo {
      position: absolute; 
      padding: 4em;
      transform: scale(4);
      widows: 2em;
      background-color:transparent;
  }
</style>

<template>
  <div class="Shapes">
    <div class="oval1"></div>
    <div class="oval2"></div>
    <div class="rectangly"></div>
  </div>
  <div class="headline">
    <h1>Headline 1.</h1>
    <h1>Headline 2.</h1>
    <h1>Headline 3.</h1>
  </div>
  <div class="header">
    <div class="logo">
      <img src="./assets/logo_small.svg" alt="PillPal" />
    </div>
  </div>
  <div class="container">
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
};
</script>
