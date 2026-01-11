<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
    :style="{
      backgroundColor: backdropColor
    }"
    @click.self="closeModal"
  >
    <div
      class="rounded-lg shadow-xl w-96 max-w-[90vw] p-6 border-2 border-accent dark:border-accent-dark"
      :style="{
        backgroundColor: modalBg,
        color: themeText
      }"
      @click.stop
    >
      <!-- Header with month/year and navigation -->
      <div class="flex items-center justify-between mb-4">
        <button
          class="cursor-pointer"
          :style="{ color: accentColor }"
          @click="previousMonth"
        >
          <ArrowLeftIcon />
        </button>
        <span class="text-xl font-black" :style="{ color: themeText }">{{ monthYear }}</span>
        <button
          class="cursor-pointer"
          :style="{ color: accentColor }"
          @click="nextMonth"
        >
          <ArrowRightIcon />
        </button>
      </div>

      <!-- Week day headers -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="day in weekDays"
          :key="day"
          class="text-center text-xs text-gray-400 dark:text-gray-600 font-medium py-2"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar grid -->
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="date in monthDates"
          :key="date.isoDate"
          class="flex justify-center items-center"
        >
          <span
            class="
              flex
              justify-center
              items-center
              w-10
              h-10
              rounded-full
              font-black
              text-xs
              cursor-pointer
              hover:bg-gray-200
              dark:hover:bg-gray-800
            "
            :class="{
              'ring-2': date.isoDate === getCurrentDate
            }"
            :style="getDateStyle(date)"
            @click="selectDate(date.isoDate)"
          >
            {{ date.day }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg'
import { mapGetters, mapActions } from 'vuex'
import {
  Getters as CalendarGetters,
  Actions as CalendarActions
} from '@/store/modules/calendar/types'
import {
  Getters as AppGetters
} from '@/store/modules/app/types'
import { getMonthDates, formatDate } from '@/store/modules/calendar/helper'

export default {
  components: {
    ArrowLeftIcon,
    ArrowRightIcon
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentMonth: null
    }
  },
  computed: {
    ...mapGetters('calendar', [
      CalendarGetters.GET_CURRENT_DATE,
      CalendarGetters.GET_DAYS_WITH_CONTENT
    ]),
    ...mapGetters('app', [AppGetters.GET_THEME_COLORS, AppGetters.GET_THEME]),
    accentColor() {
      const colors = this.getThemeColors
      if (!colors) return '#FF005C'
      // Use accent-dark for dark mode, accent for light mode
      return this.getTheme === 'dark' ? colors.accentDark : colors.accent
    },
    themeText() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.text || '#e0e4da'
      }
      return theme === 'dark' ? '#ffffff' : '#000000'
    },
    modalBg() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        // Use selectedBg for modal (slightly lighter than main background)
        return colors?.selectedBg || colors?.background || '#1d211b'
      }
      return theme === 'dark' ? '#111827' : '#f9fafb'
    },
    backdropColor() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        // Use the background color with some opacity for backdrop
        const bg = colors?.background || '#11140f'
        // Convert hex to rgba with opacity
        const r = parseInt(bg.slice(1, 3), 16)
        const g = parseInt(bg.slice(3, 5), 16)
        const b = parseInt(bg.slice(5, 7), 16)
        return `rgba(${r}, ${g}, ${b}, 0.5)`
      }
      return theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.5)'
    },
    weekDays() {
      // Get week day abbreviations based on locale
      const startOfWeek = DateTime.now().startOf('week')
      const days = []
      for (let i = 0; i < 7; i++) {
        const day = startOfWeek.plus({ days: i })
          .setLocale(localStorage.lang ?? 'en-US')
        days.push(day.toFormat('EEE').charAt(0))
      }
      return days
    },
    monthDates() {
      if (!this.currentMonth) return []
      return getMonthDates(this.currentMonth)
    },
    monthYear() {
      if (!this.currentMonth) return ''
      return formatDate(this.currentMonth, 'MMMM yyyy')
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.currentMonth = this.getCurrentDate
        this.checkMonthDaysWithContent()
      }
    },
    currentMonth() {
      this.checkMonthDaysWithContent()
    }
  },
  methods: {
    ...mapActions('calendar', [
      CalendarActions.SET_DATE,
      CalendarActions.CHECK_DAYS_WITH_CONTENT
    ]),
    hasContent(date) {
      return this.getDaysWithContent.includes(date)
    },
    previousMonth() {
      this.currentMonth = DateTime.fromISO(this.currentMonth)
        .minus({ months: 1 })
        .toISODate()
    },
    nextMonth() {
      this.currentMonth = DateTime.fromISO(this.currentMonth)
        .plus({ months: 1 })
        .toISODate()
    },
    selectDate(date) {
      this.setDate(date)
      this.$emit('close')
    },
    closeModal() {
      this.$emit('close')
    },
    async checkMonthDaysWithContent() {
      if (!this.currentMonth) return
      const dates = this.monthDates
        .filter(d => d.isCurrentMonth)
        .map(d => d.isoDate)
      // Dispatch the action with the dates array
      await this[CalendarActions.CHECK_DAYS_WITH_CONTENT](dates)
    },
    getDateStyle(date) {
      const style = {}
      
      if (date.isoDate === this.getCurrentDate) {
        style.boxShadow = `0 0 0 2px ${this.accentColor}`
      }
      
      // Set text color based on state
      if (!date.isCurrentMonth) {
        style.color = this.getTheme === 'caelestia' ? '#8c9387' : '#9ca3af'
      } else if (date.isCurrentMonth && this.hasContent(date.isoDate)) {
        style.color = this.accentColor
      } else {
        style.color = this.themeText
      }
      
      return style
    },
  },
  mounted() {
    if (this.isOpen) {
      this.currentMonth = this.getCurrentDate
      this.checkMonthDaysWithContent()
    }
  }
}
</script>

