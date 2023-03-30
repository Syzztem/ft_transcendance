<script lang="ts">
import store from '@/store';
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
    }
  }
})
</script>

<template>
	<v-container id="menu" class="justify-center">
	  <v-row class="colmenu">
		  <div class="btnSpacer"></div>
		  <div class="btnContainer">
			  <v-btn router :to="'/hub'" class="btn" rounded flat>
			  <p class="p">
				  GAME
			  </p>
			  </v-btn>
			  <v-btn router :to="'/chat'" class="btn" rounded flat>
					  <p class="p">
					  CHAT
					  </p>
			  </v-btn>
			  <v-btn router :to="'/hall'" class="btn" rounded flat>
			  <p class="p">
				  HALL OF FAME
			  </p>
			  </v-btn>
		  </div>
		  <div class="btnSpacer"></div>
	  </v-row>
	</v-container>
  </template>

<style scoped>

.mainClass {
	width: 50vw!important;
}

</style>

<style>
@import '~@/assets/fonts/stylesheet.css';

.btnSpacer {
	flex-grow:			1;
}

.btnContainer {
	display: 			flex;
	flex-direction:		column;
	justify-content:	space-between;
	align-items: 		stretch;
	gap: 				20px;
	flex-grow:			1;
}

.colmenu {
	display:			flex;
	flex-direction:		column;
	justify-content:	center;
	align-items: 		stretch;
	flex-basis: 		1!important;
	flex-grow: 			1!important;
	gap: 				10px;
	margin: 			0px!important;
}

#menu {
	display:			flex;
	flex-direction:		row;
	justify-content:	center;
	align-items:		stretch;
	width:				36vw!important;
	padding:			0px;
	margin:				0px;
}
</style>
