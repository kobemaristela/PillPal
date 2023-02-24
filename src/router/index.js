import { createRouter, createWebHashHistory } from "vue-router";

// Routes
import Home from "../Home.vue";
import Login from "../Login.vue";
import About from "../About.vue";

// Dashboard Routes
import Dashboard from "../views/Dashboard.vue";
import DashboardHome from "../views/dashboard/Home.vue";
import DashboardMedications from "../views/dashboard/Medications.vue";
import DashboardSchedule from "../views/dashboard/Schedule.vue";
import DashboardDrugInfo from "../views/dashboard/DrugInfo.vue";
import DashboardMedicinePrice from "../views/dashboard/MedicinePrice.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/login", component: Login },
  {
    path: "/dashboard",
    component: Dashboard,
    children: [
      {
        path: "",
        component: DashboardHome,
      },
      {
        path: "drug-info",
        component: DashboardDrugInfo,
      },
      { path: "schedule", component: DashboardSchedule },
      { path: "medications", component: DashboardMedications },
      { path: "medicine-price", component: DashboardMedicinePrice },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
