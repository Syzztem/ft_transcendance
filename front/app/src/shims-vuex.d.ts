import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import IBall from './models/IBall'
import IGameConfig from './models/IGameConfig'
import IPaddle from './models/IPaddle'
import IPlayer from './models/IPlayer'
import IScore from './models/IScore'
import ITable from './models/ITable'

declare module '@vue/runtime-core' {
  interface State {
    player: IPlayer,
    gameConfig: IGameConfig,
    ball: IBall,
    ownerPaddle: IPaddle,
    adversePaddle: IPaddle,
    ownerScore: IScore,
    adverseScore: IScore,
    table: ITable
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}