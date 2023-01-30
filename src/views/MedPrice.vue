<template>
  <div class="dashboard-app">
    <Sidebar />
    <h1>Medication Price</h1>
  </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
</script>

<style lang="scss" scoped>
.dashboard-app {
  background-color: white;
  display: flex;
  main {
    flex: 1 1 0;
    padding: 2rem;
    @media (max-width: 1024px) {
      padding-left: 6rem;
    }
  }
}
</style>
