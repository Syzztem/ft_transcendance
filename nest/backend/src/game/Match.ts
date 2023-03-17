import IBall from './interfaces/IBalls';
import IPaddle from './interfaces/IPaddle';
import ITable from './interfaces/ITable';
import IGameConfig from './interfaces/IGameConfig';
import IScore from './interfaces/IScore';
import { Side, KeyEvent } from './game.gateway';


export default class Match {
    gameConfig: IGameConfig
    ball: IBall
    ownerPaddle: IPaddle
    adversePaddle: IPaddle
    ownerScore: IScore
    adverseScore: IScore
    table: ITable
    id: number
    winner: string
    interval: number

    constructor() {
        this.ownerPaddle = {
            height: 80,
            width: 10,
            pos: 30 ,
            lastPos: 0,
            speed: 1
        }
        this.adversePaddle = {
            height: 80,
            width: 10,
            pos: 30 ,
            lastPos: 0,
            speed: 1
        }
        this.table = {
            width: 858,
            height: 525
        }
        this.ownerScore = {
            maximum: 11,
            score: 0
        }
        this.adverseScore = {
            maximum: 11,
            score: 0
        }
		this.gameConfig = {
			fps: 60,
			framesThisSecond: 0,
			lastFpsUpdate: 0,
			lastFrameTimeMs: 0,
			maxFPS: 360,
			delta: 0,
			keyUp: false,
			keyDown: false,
			frameId: 0,
			gameSpeed: 0.3,
            AKey: false,
            QKey: false,
            running: false,
            started: false,
            mode: '',
            modeButtonText: 'Q/A'
		}
		this.ball = {
			posX: this.table.width / 2,
        	posY: this.table.height / 2,
        	lastPosX: this.table.width / 2,
        	lastPosY: this.table.height / 2,
        	speedX: this.gameConfig.gameSpeed,
        	speedY: this.gameConfig.gameSpeed,
        	ray: 7,
        	hits: 0
		}
        this.initBall()
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
        // if (this.gameConfig.modeButtonText === 'Q/A') {
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
        // } else if (this.adversePaddle.pos != this.ball.posY - this.adversePaddle.height / 2
        //         && this.ball.posY < this.table.height - this.adversePaddle.height / 2 - this.ball.ray * 4
        //         && this.ball.posY > this.ball.ray * 4 + this.adversePaddle.height / 2)
        //     this.adversePaddle.pos = this.ball.posY - this.adversePaddle.height / 2
    }

    public loop(timestamp: number) {
        this.update()
        if (this.ownerScore.score === this.ownerScore.maximum || this.adverseScore.score === this.adverseScore.maximum) {
            this.winner = this.ownerScore.score === this.ownerScore.maximum ? "RIGHT" : "LEFT"
            return
        }
    }

    public updateKey(side: Side, event: KeyEvent, key: string) {
        let isDown: boolean
        
        isDown = (event === KeyEvent.DOWN) ? true : false
        if (side === Side.OWNER) {
            if (key === 'ArrowUp')
                this.gameConfig.keyUp = isDown
            else if (key === 'ArrowDown')
                this.gameConfig.keyDown = isDown
        }
        else {
            if (key === 'ArrowUp')
                this.gameConfig.QKey = isDown
            else if (key === 'ArrowDown')
                this.gameConfig.AKey = isDown
        }
    }

    public update() {
        this.updateBall()
        this.updatePaddle()
    }
}