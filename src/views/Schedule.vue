<template>
  <div class="app">
    <Sidebar />
	<h1>Schedule</h1>
  </div>
  

</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
</script>
 
<style lang="scss">
:root {
	--primary: #4ade80;
	--secondary: #8353E2;
	--grey: #64748b;
	--dark: #000000;
	--dark-alt: #334155;
	--light: #CBC3E3;
	--sidebar-width: 300px;
	--background-color: white
}
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: 'Fira sans', sans-serif;
}
body {
	background: var(white);
}
button {
	cursor: pointer;
	appearance: none;
	border: none;
	outline: none;
	background: none;
}
.app {
	background: var(white);
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