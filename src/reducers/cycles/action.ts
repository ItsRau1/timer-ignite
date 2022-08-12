import { Cycle } from './reducer'

export enum ActionTypes {
  addNewCycle = 'addNewCycle',
  interruptCurrentCycle = 'interruptCurrentCycle',
  finishedCycle = 'finishedCycle',
}

export function addNewCycleAction(newCycle: Cycle) {
  return {
    type: ActionTypes.addNewCycle,
    payload: {
      newCycle,
    },
  }
}
export function interruptedCurrentCycleAction() {
  return {
    type: ActionTypes.interruptCurrentCycle,
  }
}

export function markCurrentCycleasFinishedAction() {
  return {
    type: ActionTypes.finishedCycle,
  }
}
