<template>
  <div class="dashboard">
    <Sidebar />
    <router-view></router-view>
  </div>
  <AutoLogout />
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
import AutoLogout from "../components/AutoLogout.vue"
</script>

<style scoped>
.dashboard {
  background-color: white;
  display: flex;
}
</style>
