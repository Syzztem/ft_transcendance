import IBall from "./IBalls";
import IPaddle from "./IPaddle";


export default interface Board {
    ball: IBall,
    ownerPaddle: IPaddle,
    adversePaddle: IPaddle
}