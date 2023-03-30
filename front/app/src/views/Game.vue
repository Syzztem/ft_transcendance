<script lang='ts'>
import { Game } from '../controllers/Game'
import { defineComponent } from "vue"
import { socket } from '@/websocket'
import Board from '@/models/Board.interface'

export default defineComponent({
  data() {
    return {
      game: <Game | null> null,
      canvas: <HTMLCanvasElement> document.getElementById('gameCanvas'),
      gameSocket: socket,
      gameId: this.$route.params.id
    }
  },
  methods: {
    quit() {
      this.$router.push('/hub')
    },
    handleKeyUp(e: KeyboardEvent) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown')
        this.gameSocket.emit('keyUp', {gameId: Number(this.$route.params.id), key: e.key})
    },
    handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown')
        this.gameSocket.emit('keyDown', {gameId: Number(this.$route.params.id), key: e.key})

    },
  },
  mounted() {
    this.gameId = this.$route.params.id
    socket
      .on('updateBoard', (response: Board) => {
        this.game?.updateBoard(response)
      })
      .on('endGame', (winner: string) => {
        this.game?.endScreen(winner)
      })
      .emit('joinGame', Number(this.$route.params.id))
 
    this.canvas = <HTMLCanvasElement> document.getElementById('gameCanvas')
    this.game = new Game(this.canvas)
    this.canvas.style.background = this.$store.state.game.colorBackground
    document.addEventListener('keyup', this.handleKeyUp)
    document.addEventListener('keydown', this.handleKeyDown)
    this.game.startLoop()
  },
  unmounted() {
    document.removeEventListener('keyup', this.handleKeyUp)
    document.removeEventListener('keydown', this.handleKeyDown)
    this.gameSocket.emit('leaveGame', Number(this.gameId))
  }
})
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-card height="800" color="transparent" class="mt-16" outlined flat black>
        <canvas id='gameCanvas'></canvas>
      </v-card>
      </v-row>
  </v-container>
</template>

<style scoped>
#gameCanvas {
  padding-left: 0;
  padding-right: 0;
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 800px;
  margin-top: 12%;
}

</style>
