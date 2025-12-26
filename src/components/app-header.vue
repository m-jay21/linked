<template>
  <!-- Header Start -->
  <header
    class="
      sticky
      top-0
      text-black
      bg-white
      dark:bg-black
      dark:text-white
      select-none
      z-50
    "
  >
    <week-switcher />
    <div class="flex justify-between items-center px-4 pb-2">
      <day-switcher />
      <router-link
        to="/settings"
        class="
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
  </header>
</template>

<script>
import DaySwitcher from '@/components/day-switcher.vue'
import WeekSwitcher from '@/components/week-switcher.vue'

export default {
  components: { DaySwitcher, WeekSwitcher }
}
</script>