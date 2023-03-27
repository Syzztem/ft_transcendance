<template>
    <v-card>
        <template v-slot:title>
            Join {{ channel.admin.username }}'s channel !
        </template>
        <template v-slot:subtitle>
            Chat with x peoples
        </template>
        <v-card-actions>
            <v-form>
                <v-container>
                    <v-text-field v-if="channel.password"
                        label="Password"
                        v-model="channelForm.password"
                    >
                    </v-text-field>
                    <v-btn @click="JoinChannel()" color="primary" variant="tonal" block>
                        Join
                    </v-btn>
                </v-container>
            </v-form>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType  } from 'vue';
import { Channel } from '@/views/ListChat.vue'

export default defineComponent({
    props: {
        channel: {
            type: Object as PropType<Channel>,
            required: true
        }
    },
    data: () => ({
        channelForm: {
            password: ""
        },
    }),
    methods: {
        JoinChannel() {
            console.log(`Join n ${this.channel.id} channel`)
        }
    }
})

</script>

<style scoped>

form{
    display: contents;
}

</style>