<template>
  <aside :class="`${is_expanded ? 'is_expanded' : ''}`">
    <div class="logo">
      <img src="../assets/logo_small.svg" alt="PillPal" />
    </div>
    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="ToggleMenu">
        <span class="material-icons-outlined">keyboard_double_arrow_right</span>
      </button>
    </div>

    <div class="menu">
      <router-link class="button" to="/dashboard">
        <span class="material-icons-outlined">dashboard</span>
        <span class="text">Dashboard</span>
      </router-link>
      <router-link class="button" to="/dashboard/medications">
        <span class="material-icons-outlined">medication</span>
        <span class="text">Medications</span>
      </router-link>
      <router-link class="button" to="/dashboard/schedule">
        <span class="material-icons-outlined">calendar_today</span>
        <span class="text">Schedule</span>
      </router-link>
      <router-link class="button" to="/dashboard/drug-info">
        <span class="material-icons-outlined">info</span>
        <span class="text">Drug Information</span>
      </router-link>
      <router-link class="button" to="/dashboard/medicine-price">
        <span class="material-icons-outlined">price_change</span>
        <span class="text">Medication Price</span>
      </router-link>
    </div>

    <div class="flex"></div>

    <div class="menu">
      <router-link class="button" to="/dashboard">
        <span class="material-icons-outlined">person</span>
        <span class="text">Profile</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";

const is_expanded = ref(localStorage.getItem("is_expanded") === "true");

const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value;

  localStorage.setItem("is_expanded", is_expanded.value);
};
</script>

<style lang="scss" scoped>
button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

aside div,
button {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

aside {
  --dark-alt: #334155;
  --primary: #4ade80;
  --secondary: #8353e2;
  --grey: #64748b;
  --dark: #000000;
  --sidebar-width: 300px;

  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  color: #cbc3e3;
  width: calc(2rem + 32px);
  overflow: hidden;
  min-height: 100vh;
  padding: 1rem;
  transition: 0.2s ease-in-out;

  .menu {
    margin: 0 -1rem;

    .button {
      display: flex;
      align-items: center;
      text-decoration: none;

      padding: 0.5rem 1rem;
      transition: 0.2s ease-out;

      .material-icons-outlined {
        font-size: 2rem;
        color: black;
        transition: 0.2s ease-out;
      }

      .text {
        display: none;
        //color: black;
        transition: 0.2s;
      }

      &:hover,
      &.router-link-exact-active {
        background: white;

        .material-icons-outlined,
        .text {
          color: var(--secondary);
        }
      }
      &.router-link-exact-active {
        border-right: 5px solid var(--secondary);
        color: black;
      }
    }
  }
  &.is_expanded {
    width: 220px;
    .menu-toggle-wrap {
      top: -3rem;
      .menu-toggle {
        transform: rotate(-180deg);
      }
    }
    h3,
    .button .text {
      opacity: 1;
      display: inline;
      color: var(--dark-alt);
      transition: 0.2s ease-out;
    }

    .button {
      .material-icons-outlined {
        margin-right: 1rem;
      }
    }

    .logo {
      margin-bottom: 1rem;
      transform: scale(3.6);
      translate: 14.5rem 2rem;
    }
  }
  @media (max-width: 768px) {
    position: fixed;
    z-index: 99;
  }
}

aside .flex {
  flex: 1 1 0;
}

aside .logo {
  margin-bottom: 1rem;
}

aside .logo img {
  widows: 2rem;
}

aside .menu-toggle-wrap {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  position: relative;
  top: 0;
  transition: 0.2s ease-out;
}

aside .menu-toggle-wrap .menu-toggle {
  transition: 0.2s ease-out;
}

aside .menu-toggle-wrap .menu-toggle:hover,
aside .menu-toggle-wrap .router-link-exact-active {
  .material-icons-outlined {
    color: var(--secondary);
    transform: translateX(0.5rem);
  }
}

aside .menu-toggle-wrap .menu-toggle .router-link-exact-active {
  border-right: 5px solid var(--primary);
  color: black;
}

aside .menu-toggle-wrap .menu-toggle .material-icons-outlined {
  font-size: 2rem;
  color: var(black);
  transition: 0.2s ease-out;
}

aside h3,
aside .button .text {
  opacity: 0;
  transition: 0.3s ease-out;
}
</style>
