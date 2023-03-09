<template>
    <v-container>
        Hello websocket
        <button @click="clickButton">Say hello</button>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    // sockets
    // methods: {
    //     clickButton() {
    //         console.log('LOL')
    //         // $socket is socket.io-client instance
    //         // this.$socket.emit('hello')
    //     }
    // }
})
</script>