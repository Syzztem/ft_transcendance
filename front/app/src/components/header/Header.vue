<template>
    <v-app-bar elevation="5" color="#000FFF">
        <v-toolbar-title id="logo" style="cursor: pointer" @click="$router.push('/')" dark fixed app>
            POKEPONG
        </v-toolbar-title>
        <v-spacer></v-spacer>
        
            <v-btn>
                <v-icon large color="green darken-2">
                    mdi-domain
                </v-icon>
            </v-btn>

        <v-menu left bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn img v-bind="attrs" v-on="on">
                    <img id="optionsImg" src="@/assets/optionsButton.png"/>
                </v-btn>
            </template>
            <v-list>
                <v-card black color="rgb(0, 75, 255)" width="750" class="pb-3 mb-16">
                <v-list-item v-for="n in 5" :key="n" @click="() => {}">
                    <v-card black color="rgb(0, 75, 255)" width="750" class="pb-3 mb-16">
                    Option {{ n }}
                    </v-card>
                </v-list-item>
            </v-card>
            </v-list>
        </v-menu>
        <!-- <User/> -->
    </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
})
</script>

<style scoped>
#logo {
    font-family: "pokemon";
    color: rgb(255, 200, 0);
    text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 0.2em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
    font-size: 150%;
}

#logo:hover {
  color: rgb(255, 233, 0);
}

#logoBtn {
    width: 27%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    left: 0%;
}
#optionsBtn {
    width: 0%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
}
#optionsImg {
    width: 4vh;
}
</style>