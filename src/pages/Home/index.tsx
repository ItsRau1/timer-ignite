import { HandPalm, Play } from 'phosphor-react'

import { HomeContainer, StartCoutdownButton, StopCoutdownButton } from './style'
import { NewCycleForm } from './NewCycleForm'
import { Countdown } from './Countdown'

import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { useContext } from 'react'
import { CyclesContext } from '../../contexts/CyclesContext'

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext)
  const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe o nome de sua tarefa.'),
    time: zod.number().min(1).max(60),
  })
  type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

  const newCycleForm = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      time: 0,
    },
  })
  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: newCycleFormData) {
    createNewCycle(data)
    reset()
  }

  const task = watch('task')
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />
        {activeCycle ? (
          <StopCoutdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCoutdownButton>
        ) : (
          <StartCoutdownButton type="submit" disabled={!task}>
            <Play size={24} />
            Comecar
          </StartCoutdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
