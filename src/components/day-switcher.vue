<template>
  <div
    class="
      flex
      justify-center
      items-center
      space-x-4
      z-50
      border-b border-gray-400
      dark:border-gray-800
      py-4
    "
    :style="{
      backgroundColor: themeBg
    }"
  >
    <!-- Previous Week Arrow -->
    <span
      class="cursor-pointer"
      :style="{ color: arrowColor }"
      @click="setDayTo(-7)"
    >
      <ArrowLeftIcon />
    </span>
    
    <!-- Days of the week -->
    <div
      v-for="date in getCurrentWeek"
      :key="date.day"
      class="flex-col justify-center items-center self-center text-center"
    >
      <span
        class="block mb-1 text-xs text-gray-400 dark:text-gray-600"
        :class="{
          'text-accent dark:text-accent-dark': date.isoDate === getCurrentDate
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
            hover:bg-gray-200
            dark:hover:bg-gray-800
          "
          :class="{
            'text-sm mt-1': date.isoDate === getCurrentDate,
            'text-accent dark:text-accent-dark': hasContent(date.isoDate)
          }"
          :style="date.isoDate === getCurrentDate ? { boxShadow: `0 0 0 4px ${accentColor}` } : {}"
          @click="setDate(date.isoDate)"
        >
          {{ date.day }}
        </span>
      </div>
    </div>
    
    <!-- Next Week Arrow -->
    <span
      class="cursor-pointer"
      :style="{ color: arrowColor }"
      @click="setDayTo(7)"
    >
      <ArrowRightIcon />
    </span>
  </div>
</template>

<script>
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

export default {
  components: {
    ArrowLeftIcon,
    ArrowRightIcon
  },
  methods: {
    ...mapActions('calendar', [
      CalendarActions.SET_DATE,
      CalendarActions.SET_DAY_TO,
      CalendarActions.CHECK_DAYS_WITH_CONTENT
    ]),
    hasContent(date) {
      return this.getDaysWithContent.includes(date)
    },
    checkDaysWithContent() {
      this[CalendarActions.CHECK_DAYS_WITH_CONTENT]()
    },
  },
  computed: {
    ...mapGetters('calendar', [
      CalendarGetters.GET_CURRENT_DATE,
      CalendarGetters.GET_CURRENT_WEEK,
      CalendarGetters.GET_DAYS_WITH_CONTENT
    ]),
    ...mapGetters('app', [AppGetters.GET_THEME_COLORS, AppGetters.GET_THEME]),
    arrowColor() {
      const colors = this.getThemeColors
      if (!colors) return '#FF005C'
      const theme = this.getTheme
      // Use accent-dark for dark themes (dark and caelestia), accent for light mode
      return (theme === 'dark' || theme === 'caelestia') ? colors.accentDark : colors.accent
    },
    accentColor() {
      const colors = this.getThemeColors
      if (!colors) return '#FF005C'
      const theme = this.getTheme
      // Use accent-dark for dark themes (dark and caelestia), accent for light mode
      return (theme === 'dark' || theme === 'caelestia') ? colors.accentDark : colors.accent
    },
    themeBg() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.background || '#11140f'
      }
      return theme === 'dark' ? '#000000' : 'transparent'
    }
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
