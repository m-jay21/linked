<template>
  <div class="flex justify-between items-center align-center pt-6 px-10 mb-2">
    <div class="flex items-center">
      <span class="text-center text-2xl font-black">{{
        formatDate(getCurrentDate, 'MMMM yyyy')
      }}</span>
      <!-- Settings button -->
      <router-link
        to="/settings"
        class="
          ml-4
          flex
          items-center
          justify-center
          w-10
          h-10
          rounded-lg
          hover:bg-gray-100
          dark:hover:bg-gray-800
          text-gray-600
          dark:text-gray-400
          hover:text-bright-pink
          dark:hover:text-bright-pink
          focus:outline-none
          focus:ring-2
          focus:ring-bright-pink
          transition-colors
          cursor-pointer
        "
        :title="$t('settings.title')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </router-link>
    </div>
    <!-- Week switcher -->
    <span
      class="
        text-black
        dark:text-white
        select-none
        flex
        justify-center
        items-center
        align-center
        space-x-1
      "
    >
      <span
        class="text-bright-pink hover:text-red-400 cursor-pointer"
        @click="setDayTo(-7)"
      >
        <ArrowLeftIcon />
      </span>
      <span
        class="text-bright-pink hover:text-red-400 cursor-pointer text-sm font-medium"
        @click="toggleCalendar"
      >
        Calendar
      </span>
      <span
        class="text-bright-pink hover:text-red-400 cursor-pointer"
        @click="setDayTo(7)"
      >
        <ArrowRightIcon />
      </span>
    </span>
  </div>
</template>

<script>
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg'

import { formatDate } from '@/store/modules/calendar/helper'
import { mapActions, mapGetters } from 'vuex'
import {
  Actions as CalendarActions,
  Getters as CalendarGetters
} from '@/store/modules/calendar/types'

export default {
  components: {
    ArrowLeftIcon,
    ArrowRightIcon
  },
  methods: {
    formatDate,
    ...mapActions('calendar', [
      CalendarActions.SET_DAY_TO,
      CalendarActions.TOGGLE_CALENDAR
    ])
  },
  computed: {
    ...mapGetters('calendar', [CalendarGetters.GET_CURRENT_DATE])
  }
}
</script>
