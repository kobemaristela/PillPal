<template>
  <div class="calendar">
    <calendar />
    <router-view></router-view>
  </div>
</template>

<script setup>
import calendar from "../../components/calendar.vue";
</script>

<style scoped>
.calendar {
  background-color: white;
  display: flex;
}
</style>