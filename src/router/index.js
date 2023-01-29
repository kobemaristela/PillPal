import { createRouter, createWebHistory } from 'vue-router'

// Routes
import Home from "../Home.vue";
import Login from "../Login.vue";
import Dashboard from "../views/Dashboard.vue";
import DrugInfo from "../views/DrugInfo.vue";
import Medications from "../views/Medications.vue";
import MedPrice from "../views/MedPrice.vue";
import Schedule from "../views/Schedule.vue";



// TODO: Move to new file
const About = { template: "<div>About</div>" };

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/login", component: Login },
  { path: "/dashboard", component: Dashboard},
  { path: "/drug_info", component: DrugInfo},
  { path: "/medications", component: Medications},
  { path: "/med_price", component: MedPrice},
  { path: "/schedule", component: Schedule},
  // { path: "/druginfo", component: () => import("../views/DrugInfo.vue")},
  // { path: "/medications", component: () => import("../views/Medications.vue")},
  // { path: "/medprice", component: () => import("../views/MedPrice.vue")},
  // { path: "/schedule", component: () => import("../views/Schedule.vue")},
];

const router = createRouter({
    history:createWebHistory(),
    routes
  })
  
  export default router