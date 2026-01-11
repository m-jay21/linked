<template>
  <div class="flex justify-between items-center align-center pt-6 px-10 mb-2">
    <span class="text-center text-2xl font-black">{{
      formatDate(getCurrentDate, 'MMMM yyyy')
    }}</span>
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
        gap-1
      "
    >
      <span
        class="cursor-pointer"
        :style="{ color: arrowColor }"
        @click="setDayTo(-7)"
      >
        <ArrowLeftIcon />
      </span>
      <button
        class="
          px-2
          py-1
          rounded
          text-accent
          dark:text-accent-dark
          hover:bg-gray-200
          dark:hover:bg-gray-800
          cursor-pointer
          font-black
          text-sm
        "
        @click="openCalendar"
      >
        Calendar
      </button>
      <span
        class="cursor-pointer"
        :style="{ color: arrowColor }"
        @click="setDayTo(7)"
      >
        <ArrowRightIcon />
      </span>
      <button
        class="
          p-1
          rounded
          text-accent
          dark:text-accent-dark
          hover:bg-gray-200
          dark:hover:bg-gray-800
          cursor-pointer
          ml-2
        "
        @click="openSettings"
      >
        <SettingsIcon />
      </button>
    </span>
    <month-calendar-modal
      :is-open="isCalendarOpen"
      @close="closeCalendar"
    />
  </div>
</template>

<script>
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg'
import SettingsIcon from '@/assets/icons/settings.svg'
import MonthCalendarModal from '@/components/month-calendar-modal'

import { formatDate } from '@/store/modules/calendar/helper'
import { mapActions, mapGetters } from 'vuex'
import {
  Actions as CalendarActions,
  Getters as CalendarGetters
} from '@/store/modules/calendar/types'
import {
  Getters as AppGetters
} from '@/store/modules/app/types'

export default {
  components: {
    ArrowLeftIcon,
    ArrowRightIcon,
    SettingsIcon,
    MonthCalendarModal
  },
  data() {
    return {
      isCalendarOpen: false
    }
  },
  methods: {
    formatDate,
    ...mapActions('calendar', [CalendarActions.SET_DAY_TO]),
    openCalendar() {
      this.isCalendarOpen = true
    },
    closeCalendar() {
      this.isCalendarOpen = false
    },
    openSettings() {
      this.$router.push('settings')
    }
  },
  computed: {
    ...mapGetters('calendar', [CalendarGetters.GET_CURRENT_DATE]),
    ...mapGetters('app', [AppGetters.GET_THEME_COLORS, AppGetters.GET_THEME]),
    arrowColor() {
      const colors = this.getThemeColors
      if (!colors) return '#FF005C'
      return this.getTheme === 'dark' ? colors.accentDark : colors.accent
    }
  }
}
</script>
