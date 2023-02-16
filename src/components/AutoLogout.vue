<template>
    <div>
      <router-view />
    </div>
</template>
  
<script>
    import Api from '../Api.js';

    export default {
    data() {
        return {
            timer: null
        };
    },
    mounted() {
        this.startTimer();
        window.addEventListener('mousemove',this.resetTimer);
    },
    unmounted() {
        window.removeEventListener('mousemove',this.resetTimer);
        clearTimeout(this.timer);
    },
    methods: {
        startTimer() {
            this.timer = setTimeout(() => {
                this.logout();
            }, 60000); // 60 sec autologout
        },
        resetTimer() {
            clearTimeout(this.timer);
            this.startTimer();
        },
        logout() {
            Api.logout()
            console.log('User is logged out');
            this.$router.push("/");
        }
    },
    beforeDestroy() {
        clearTimeout(this.timer);
    }
    };
</script>
