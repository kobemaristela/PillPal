<template>
  <router-link class="button" to="/">
    <span class="material-icons-outlined">logout</span>
    <span class="text" @click="logout">Logout</span>
  </router-link>
</template>
  
  <script>
  import Api from "../Api";

  export default {
    data() {
      return {
      };
    },
    methods: {
      logout() {
        Api.logout();
        this.$router.push("/");
      }
    }
  };
  </script>
  
  <style scoped>
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
    
    aside .menu-toggle-wrap .menu-toggle:hover .material-icons-outlined,
    aside .menu-toggle-wrap .router-link-exact-active .material-icons-outlined {
      color: var(--secondary);
      transform: translateX(0.5rem);
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
    
    aside.is_expanded {
      width: 220px;
    }
    
    aside.is_expanded .menu-toggle-wrap {
      top: -3rem;
    }
    
    aside.is_expanded .menu-toggle-wrap .menu-toggle {
      transform: rotate(-180deg);
    }
    
    aside.is_expanded h3,
    aside.is_expanded .button .text {
      opacity: 1;
      display: inline;
      color: var(--dark-alt);
      transition: 0.2s ease-out;
    }
    
    aside.is_expanded .button .material-icons-outlined {
      margin-right: 1rem;
    }
    
    aside.is_expanded .logo {
      margin-bottom: 1rem;
      transform: scale(3.6);
      translate: 14.5rem 2rem;
    }
    
    .menu {
      --dark-alt: #334155;
      --primary: #4ade80;
      --secondary: #8353e2;
      --grey: #64748b;
      --dark: #000000;
      --sidebar-width: 300px;
    
      margin: 0 -1rem;
    }
    
    .menu .button {
      display: flex;
      align-items: center;
      text-decoration: none;
    
      padding: 0.5rem 1rem;
      transition: 0.2s ease-out;
    }
    
    .menu .button:hover,
    .menu .button.router-link-exact-active {
      background: white;
    }
    
    .menu .button:hover .material-icons-outlined,
    .menu .button:hover .text,
    .menu .button.router-link-exact-active .material-icons-outlined,
    .menu .button.router-link-exact-active .text {
      color: var(--secondary);
    }
    
    .menu .button.router-link-exact-active {
      border-right: 5px solid var(--secondary);
      color: black;
    }
    
    .menu .button .material-icons-outlined {
      font-size: 2rem;
      color: black;
      transition: 0.2s ease-out;
    }
    
    .menu .button .text {
      display: none;
      /* color: black; */
      transition: 0.2s;
    }
  </style>
  