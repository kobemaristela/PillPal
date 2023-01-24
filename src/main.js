import * as Vue from "vue";
import App from "./App.vue";
import * as VueRouter from "vue-router";

// Routes
import Home from "./Home.vue";
import Login from "./Login.vue";
import Dashboard from "./Dashboard.vue";

// TODO: Move to new file
const About = { template: "<div>About</div>" };

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/login", component: Login },
  { path: "/dashboard", component: Dashboard },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

const app = Vue.createApp(App);
app.use(router);
app.mount("#app");
