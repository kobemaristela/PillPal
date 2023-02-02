<template>
  <div class="dashboard">
    <Sidebar />
    <router-view></router-view>
  </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
</script>

<style lang="scss" scoped>
.dashboard {
  background-color: white;
  display: flex;
}
</style>
