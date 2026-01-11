import { Getters } from './types'

export default {
  [Getters.GET_CURRENT_DATE](state) {
    return state.currentDate
  },
  [Getters.GET_CURRENT_WEEK](state) {
    return state.currentWeek
  },
  [Getters.GET_DAYS_WITH_CONTENT](state) {
    return state.daysWithContent
  }
}
