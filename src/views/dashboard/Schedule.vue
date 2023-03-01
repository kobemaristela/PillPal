<template>
  <div class="container">
    <h1>Schedule</h1>
    <calendar-view
      :show-date="showDate"
      :items="items"
      :showTimes="true"
      class="theme-default holiday-us-traditional holiday-us-official no-min-height"
      ref="calendar"
    >
      <template #header="{ headerProps }">
        <calendar-view-header :header-props="headerProps" />
      </template>
    </calendar-view>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 1em;
  text-align: center;
}

.no-min-height {
  min-height: 0%;
}
</style>

<script>
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar";
import "@/../node_modules/vue-simple-calendar/dist/style.css";

import Api from "@/Api.js";

export default {
  data: function () {
    return { showDate: new Date(), items: [] };
  },
  components: {
    CalendarView,
    CalendarViewHeader,
  },
  mounted() {
    let now = new Date();
    let startOfMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    let endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    Api.getMedication()
      .catch((error) => {
        alert("Failed to get medications");
      })
      .then((medications) => {
        return Promise.all(
          medications.map((medication) =>
            Api.getMedicationSchedules(medication.id).then((schedules) => {
              return schedules.flat().map((schedule) => {
                return {
                  medication: medication,
                  schedule: schedule,
                };
              });
            })
          )
        );
      })
      .catch((e) => {
        alert("Failed to get medication schedules");
      })
      .then((pairs) => {
        pairs = pairs.flat();

        let items = pairs.map((pair) => {
          let items = [];
          let day = 0;
          let date = new Date(now.getFullYear(), now.getMonth(), day);
          while (date < endOfMonth) {
            date = new Date(
              now.getFullYear(),
              now.getMonth(),
              day,
              pair.schedule.hourOfDay
            );
            day += 1;

            let hasDayOfWeek =
              pair.schedule.dayOfWeek !== null &&
              pair.schedule.dayOfWeek !== undefined;

            if (
              (hasDayOfWeek && date.getDay() + 1 === pair.schedule.dayOfWeek) ||
              !hasDayOfWeek
            ) {
              this.items.push({
                id: `${pair.medication.id}-${pair.schedule.id}-${day}`,
                startDate: date,
                title: pair.medication.name,
                tooltip: pair.medication.description,
              });
            }
          }
        });
      });
  },
};
</script>
