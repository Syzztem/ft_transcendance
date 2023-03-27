<template>
    <v-container>
        <v-row class="mt-2">
            <v-col>
                <div>
                    <v-card class="py-5">
                        <h3 class="mx-3">Liste des channel</h3>
                        <v-list lines="two">
                            <v-list-item
                                v-for="item in items"
                                :key="item.id"
                                :title="item.name"
                                :subtitle="item.admin.username"
                                @click="clickChannel(item)"
                            >
                            </v-list-item>
                        </v-list>
                    </v-card>
                </div>
            </v-col>
            <v-col>
                <panel-join-chat-vue v-if="isClick" :channel="selectChannel" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PanelJoinChatVue from '@/components/PanelJoinChat.vue';
import { instance as API }  from '@/store'

export interface Channel {
    id: number,
    name: string,
    password?: string,
    admin: {
        username: string
    }
}

export default defineComponent({
    components: {
        PanelJoinChatVue
    },
    data: () => ({
        items: [
            {
                id: 0, 
                name: "channel 1",
                admin: {username: 'pepito'}},
            {
                id: 1, 
                name: "channel 2", 
                password: "mdr",
                admin: {username: 'Linouille'}}
        ] as Channel[],
        selectChannel: {} as Channel,
        isClick: false
    }),
    methods: {
        clickChannel(channel: Channel) {
            console.log(`click: ${channel.id}`)
            this.selectChannel = channel
            this.isClick = true
        }
    },
    mounted() {
        API.get('channel/list').then(response => {
            console.log(`respone : ${response}`)
        })
    },
})
</script> 

<style scoped>

form{
    display: contents;
}

</style>
