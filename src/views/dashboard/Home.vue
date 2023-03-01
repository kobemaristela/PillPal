<template>
  <div class="container">
    <h1>Dashboard</h1>
    <div class="main-column">
      <div class="administrations-create-container">
        <h2>Add Administration</h2>
        <div class="input-row">
          Medication
          <select v-model="newAdministrationMedicationId">
            <option v-for="medication in medications" :value="medication.id">
              {{ medication.name }}
            </option>
          </select>
        </div>
        <div class="input-row">
          Status
          <select v-model="newAdministrationStatus">
            <option value="0">On Time</option>
            <option value="1">Early</option>
            <option value="2">Late</option>
          </select>
        </div>
        <div class="input-row">
          <button @click="createAdministration">Submit</button>
        </div>
      </div>
      <div class="administrations-graph-container">
        <h2>Timeline</h2>
        <div class="graph-row">
          <div class="bar-graph-container">
            <canvas ref="barGraph"></canvas>
          </div>
          <div class="pie-chart-container">
            <canvas ref="pieChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas {
  overflow: hidden;
}

.graph-row {
  display: flex;
  justify-content: space-around;
  overflow: hidden;
}

.pie-chart-container {
  flex: 1;
  overflow: hidden;
  max-width: 30vw;
}

.bar-graph-container {
  flex: 4;
  overflow: hidden;
  max-width: 30vw;
}

button {
  background-color: #00a9c0;
  padding: 0.5em;
  color: white;
  font-size: 1em;
  outline: 0;
  border: 0;
  border-radius: 0.2em;
  transition: all 0.3s;
}

button:active {
  filter: brightness(85%);
}

.input-row {
  font-size: 1.3rem;
  margin: 0.2em;
}

.container {
  display: flex;
  flex-grow: 1;
  margin: 1em;
  flex-direction: column;
}

.main-column {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

h2 {
  font-size: 1.5rem;
}

.administrations-create-container {
  align-items: start;
  border: 0.2em solid var(--background-color);
  flex-direction: column;
  border-radius: 1em;
  display: flex;
  flex-grow: 1;
  margin-top: 1em;
  padding: 1em;
}

.administrations-graph-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border: 0.2em solid var(--background-color);
  border-radius: 1em;
  margin-top: 1em;
  padding: 1em;
}
</style>
<script>
import Api from "@/Api.js";
import Chart from "chart.js/auto";

function dayWrap(day) {
  if (day < 0) day += 7;
  return day;
}

const INT_TO_DAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default {
  data() {
    return {
      medications: [],

      newAdministrationMedicationId: null,
      newAdministrationStatus: 0,

      pieChart: null,
      barGraph: null,
    };
  },
  methods: {
    createAdministration() {
      if (this.newAdministrationMedicationId === null) {
        alert("Missing Medication");
        return;
      }

      let timestamp = (Date.now() / 1000) | 0;
      Api.createMedicationAdministration(
        this.newAdministrationMedicationId,
        timestamp,
        Number(this.newAdministrationStatus)
      )
        .catch((error) => {
          alert("Failed to register administration");
          throw error;
        })
        .then((res) => {
          alert("Registered Administration");
          this.reloadCharts();
        });
    },
    reloadCharts() {
      Api.getMedicationAdministrations()
        .catch((error) => {
          alert("Failed to load medication administration list");
          throw error;
        })
        .then((administrations) => {
          let now = new Date();
          let nowDay = now.getDay();

          let pieChartData = [0, 0, 0];
          let barGraphData = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
          ];
          for (const administration of administrations) {
            pieChartData[administration.status]++;

            let date = new Date(administration.timestamp * 1000);

            if (now - date < 1000 * 60 * 60 * 24 * 6)
              barGraphData[administration.status][
                (date.getDay() + nowDay) % 7
              ]++;
          }

          this.pieChart.destroy();
          this.pieChart = new Chart(this.$refs.pieChart, {
            type: "doughnut",
            data: {
              labels: ["On Time", "Early", "Late"],
              datasets: [
                {
                  data: pieChartData,
                  backgroundColor: [
                    "rgb(75, 192, 192)",
                    "rgb(255, 205, 86)",
                    "rgb(255, 99, 132)",
                  ],
                },
              ],
            },
            options: {
              responsive: true,
            },
          });

          this.barGraph.destroy();
          this.barGraph = new Chart(this.$refs.barGraph, {
            type: "bar",
            data: {
              datasets: [
                {
                  label: "On Time",
                  data: barGraphData[0],
                  backgroundColor: "rgb(75, 192, 192)",
                },
                {
                  label: "Early",
                  data: barGraphData[1],
                  backgroundColor: "rgb(255, 205, 86)",
                },
                {
                  label: "Late",
                  data: barGraphData[2],
                  backgroundColor: "rgb(255, 99, 132)",
                },
              ],
              labels: [
                INT_TO_DAY[dayWrap(nowDay - 6)],
                INT_TO_DAY[dayWrap(nowDay - 5)],
                INT_TO_DAY[dayWrap(nowDay - 4)],
                INT_TO_DAY[dayWrap(nowDay - 3)],
                INT_TO_DAY[dayWrap(nowDay - 2)],
                INT_TO_DAY[dayWrap(nowDay - 1)],
                INT_TO_DAY[nowDay],
              ],
              options: {
                responsive: true,
              },
            },
          });
        });
    },
  },
  mounted() {
    let now = new Date();
    let nowDay = now.getDay();

    this.barGraph = new Chart(this.$refs.barGraph, {
      type: "bar",
      data: {
        datasets: [],
        labels: [],
      },
    });

    this.pieChart = new Chart(this.$refs.pieChart, {
      type: "doughnut",
      options: {
        responsive: true,
      },
    });

    Api.getMedication()
      .catch((error) => {
        alert("Failed to load medications list");
        throw error;
      })
      .then((medications) => {
        this.medications = medications;
      });

    this.reloadCharts();
  },
};
</script>
