<template>
  <div class="flex space-x-5 mb-4 mt-4">
    <button
      @click="setTheme('light')"
      class="
        flex-1
        h-16
        bg-gray-100
        rounded-lg
        flex
        justify-center
        items-center
        align-center
        text-black
        hover:bg-gray-200
        dark:hover:bg-gray-300
        cursor-pointer
      "
      :class="{'ring-2 ring-accent' : this.getTheme() === 'light'}"
    >
      <SunIcon />
    </button>
    <button
      @click="setTheme('dark')"
      class="
        flex-1
        h-16
        bg-gray-800
        rounded-lg
        flex
        justify-center
        items-center
        align-center
        text-white
        hover:bg-gray-700
        cursor-pointer
      "
      :class="{'ring-2 ring-accent' : this.getTheme() === 'dark'}"
    >
      <MoonIcon />
    </button>
    <button
      @click="setTheme('caelestia')"
      class="
        flex-1
        h-16
        bg-gray-900
        rounded-lg
        flex
        justify-center
        items-center
        align-center
        text-white
        hover:bg-gray-800
        cursor-pointer
        text-xs
        font-black
      "
      :class="{'ring-2 ring-accent' : this.getTheme() === 'caelestia'}"
      title="Dynamic Caelestia"
    >
      Caelestia
    </button>
  </div>
</template>

<script>
import MoonIcon from '@/assets/icons/moon.svg'
import SunIcon from '@/assets/icons/sun.svg'
import { mapActions, mapGetters } from 'vuex'
import { Actions as AppActions, Getters as AppGetters } from '@/store/modules/app/types'

export default {
  components: {
    MoonIcon,
    SunIcon
  },
  methods: {
    ...mapActions('app', [AppActions.SET_THEME]),
    ...mapGetters('app', [AppGetters.GET_THEME])
  }
}
</script>
