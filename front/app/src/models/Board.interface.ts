import IBall from './IBall';
import IPaddle from "./IPaddle";
import Score from "./Score.interface"


export default interface Board {
    ball: IBall,
    ownerPaddle: IPaddle,
    adversePaddle: IPaddle
    scores: Score
}