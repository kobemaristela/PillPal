<template>
  <div class="container">
    <h1>Medications</h1>
    <div class="main-row">
      <div class="medication-container">
        <h2>Medication List</h2>
        <ul>
          <li v-for="medication in medication" class="medication">
            <div>
              <h3>{{ medication.name }}</h3>
              {{ medication.description }}
            </div>
            <span
              class="material-symbols-outlined delete-button"
              @click="deleteMedication(medication.id)"
            >
              delete
            </span>
          </li>
        </ul>
      </div>
      <div class="new-medication-container">
        <h2>Add New Medication</h2>
        <div class="input-container">
          Medication Name
          <input type="text" v-model="newMedicationName" />
        </div>
        <div class="input-container">
          Description
          <input type="text" v-model="newMedicationDescription" />
        </div>
        <h2>Reminder Times</h2>
        <div class="input-container">
          Select a Time
          <input type="time" v-model="newMedicationTime" />
        </div>
        <div class="input-container">
          Select a Day (Optional)
          <select v-model="newMedicationDay">
            <option value="0">All</option>
            <option value="1">Sunday</option>
            <option value="2">Monday</option>
            <option value="3">Tuesday</option>
            <option value="4">Wednesday</option>
            <option value="5">Thursday</option>
            <option value="6">Friday</option>
            <option value="7">Saturday</option>
          </select>
        </div>
        <button @click="createNewMedication">Create</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
ul {
  align-items: start;
  justify-content: left;
  display: flex;
  flex-direction: column;
}
.medication {
  align-items: center;
  list-style: none;
  margin: 0.2em;
  padding: 1em;
  border: 0.1em solid var(--background-color);
  border-radius: 0.2em;
  display: flex;
  justify-content: center;
}

input {
  border: 0.1em solid var(--background-color);
  border-radius: 0.2em;
  display: flex;
  font-size: 1.3em;
  outline: 0;
  padding-left: 0.2em;
  width: 100%;
}

button {
  background-color: #00a9c0;
  padding: 1em;
  color: white;
  font-size: 1.1em;
  outline: 0;
  border: 0;
  border-radius: 0.2em;
  transition: all 0.3s;

  margin: 1em;
}

button:active {
  filter: brightness(85%);
}

.container {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  margin: 1em;
  text-align: left;
}

.main-row {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}

.medication-container {
  border: 0.2em solid var(--background-color);
  border-radius: 1em;
  width: 50%;
  margin: 1em;
  padding: 1em;
}

.new-medication-container {
  border: 0.2em solid var(--background-color);
  border-radius: 1em;
  width: 50%;
  margin: 1em;
  padding: 1em;
}

.input-container {
  margin: 1em;
}

.delete-button {
  cursor: pointer;
  margin-left: 0.2em;
}
</style>

<script>
import Api from "@/Api.js";

export default {
  data() {
    return {
      medication: [],

      newMedicationName: "",
      newMedicationDescription: "",

      newMedicationTime: null,
      newMedicationDay: 0,
    };
  },
  methods: {
    createNewMedication() {
      if (this.newMedicationName === "") {
        alert("Missing Medication Name");
        return;
      }

      if (this.newMedicationDescription === "") {
        alert("Missing Medication Description");
        return;
      }

      if (this.newMedicationTime === null) {
        alert("Missing Medication Time");
        return;
      }

      // We can only accept hours
      let hourOfDay = Number(this.newMedicationTime.split(":")[0]);
      let dayOfWeek = Number(this.newMedicationDay);
      if (dayOfWeek === 0) dayOfWeek = null;

      Api.createMedication(
        this.newMedicationName,
        this.newMedicationDescription
      )
        .catch((error) => {
          alert("Failed to create a new medication");
          throw error;
        })
        .then((medication) => {
          let medicationId = medication.id;
          return Api.createMedicationSchedule(
            medicationId,
            hourOfDay,
            dayOfWeek
          );
        })
        .catch((error) => {
          alert("Failed to create the medication schedule");
          throw error;
        })
        .then((schedule) => {
          this.reloadMedications();
          alert("Created medication");
        });
    },
    async reloadMedications() {
      try {
        let medication = await Api.getMedication();
        this.medication = medication;
      } catch (error) {
        alert("Failed to load medication");
        throw error;
      }
    },
    deleteMedication(id) {
      Api.deleteMedication(id)
        .catch((error) => {
          alert("Failed to delete medication");
          throw error;
        })
        .then((res) => {
          alert("Deleted Medication");

          this.reloadMedications();
        });
    },
  },
  mounted() {
    this.reloadMedications();
  },
};
</script>
