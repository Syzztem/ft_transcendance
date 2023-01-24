import IBall from '../models/IBall'
import IPaddle from '../models/IPaddle'
import IScore from '../models/IScore'
import ITable from '../models/ITable'
import IPlayer from '../models/IPlayer'
import IGameConfig from '../models/IGameConfig'

export class Game {
    gameConfig: IGameConfig
    ball: IBall
    ownerPaddle: IPaddle
    adversePaddle: IPaddle
    ownerScore: IScore
    adverseScore: IScore
    table: ITable
    context: CanvasRenderingContext2D | null
    id: number
    winner: string

    constructor(canvas: HTMLCanvasElement | null, 
                gameConfig: IGameConfig, 
                ball: IBall, 
                ownerPaddle: IPaddle, 
                adversePaddle: IPaddle, 
                ownerScore: IScore, 
                adverseScore: IScore, 
                table: ITable,
                id: number, 
                players: Array<IPlayer>) {
        canvas!.width = table.width
        canvas!.height = table.height
        this.context = canvas!.getContext('2d')
        this.gameConfig = gameConfig
        this.ball = ball
        this.ownerPaddle = ownerPaddle
        this.adversePaddle = adversePaddle
        this.ownerScore = ownerScore
        this.adverseScore = adverseScore
        this.table = table
        this.id = id
        this.winner = ''
    }

    private initBall() {
        this.ball.posX = this.table.width / 2
        this.ball.posY = this.table.height / 2
        this.ball.lastPosX = this.ball.posX
        this.ball.lastPosY = this.ball.posY
        this.ball.speedX = this.ball.speedX > 0 ? this.gameConfig.gameSpeed : -this.gameConfig.gameSpeed
        this.ball.speedY = 0
        this.ball.hits = 0
    }

    private drawPaddles() {
        this.context!.fillRect(this.table.width - this.ownerPaddle.width - this.table.width / 15, this.ownerPaddle.lastPos + 
                                (this.ownerPaddle.pos - this.ownerPaddle.lastPos),
                                this.ownerPaddle.width, this.ownerPaddle.height)
        this.context!.fillRect(this.table.width / 15, this.adversePaddle.lastPos +
                                (this.adversePaddle.pos - this.adversePaddle.lastPos),
                                this.adversePaddle.width, this.adversePaddle.height)
    }

    private drawBall(multi: number) {
        this.context!.beginPath()
        this.context!.arc(this.ball.lastPosX +
                            (this.ball.posX - this.ball.lastPosX) *
                            multi, this.ball.posY, this.ball.ray, 0, 2 * Math.PI)
        this.context!.fill()
        this.context!.closePath()
    }

    private drawScores() {
        this.context!.fillText(this.ownerScore.score.toString(), this.table.width * 0.6, this.table.height / 5)
        this.context!.fillText(this.adverseScore.score.toString(), this.table.width * 0.3, this.table.height / 5)
    }

    private updateBall() {
        this.ball.lastPosX = this.ball.posX
        this.ball.lastPosY = this.ball.posY
        this.ball.posX += this.ball.speedX * 1000 / 60
        this.ball.posY += this.ball.speedY * 1000 / 60
        if ((this.ball.posX > this.table.width / 15
                    && this.ball.posX < this.table.width / 15 + this.adversePaddle.width
                    && this.ball.speedX < 0 
                    && this.ball.posY > this.adversePaddle.pos
                    && this.ball.posY < this.adversePaddle.pos + this.adversePaddle.height)
                || ( this.ball.posX > this.table.width - this.table.width / 15 - this.ownerPaddle.width
                    && this.ball.posX < this.table.width - this.table.width / 15
                    && this.ball.speedX > 0
                    && this.ball.posY > this.ownerPaddle.pos
                    && this.ball.posY < this.ownerPaddle.pos + this.ownerPaddle.height)) {
            const height = this.ball.posX < this.table.width / 2 ? this.adversePaddle.height : this.ownerPaddle.height
            const pos = this.ball.posX < this.table.width / 2 ? this.adversePaddle.pos : this.ownerPaddle.pos
            if (this.ball.posY <= pos + height / 7)
                this.ball.speedY = -2 * this.gameConfig.gameSpeed
            else if (this.ball.posY >= pos + height / 7 && this.ball.posY <= pos + (height / 7) * 2)
                this.ball.speedY = -1.4 * this.gameConfig.gameSpeed
            else if (this.ball.posY >= pos + (height / 7) * 2 && this.ball.posY <= pos + (height / 7) * 3)
                this.ball.speedY = -0.7 * this.gameConfig.gameSpeed
            else if (this.ball.posY >= pos + (height / 7) * 3 && this.ball.posY <= pos + (height / 7) * 4)
                this.ball.speedY = 0
            else if (this.ball.posY >= pos + (height / 7) * 4 && this.ball.posY <= pos + (height / 7) * 5)
                this.ball.speedY = 0.7 * this.gameConfig.gameSpeed
            else if (this.ball.posY >= pos + (height / 7) * 5 && this.ball.posY <= pos + (height / 7) * 6)
                this.ball.speedY = 1.4 * this.gameConfig.gameSpeed
            else
                this.ball.speedY = 2 * this.gameConfig.gameSpeed
            this.ball.speedX = -this.ball.speedX
            this.ball.hits++
        }
        if (this.ball.hits < 4)
            this.ball.speedX = this.ball.speedX > 0 ? this.gameConfig.gameSpeed : -this.gameConfig.gameSpeed
        else if (this.ball.hits > 11)
            this.ball.speedX = this.ball.speedX > 0 ? this.gameConfig.gameSpeed * 2.1 : -this.gameConfig.gameSpeed * 2.1
        else
            this.ball.speedX = this.ball.speedX > 0 ? this.gameConfig.gameSpeed * 1.6 : -this.gameConfig.gameSpeed * 1.6
        if (this.ball.posY + this.ball.ray * 2 >= this.table.height || this.ball.posY <= 0)
            this.ball.speedY = -this.ball.speedY
        if (this.ball.posX - this.ball.ray >= this.table.width) {
            this.initBall()
            ++this.adverseScore.score
        }
        if (this.ball.posX + this.ball.ray <= 0) {
            this.initBall()
            ++this.ownerScore.score
        }
    }

    private updatePaddle() {
        if (this.gameConfig.keyUp || this.gameConfig.keyDown)
            this.ownerPaddle.lastPos = this.ownerPaddle.pos
        if (this.gameConfig.keyDown && this.ownerPaddle.pos < this.table.height - this.ownerPaddle.height - this.ball.ray * 4)
            this.ownerPaddle.pos += this.ownerPaddle.speed * 1000 / 60
        else if (this.gameConfig.keyDown)
            this.ownerPaddle.pos = this.table.height - this.ownerPaddle.height - this.ball.ray * 4
        if (this.gameConfig.keyUp && this.ownerPaddle.pos > this.ball.ray * 4)
            this.ownerPaddle.pos -= this.ownerPaddle.speed * 1000 / 60
        else if (this.gameConfig.keyUp)
            this.ownerPaddle.pos = this.ball.ray * 4
        /// temporaire /// bot / QA
        if (this.gameConfig.modeButtonText === 'Q/A') {
            if (this.gameConfig.QKey || this.gameConfig.AKey)
                this.adversePaddle.lastPos = this.adversePaddle.pos
            if (this.gameConfig.AKey && this.adversePaddle.pos < this.table.height - this.adversePaddle.height - this.ball.ray * 4)
                this.adversePaddle.pos += this.adversePaddle.speed * 1000 / 60
            else if (this.gameConfig.AKey)
                this.adversePaddle.pos = this.table.height - this.adversePaddle.height - this.ball.ray * 4
            if (this.gameConfig.QKey && this.adversePaddle.pos > this.ball.ray * 4)
                this.adversePaddle.pos -= this.adversePaddle.speed * 1000 / 60
            else if (this.gameConfig.QKey)
                this.adversePaddle.pos = this.ball.ray * 4
        } else if (this.adversePaddle.pos != this.ball.posY - this.adversePaddle.height / 2
                && this.ball.posY < this.table.height - this.adversePaddle.height / 2 - this.ball.ray * 4
                && this.ball.posY > this.ball.ray * 4 + this.adversePaddle.height / 2)
            this.adversePaddle.pos = this.ball.posY - this.adversePaddle.height / 2
        ///
    }

    private beginLoop() {
        this.context!.fillStyle = 'white'
        this.context!.font = '75px monospace'
    }

    private panic() {
        this.gameConfig.delta = 0
        //
        // remettre les variables du jeu en position backend
        //
    }

    private loop(timestamp: number) {
        let panicLimit = 0
        if (timestamp < this.gameConfig.lastFrameTimeMs + (1000 / this.gameConfig.maxFPS)) {
            this.gameConfig.frameId = requestAnimationFrame(this.loop.bind(this))
            return
        }
        this.gameConfig.delta += timestamp - this.gameConfig.lastFrameTimeMs
        this.gameConfig.lastFrameTimeMs = timestamp
        if (timestamp > this.gameConfig.lastFpsUpdate + 1000) {
            this.gameConfig.fps = 0.25 * this.gameConfig.framesThisSecond + 0.75 * this.gameConfig.fps
            this.gameConfig.lastFpsUpdate = timestamp
            this.gameConfig.framesThisSecond = 0
        }
        ++this.gameConfig.framesThisSecond
        while (this.gameConfig.delta >= 1000 / 60) {
            this.update()
            this.gameConfig.delta -= 1000 / 60
            if (++panicLimit > 240) {
                this.panic()
                break
            }
        }
        if (this.ownerScore.score === this.ownerScore.maximum || this.adverseScore.score === this.adverseScore.maximum) {
            this.winner = this.ownerScore.score === this.ownerScore.maximum ? "RIGHT" : "LEFT"
            this.endScreen()
            cancelAnimationFrame(this.gameConfig.frameId)
            return
        }
        this.draw(this.gameConfig.delta / timestamp)
        this.gameConfig.frameId = requestAnimationFrame(this.loop.bind(this))
    }

    private endScreen() {
        this.context!.clearRect(0, 0, this.table.width, this.table.height)
        this.context!.fillText('PLAYER', this.table.width / 3, this.table.height / 4, this.table.width)
        this.context!.fillText(this.winner, this.table.width / 2.5, this.table.height / 2, this.table.width)
        this.context!.fillText("WIN !", this.table.width / 2.5, this.table.height / 1.3, this.table.width)
    }

    private drawSpeedUpPowerUp(x: number, y: number) {
        this.context!.fillStyle = 'red'
        this.context!.beginPath()
        this.context!.arc(x, y, this.ball.ray * 2, 0, 2 * Math.PI)
        this.context!.fill()
        this.context!.closePath()
    }

    private drawWallPowerUp(x: number, y: number) {
        this.context!.fillStyle = 'blue'
        this.context!.beginPath()
        this.context!.arc(x, y, this.ball.ray * 2, 0, 2 * Math.PI)
        this.context!.fill()
        this.context!.closePath()
    }

    private drawShrinkPaddlePowerUp(x: number, y: number) {
        this.context!.fillStyle = 'chartreuse'
        this.context!.beginPath()
        this.context!.arc(x, y, this.ball.ray * 2, 0, 2 * Math.PI)
        this.context!.fill()
        this.context!.closePath()
    }

    private drawInverseControlsPowerUp(x: number, y: number) {
        this.context!.fillStyle = 'pink'
        this.context!.beginPath()
        this.context!.arc(x, y, this.ball.ray * 2, 0, 2 * Math.PI)
        this.context!.fill()
        this.context!.closePath()
    }

    private drawFakeBallPowerUp(x: number, y: number) {
        this.context!.fillStyle = 'white'
        this.context!.beginPath()
        this.context!.arc(x, y, this.ball.ray * 2, 0, 2 * Math.PI)
        this.context!.fill()
        this.context!.closePath()
    }

    private drawGrowPaddlePowerUp(x: number, y: number) {
        this.context!.fillStyle = 'yellow'
        this.context!.beginPath()
        this.context!.arc(x, y, this.ball.ray * 2, 0, 2 * Math.PI)
        this.context!.fill()
        this.context!.closePath()
    }

    public update() {
        this.updateBall()
        this.updatePaddle()
    }

    public draw(multi: number) {
        this.context!.fillStyle = 'white'
        this.context!.clearRect(0, 0, this.table.width, this.table.height)
        for (let i = 0; i <= this.table.height; i += this.table.width / 35)
            this.context!.fillRect(this.table.width / 2 - this.table.width / 70, i, this.table.width / 70, this.table.width / 70)
        this.drawPaddles()
        this.drawBall(multi)
        this.drawScores()
    }

    public startLoop() {
        this.gameConfig.frameId = requestAnimationFrame((timestamp) => {
            this.draw(1)
            this.gameConfig.lastFrameTimeMs = timestamp
            this.gameConfig.lastFpsUpdate = timestamp
            this.gameConfig.framesThisSecond = 0
            this.beginLoop()
            this.gameConfig.frameId = requestAnimationFrame(this.loop.bind(this))
        })
    }
}