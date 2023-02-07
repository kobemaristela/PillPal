<script setup>
import '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { reactive } from 'vue'

const options = reactive({
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
        left: 'prev next today',
        center: 'title',
        right: 'dayGridMonth dayGridWeek listDay'
    },
    selectable: true
})
</script>

<template>
    <FullCalendar v-bind:options="options"/>
</template>
