<script>
    import Api from '../Api.js';

    export default {
        mounted() {
            if (!Api.isLoggedIn()) {
                this.$router.push('/');
            }
        }
    };
</script>
  