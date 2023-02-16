<template>
  <div class="dashboard">
    <Sidebar />
    <router-view></router-view>
  </div>
  <AutoRedirect />
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
import AutoRedirect from "../components/AutoRedirect.vue";
</script>

<style scoped>
.dashboard {
  background-color: white;
  display: flex;
}
</style>
