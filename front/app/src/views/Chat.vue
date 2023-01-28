<template>
    <div>
        <h1>
            {{ msg }}
        </h1>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios'

export default defineComponent({
    data() {
        return {
            msg: ''
        }
    },
    mounted() {
        axios.get('http://localhost:5432/')
        .then((response) => {
            this.msg = response.data.title
        })
    }
})
</script>

<style scoped>
h1 {
    margin-top: 30%
}
</style>