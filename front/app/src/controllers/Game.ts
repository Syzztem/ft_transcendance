import IBall from '../models/IBall'
import IPaddle from '../models/IPaddle'
import IScore from '../models/IScore'
import ITable from '../models/ITable'
import IPlayer from '../models/IPlayer'
import Board from '@/models/Board.interface'

export class Game {
    ball: IBall
    ownerPaddle: IPaddle
    adversePaddle: IPaddle
    ownerScore: IScore
    adverseScore: IScore
    table: ITable
    context: CanvasRenderingContext2D | null
    winner: string

    constructor(canvas: HTMLCanvasElement | null) {
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
        this.ball = {
            posX: this.table.width / 2,
            posY: this.table.height / 2,
            lastPosX: this.table.width / 2,
            lastPosY: this.table.height / 2,
            speedX: 0,
            speedY: 0,
            ray: 7,
            hits: 0
        }
        this.winner = ''
        canvas!.width = this.table.width
        canvas!.height = this.table.height
        this.context = canvas!.getContext('2d')
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

    private beginLoop() {
        this.context!.fillStyle = 'white'
        this.context!.font = '75px monospace'
    }

    public endScreen(winner: string) {
        this.winner = winner
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

    public updateBoard(board: Board) {
        this.ownerPaddle = board.ownerPaddle
        this.ball = board.ball
        this.adversePaddle = board.adversePaddle
        this.ownerScore.score = board.scores.owner
        this.adverseScore.score = board.scores.adverse
        this.draw(1)
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
            this.draw(1)
            this.beginLoop()
    }
}