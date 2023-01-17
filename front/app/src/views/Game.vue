<script lang='ts'>
import IGameConfig from '../models/IGameConfig'
import IBall from '../models/IBall'
import IPaddle from '../models/IPaddle'
import IScore from '../models/IScore'
import ITable from '../models/ITable'
import { Game } from '../controllers/Game'
import IPlayer from '@/models/IPlayer'
import { defineComponent } from "vue" 

export default defineComponent({
  data() {
    return {
      game: <Game | null> null,
      canvas: <HTMLCanvasElement> document.getElementById('gameCanvas'),
      winner: '',
      endGame: true,
      gameConfig: Object() as IGameConfig,
      ball: Object() as IBall,
      ownerPaddle: Object() as IPaddle,
      adversePaddle: Object() as IPaddle,
      ownerScore: Object() as IScore,
      adverseScore: Object() as IScore,
      table: Object() as ITable,
      player: Object() as IPlayer,
      /// temporaire /// bot / QA
      modeButtonText: 'BOT'
      ///
    }
  },
  methods: {
    quit() {
      this.$router.push('/hub')
    },
    handleKeyUp(e: KeyboardEvent) {
      if (e.key === 'ArrowUp')
        this.gameConfig.keyUp = false
      if (e.key === 'ArrowDown')
        this.gameConfig.keyDown = false
      /// temporaire /// bot / QA
      if (e.key === 'q')
        this.gameConfig.QKey = false
      if (e.key === 'a')
        this.gameConfig.AKey = false
      ///
    },
    handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowUp')
        this.gameConfig.keyUp = true
      if (e.key === 'ArrowDown')
        this.gameConfig.keyDown = true
      /// temporaire /// bot / QA
      if (e.key === 'q')
        this.gameConfig.QKey = true
      if (e.key === 'a')
        this.gameConfig.AKey = true
      ///
    },
    /// temporaire /// bot / QA
    modeButtonClick() {
      if (this.modeButtonText === 'BOT')
        this.modeButtonText = 'Q/A'
      else
        this.modeButtonText = 'BOT'
      this.gameConfig.modeButtonText = this.modeButtonText
    }
    ///
  },
  mounted() {
    // 
    // temporaire, est censé recevoir les données depuis le backend
    //

    this.ownerPaddle.height = 80
    this.ownerPaddle.width = 10
    this.ownerPaddle.pos = 30
    this.ownerPaddle.lastPos = 0
    this.ownerPaddle.speed = 1
    this.adversePaddle.height = 80
    this.adversePaddle.width = 10
    this.adversePaddle.pos = 30
    this.adversePaddle.lastPos = 0
    this.adversePaddle.speed = 1
    this.table.width = 858
    this.table.height = 525
    this.ownerScore.maximum = 11
    this.ownerScore.score = 0
    this.adverseScore.maximum = 11
    this.adverseScore.score = 0
    this.gameConfig.fps = 60
    this.gameConfig.framesThisSecond = 0
    this.gameConfig.lastFpsUpdate = 0
    this.gameConfig.lastFrameTimeMs = 0
    this.gameConfig.maxFPS = 360
    this.gameConfig.delta = 0
    this.gameConfig.keyUp = false
    this.gameConfig.keyDown = false
    this.gameConfig.frameId = 0
    this.gameConfig.gameSpeed = 0.3
    this.ball.posX = this.table.width / 2
    this.ball.posY = this.table.height / 2
    this.ball.lastPosX = this.ball.posX
    this.ball.lastPosY = this.ball.posY
    this.ball.speedX = this.gameConfig.gameSpeed
    this.ball.speedY = this.gameConfig.gameSpeed
    this.ball.ray = 7
    this.ball.hits = 0
    //
    //
    //
    /// temoraire /// bot / QA
    this.gameConfig.AKey = false
    this.gameConfig.QKey = false
    ///
    this.canvas = <HTMLCanvasElement> document.getElementById('gameCanvas')
    this.game = new Game(this.canvas, this.gameConfig, this.ball, this.ownerPaddle,
        this.adversePaddle, this.ownerScore, this.adverseScore, this.table, this.player.id,
        this.$store.getters.getIGPlayers)
    this.canvas.style.background = 'black'
    document.addEventListener('keyup', this.handleKeyUp)
    document.addEventListener('keydown', this.handleKeyDown)
    this.game.startLoop()
  },
  unmounted() {
    document.removeEventListener('keyup', this.handleKeyUp)
    document.removeEventListener('keydown', this.handleKeyDown)
  }
})
</script>

<template>
    <canvas id='gameCanvas'></canvas>
  <div>
    <button id="modeButton" @click="modeButtonClick">{{ modeButtonText }}</button>
  </div>
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

#modeButton {
  position: absolute;
  top: 85%;
  left: 45%;
}
</style>
