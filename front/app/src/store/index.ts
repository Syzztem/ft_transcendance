import { createStore, Store, useStore as baseUseStore } from 'vuex'
import IPlayer from '../models/IPlayer'
import IBall from '../models/IBall'
import IPaddle from '../models/IPaddle'
import IScore from '../models/IScore'
import ITable from '../models/ITable'
import IGameConfig from '../models/IGameConfig'
import { InjectionKey } from 'vue'

export interface State {
  player:  {
    id: number,
    pseudo: string,
  },
  IGPlayers: IPlayer[],
  gameConfig: {},
  ball: {},
  ownerPaddle: {},
  adversePaddle: {},
  ownerScore: {},
  adverseScore: {},
  table: {}
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    state: {
      player: <IPlayer> {
        id: 0,
        pseudo: ''
    },
    IGPlayers: <Array<IPlayer>>[],
    gameConfig: <IGameConfig>{},
    ball: <IBall>{},
    ownerPaddle: <IPaddle>{},
    adversePaddle: <IPaddle>{},
    ownerScore: <IScore>{},
    adverseScore: <IScore>{},
    table: <ITable>{}
  },
  getters: {
    getPlayer: get => get.player,
    getIGPlayers: get => get.IGPlayers,
    getGameConfig: get => get.gameConfig,
    getBall: get => get.ball,
    getOwnerPaddle: get => get.ownerPaddle,
    getAdversePaddle: get => get.adversePaddle,
    getOwnerScore: get => get.ownerScore,
    getAdverseScore: get => get.adverseScore,
    getTable: get => get.table
  },
    mutations: {
      setPlayer(set, player) {
        set.player = player
    },
    setIGPlayers(set, IGPlayers) {
        set.IGPlayers = IGPlayers
    },
    setGameConfig(set, gameConfig) {
        set.gameConfig = gameConfig
    },
    setBall(set, ball) {
        set.ball = ball
    },
    setOwnerPaddle(set, ownerPaddle) {
        set.ownerPaddle = ownerPaddle
    },
    setAdversePaddle(set, adversePaddle) {
        set.adversePaddle = adversePaddle
    },
    setOwnerScore(set, ownerScore) {
        set.ownerScore = ownerScore
    },
    setAdverseScore(set, adverseScore) {
        set.adverseScore = adverseScore
    },
    setTable(set, table) {
        set.table = table
    }
  },
  actions: {
  },
  modules: {
  }
})

export function useStore () {
  return baseUseStore(key)
}