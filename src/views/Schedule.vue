<template>
  <div class="app">
    <Sidebar />
    <h1>Schedule</h1>
  </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
</script>

<style lang="scss">
:root {
  --primary: #4ade80;
  --secondary: #8353e2;
  --grey: #64748b;
  --dark: #000000;
  --dark-alt: #334155;
  --light: #cbc3e3;
  --sidebar-width: 300px;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}
.app {
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
