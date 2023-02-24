<style scoped>
.register-container {
  display: flex;
  flex-direction: row-reverse;
  margin-right: 10em;
  margin-top: 15em;
  z-index: 10;
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
  height: 50vh;
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
  height: 3025px;
  position: relative;
  overflow: hidden;
  width: 100%;
}

/* Oval 157 */
.oval1 {
  position: absolute;
  border-radius: 50%;
  width: 40em;
  height: 40em;
  background: #8353e24d; /* secondary-500 */
  z-index: -1;
  top: 13em;
  left: -10em;
}

.oval2 {
  position: absolute;
  border-radius: 50%;
  width: 40em;
  height: 40em;
  background: #8353e24d; /* secondary-500 */
  z-index: -1;
  top: -10em; /* top: -118px;*/
  right: -8em;
}
.rectangly {
  position: absolute;
  top: 45em;
  left: 60em;
  width: 100em;
  height: 13.5em;
  background: #8353e24d;
  border-radius: 0.5em;
  z-index: -1;
}
.rectangly_2 {
  position: absolute;
  bottom: 12em;
  right: 60em;
  width: 100em;
  height: 10.5em;
  background: #8353e24d;
  border-radius: 0.5em;
  z-index: -1;
}
.headline {
  position: absolute;
  margin-top: 13em;
  margin-left: 4em;
  font-size: 2em;
}
.logo {
  position: absolute;
  padding: 4em;
  transform: scale(4);
  widows: 2em;
  background-color: transparent;
}
.product-container {
  position: absolute;
  margin-top: 2em;
  width: 100%;
  background-color: var(--active-color);
  z-index: -10;
}
.footer {
  margin-top: 2em;
  width: 100%;
  background-color: var(--background-color);
}
.footer-content {
  justify-content: space-between;
  width: 75%;
  padding-top: 2em;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
.product-features {
  width: 75%;
  padding-top: 8em;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  padding-bottom: 3em;
}
h3 {
  font-size: 4em;
  text-decoration: bold;
  font-family: "Epilogue";
  color: white;
}
h6 {
  font-size: 1.2em;
  text-decoration: bold;
  color: black;
}

h4 {
  width: 30%;
  padding-top: 1em;
  color: white;
  text-decoration: none;
}
.centered {
  font-size: 1em;
  width: 50%;
  padding-top: 1em;
  margin-left: auto;
  margin-right: auto;
  color: white;
}

.par {
  width: auto;
}

h5 {
  font-size: 2.5em;
  width: 50%;
  padding-top: 1em;
  color: white;
}
.right-text {
  width: auto;
}

.row {
  margin-top: 8em;
  display: flex;
  justify-content: space-between;
  text-align: left;
}
.middle-row {
  margin-top: 8em;
  display: flex;
  justify-content: space-between;
  text-align: right;
}
</style>

<template>
  <div class="container">
    <div class="logo">
      <img src="./assets/logo_small.svg" alt="PillPal" />
    </div>

    <div class="headline">
      <h1>Ultimate</h1>
      <h1>Medication</h1>
      <h1>Management</h1>
    </div>

    <div class="shapes">
      <div class="oval1"></div>
      <div class="oval2"></div>
      <div class="rectangly"></div>
      <div class="rectangly_2"></div>
    </div>

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

    <div class="product-container">
      <div class="product-features">
        <h3>Product Features</h3>
        <h4 class="centered">
          PillPal is an innovative medication tracking application that allows users to effortlessly monitor their medications, ensuring compliance and leading to better health outcomes. 
          Its features include an intuitive calendar for tracking medication, a comprehensive dashboard for a clear overview of medication-related information, and a convenient medication scheduler for easy addition of new medications.
        </h4>

        <div class="row">
          <div class="text">
            <h5>Take control of your medication</h5>
            <h4>
              PillPal's dashboard provides a comprehensive overview of all medication-related information, including dosage schedules, medication names, and refill dates, allowing users to easily track and manage their medications. 
              Its user-friendly interface provides a holistic view of their medication regimen, ensuring compliance and optimal health outcomes.
            </h4>
          </div>
          <img src="./assets/images/Dashboard.png" alt="sitting" width="auto" height="400"/>
        </div>

        <div class="middle-row">
          <div class="left_image">
            <img src="./assets/images/Medications.png" alt="sitting2" width="auto" height="400"/>
          </div>
          <div class>
            <h5 class="right-text">Medication Scheduler</h5>
            <h4 class="par">
              PillPal's medication scheduler feature simplifies the process of adding new medications to one's regimen, reducing the likelihood of errors or omissions. Users can easily add medication information such as name, dosage, and refill date, ensuring accuracy and compliance with their medication regimen.
            </h4>
          </div>
        </div>

        <div class="row">
          <div class="text">
            <h5>Calendar Tracker</h5>
            <h4>
              PillPal's intuitive calendar feature enables users to easily track their medication dosage schedules, eliminating the burden of manually keeping tabs on their medication routine. With its user-friendly interface and clear display of medication schedules, users can stay compliant and ensure optimal health outcomes.
            </h4>
          </div>
          <img src="./assets/images/Calendar.png" alt="sitting" width="auto" height="400"/>
        </div>
      </div>

      <div class="footer">
        <div class="footer-content">
            <router-link to="/about">About Us</router-link>
        </div>
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
  mounted() {
    Api.isLoggedIn() && this.$router.push("/dashboard");
  },
};
</script>
