interface IGameConfig {
    fps: number,
    framesThisSecond: number,
    lastFpsUpdate: number,
    lastFrameTimeMs: number,
    maxFPS: number,
    delta: number,
    frameId: number,
    gameSpeed: number,
    keyUp: boolean,
    keyDown: boolean,
    running: boolean,
    started: boolean,
    mode: string,
    /// temporaire /// bot / QA
    AKey: boolean,
    QKey: boolean,
    modeButtonText: string
    ///
}

export default IGameConfig