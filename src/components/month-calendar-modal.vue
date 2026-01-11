<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70"
    @click.self="closeModal"
  >
    <div
      class="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-xl w-96 max-w-[90vw] p-6 border border-bright-pink dark:border-red-500"
      @click.stop
    >
      <!-- Header with month/year and navigation -->
      <div class="flex items-center justify-between mb-4">
        <button
          class="text-bright-pink hover:text-red-400 cursor-pointer"
          @click="previousMonth"
        >
          <ArrowLeftIcon />
        </button>
        <span class="text-xl font-black">{{ monthYear }}</span>
        <button
          class="text-bright-pink hover:text-red-400 cursor-pointer"
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
              'text-gray-400 dark:text-gray-600': !date.isCurrentMonth,
              'ring-2 ring-bright-pink': date.isoDate === getCurrentDate,
              'text-bright-pink dark:text-red-500': date.isCurrentMonth && hasContent(date.isoDate),
              'text-black dark:text-white': date.isCurrentMonth && !hasContent(date.isoDate) && date.isoDate !== getCurrentDate
            }"
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
    }
  },
  mounted() {
    if (this.isOpen) {
      this.currentMonth = this.getCurrentDate
      this.checkMonthDaysWithContent()
    }
  }
}
</script>

