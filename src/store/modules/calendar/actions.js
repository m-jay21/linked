import { Actions, Mutations, Getters } from '@/store/modules/calendar/types'
import {
  shiftDate,
  setDate,
  getToday,
  getCurrentWeekDates
} from '@/store/modules/calendar/helper'

// Get ipcRenderer lazily (available in Electron renderer with nodeIntegration: true)
const getIpcRenderer = () => {
  if (typeof window !== 'undefined' && window.require) {
    return window.require('electron').ipcRenderer
  }
  if (typeof require !== 'undefined') {
    return require('electron').ipcRenderer
  }
  return null
}

export default {
  [Actions.SET_DATE](context, date = setDate(getToday())) {
    context.commit(Mutations.SET_DATE, setDate(date))
  },
  [Actions.SET_DAY_TO](context, days) {
    context.commit(
      Mutations.SET_DATE,
      shiftDate(context.getters[Getters.GET_CURRENT_DATE], days)
    )
  },
  [Actions.SET_CURRENT_WEEK](context) {
    context.commit(
      Mutations.SET_CURRENT_WEEK,
      getCurrentWeekDates(context.getters[Getters.GET_CURRENT_DATE])
    )
  },
  async [Actions.CHECK_DAYS_WITH_CONTENT](context) {
    const ipcRenderer = getIpcRenderer()
    if (!ipcRenderer) {
      context.commit(Mutations.SET_DAYS_WITH_CONTENT, [])
      return
    }
    const week = context.getters[Getters.GET_CURRENT_WEEK]
    const dates = week.map(day => day.isoDate)
    const daysWithContent = await ipcRenderer.invoke('CHECK_DAYS_WITH_CONTENT', dates)
    context.commit(Mutations.SET_DAYS_WITH_CONTENT, daysWithContent)
  }
}
