import IBall from './IBall';
import IPaddle from "./IPaddle";


export default interface Board {
    ball: IBall,
    ownerPaddle: IPaddle,
    adversePaddle: IPaddle
}