<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click.self="close"
  >
    <div
      class="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-2xl w-full shadow-xl border border-gray-200 dark:border-gray-700 calendar-modal"
      :data-theme="getTheme === 'caelestia' ? 'caelestia' : null"
    >
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-3">
          <button
            type="button"
            class="text-bright-pink hover:text-red-400 dark:hover:text-red-400 cursor-pointer transition-colors"
            @click="navigateMonth(-1)"
          >
            <ArrowLeftIcon />
          </button>
          <span class="text-2xl font-black text-black dark:text-white min-w-[180px] text-center">
            {{ formatDate(getCurrentDate, 'MMMM yyyy') }}
          </span>
          <button
            type="button"
            class="text-bright-pink hover:text-red-400 dark:hover:text-red-400 cursor-pointer transition-colors"
            @click="navigateMonth(1)"
          >
            <ArrowRightIcon />
          </button>
        </div>
        <button
          @click="close"
          class="
            text-gray-600
            dark:text-gray-400
            hover:text-bright-pink
            dark:hover:text-bright-pink
            text-3xl
            leading-none
            w-8
            h-8
            flex
            items-center
            justify-center
            rounded
            hover:bg-gray-100
            dark:hover:bg-gray-800
          "
        >
          ×
        </button>
      </div>
      
      <!-- Day headers -->
      <div class="grid grid-cols-7 gap-2 mb-2">
        <div
          v-for="day in weekDays"
          :key="day"
          class="text-center text-xs font-bold text-gray-500 dark:text-gray-400 py-2"
        >
          {{ day }}
        </div>
      </div>
      
      <!-- Calendar days -->
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="date in monthDates"
          :key="date.isoDate"
          class="
            w-12
            h-12
            flex
            items-center
            justify-center
            rounded-lg
            cursor-pointer
            text-base
            font-black
            transition-colors
          "
          :class="{
            'text-gray-400 dark:text-gray-600': !date.isCurrentMonth,
            'text-black dark:text-gray-200': date.isCurrentMonth && !isSelected(date.isoDate) && !hasContent(date.isoDate),
            'text-bright-pink dark:text-red-400': hasContent(date.isoDate) && date.isCurrentMonth && !isSelected(date.isoDate),
            'bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-bold': isSelected(date.isoDate),
            'hover:bg-gray-100 dark:hover:bg-gray-800': date.isCurrentMonth && !isSelected(date.isoDate)
          }"
          @click="selectDate(date.isoDate)"
        >
          {{ date.day }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  Getters as CalendarGetters,
  Actions as CalendarActions
} from '@/store/modules/calendar/types'
import {
  Getters as AppGetters
} from '@/store/modules/app/types'
import { getMonthDates, formatDate as formatDateHelper } from '@/store/modules/calendar/helper'
import { DateTime } from 'luxon'
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg'

export default {
  components: {
    ArrowLeftIcon,
    ArrowRightIcon
  },
  methods: {
    formatDate(date, format) {
      return formatDateHelper(date, format)
    },
    ...mapActions('calendar', [
      CalendarActions.SET_DATE,
      CalendarActions.TOGGLE_CALENDAR
    ]),
    close() {
      this.toggleCalendar()
    },
    selectDate(date) {
      const dateObj = this.monthDates.find(d => d.isoDate === date)
      if (!dateObj || !dateObj.isCurrentMonth) {
        return
      }
      this.setDate(date)
      this.close()
    },
    isSelected(date) {
      return date === this.getCurrentDate
    },
    hasContent(date) {
      return this.getDaysWithContent.includes(date)
    },
    navigateMonth(direction) {
      const current = DateTime.fromISO(this.getCurrentDate)
      const newDate = current.plus({ months: direction }).toISODate()
      this.setDate(newDate)
    },
    getIpcRenderer() {
      if (typeof window !== 'undefined' && window.require) {
        return window.require('electron').ipcRenderer
      }
      if (typeof require !== 'undefined') {
        return require('electron').ipcRenderer
      }
      return null
    }
  },
  computed: {
    ...mapGetters('calendar', [
      CalendarGetters.GET_CURRENT_DATE,
      CalendarGetters.GET_DAYS_WITH_CONTENT
    ]),
    ...mapGetters('app', [AppGetters.GET_THEME]),
    weekDays() {
      const locale = localStorage.lang || 'en-US'
      const startOfWeek = DateTime.now().startOf('week').setLocale(locale)
      const days = []
      for (let i = 0; i < 7; i++) {
        days.push(startOfWeek.plus({ days: i }).toFormat('EEE'))
      }
      return days
    },
    monthDates() {
      return getMonthDates(this.getCurrentDate)
    }
  },
  mounted() {
    // Check all days in month for content
    const dates = this.monthDates
      .filter(d => d.isCurrentMonth)
      .map(d => d.isoDate)
    
    const ipcRenderer = this.getIpcRenderer()
    if (ipcRenderer && dates.length > 0) {
      ipcRenderer.invoke('CHECK_DAYS_WITH_CONTENT', dates).then(daysWithContent => {
        // Merge with existing days with content
        const allDays = [...new Set([...this.getDaysWithContent, ...daysWithContent])]
        this.$store.commit('calendar/SET_DAYS_WITH_CONTENT', allDays)
      })
    }
  }
}
</script>

