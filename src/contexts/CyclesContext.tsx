import { differenceInSeconds } from 'date-fns/esm'
import {
  createContext,
  ReactNode,
  useState,
  useReducer,
  useEffect,
} from 'react'
import {
  ActionTypes,
  addNewCycleAction,
  interruptedCurrentCycleAction,
  markCurrentCycleasFinishedAction,
} from '../reducers/cycles/action'
import { Cycle, cycleReducer, CyclesState } from '../reducers/cycles/reducer'
interface CreateCycleData {
  task: string
  time: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
  amountSecondsPassed: number
  setSecondsPast: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext<CyclesContextType>({})

interface CyclesContextProviderProps {
children: ReactNode
}


const initialValue: CyclesState = { cycles: [], activeCycleId: null }

function init(initialValue: CyclesState) {
  const storedStateAsJSON = localStorage.getItem(
    '@ignite-timer:cycles-state-1.0.0',
    )
    if (storedStateAsJSON) {
      return JSON.parse(storedStateAsJSON)
    } else {
      return initialValue
    }
  }
  
  
  export function CyclesContextProvider({ children }){

    const [cyclesState, dispatch] = useReducer( cycleReducer, initialValue, init )
    const { cycles, activeCycleId } = cyclesState
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  
  const [amountSecondsPassed, setamountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }
    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    if (cyclesState.cycles.length !== 0) {
      localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
    }
  }, [cyclesState])
  
  function setSecondsPast(seconds: number) {
    setamountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    
    const newCycle: Cycle = {
      id,
      task: data.task,
      time: data.time,
      startDate: new Date(),
    }
    dispatch(addNewCycleAction(newCycle))
    setamountSecondsPassed(0)
  }
  function interruptCurrentCycle() {
    dispatch(interruptedCurrentCycleAction())
  }
  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleasFinishedAction())
  }

  return (
    <CyclesContext.Provider value={{ cycles, activeCycle, activeCycleId, amountSecondsPassed, markCurrentCycleAsFinished, setSecondsPast, createNewCycle, interruptCurrentCycle }}>
      {children}
    </CyclesContext.Provider>
  )
}