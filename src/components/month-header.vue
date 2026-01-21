<template>
  <div class="flex justify-between items-center align-center pt-6 px-10 mb-2">
    <span 
      class="text-center text-2xl font-black"
      :style="{ color: themeText }"
    >{{
      formatDate(getCurrentDate, 'MMMM yyyy')
    }}</span>
    <!-- Calendar and Settings buttons -->
    <span
      class="
        select-none
        flex
        justify-center
        items-center
        align-center
        gap-1
      "
    >
      <button
        class="
          p-1
          rounded
          text-accent
          dark:text-accent-dark
          hover:bg-gray-200
          dark:hover:bg-gray-800
          cursor-pointer
        "
        @click="openCalendar"
      >
        <CalendarIcon />
      </button>
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
import SettingsIcon from '@/assets/icons/settings.svg'
import CalendarIcon from '@/assets/icons/calendar.svg'
import MonthCalendarModal from '@/components/month-calendar-modal'

import { formatDate } from '@/store/modules/calendar/helper'
import { mapGetters } from 'vuex'
import {
  Getters as CalendarGetters
} from '@/store/modules/calendar/types'
import {
  Getters as AppGetters
} from '@/store/modules/app/types'

export default {
  components: {
    SettingsIcon,
    CalendarIcon,
    MonthCalendarModal
  },
  data() {
    return {
      isCalendarOpen: false
    }
  },
  methods: {
    formatDate,
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
    themeText() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.text || '#e0e4da'
      }
      return theme === 'dark' ? '#ffffff' : '#000000'
    }
  }
}
</script>

