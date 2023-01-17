<template>
    <v-app-bar elevation="5" color="#673AB7">
        <v-btn id="logoBtn" router to="/" color="#673AB7">
            <div id="logo">
                POKEPONG
            </div>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn id="optionsBtn" img>
            <img id="optionsImg" src="@/assets/optionsButton.png"/>
        </v-btn>
        <User/>
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
    text-shadow: 2px 2px 4px rgb(0, 4, 255), 0 0 0em rgb(0, 0, 0), 0 0 0.2em rgb(2, 175, 255);
    font-size: 350%;
    left: 0%;
}
#logoBtn {
    width: 27%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
}
#optionsBtn {
    width: 0%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
}
#optionsImg {
    width: 8vh;
}
</style>