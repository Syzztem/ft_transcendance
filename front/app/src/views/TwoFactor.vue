<template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';

export default defineComponent({
    data() {
        return {
        }
    },
    mounted() {
    if (store.state.user.id == -1) {
        this.$router.push('/login')
        return
    }
  }
})
</script>

<style scoped>
</style>