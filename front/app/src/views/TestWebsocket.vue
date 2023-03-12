<template>
    <v-container>
        Hello websocket
        <button @click=hello()>say hello</button>
    </v-container>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import socket from '../websocket'


    export default defineComponent({
        data() {
            return {
                socket: socket
            }
        },
        mounted() {
            this.socket.on("connect_error", (err) => {
                console.log(`connect_error due to ${err.message}`);
            });
        },
        methods: {
            hello(): void {
                this.socket.emit('hello', "Hello From Vue3 !")
            }
        }
    })
</script>
