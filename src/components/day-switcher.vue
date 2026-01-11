<template>
  <div
    class="
      flex
      dark:bg-black
      justify-center
      space-x-4
      z-50
      border-b border-gray-400
      dark:border-gray-800
      py-4
    "
  >
    <template v-for="date in getCurrentWeek">
      <div
        :key="date.day"
        class="flex-col justify-center items-center self-center text-center"
      >
        <span
          class="block mb-1 text-xs text-gray-400 dark:text-gray-600"
          :class="{
            'text-bright-pink dark:text-red-500': date.isoDate === getCurrentDate
          }"
        >
          {{ date.weekDay }}
        </span>
        <div class="flex flex-col items-center">
          <span
            class="
              flex
              justify-center
              items-center
              self-center
              text-center
              w-10
              h-10
              rounded-full
              font-black
              text-xs
              cursor-pointer
              ring-bright-pink
              hover:bg-gray-200
              dark:hover:bg-gray-800
            "
            :class="{
              'ring-4 text-sm': date.isoDate === getCurrentDate,
              'text-bright-pink dark:text-red-500': hasContent(date.isoDate)
            }"
            :key="date.day"
            @click="setDate(date.isoDate)"
          >
            {{ date.day }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  Getters as CalendarGetters,
  Actions as CalendarActions
} from '@/store/modules/calendar/types'

export default {
  methods: {
    ...mapActions('calendar', [
      CalendarActions.SET_DATE,
      CalendarActions.CHECK_DAYS_WITH_CONTENT
    ]),
    hasContent(date) {
      return this.getDaysWithContent.includes(date)
    },
    checkDaysWithContent() {
      this[CalendarActions.CHECK_DAYS_WITH_CONTENT]()
    }
  },
  computed: {
    ...mapGetters('calendar', [
      CalendarGetters.GET_CURRENT_DATE,
      CalendarGetters.GET_CURRENT_WEEK,
      CalendarGetters.GET_DAYS_WITH_CONTENT
    ])
  },
  mounted() {
    this.checkDaysWithContent()
  },
  watch: {
    getCurrentWeek() {
      this.checkDaysWithContent()
    }
  }
}
</script>
