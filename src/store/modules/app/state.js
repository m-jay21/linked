export default () => ({
  language: null,
  theme: null,
  themeColors: {
    light: {
      accent: '#FF005C', // bright-pink
      accentHover: '#D1014C', // pink
      accentDark: '#EF4444' // red-500
    },
    dark: {
      accent: '#FF005C', // bright-pink
      accentHover: '#D1014C', // pink
      accentDark: '#EF4444' // red-500
    },
    caelestia: {
      accent: '#a4d397', // hi_fg / selected_fg
      accentHover: '#5bd0df', // cpu_box / mem_box
      accentDark: '#6dcfa6', // proc_box / net_box
      background: '#11140f', // main_bg
      text: '#e0e4da', // main_fg
      selectedBg: '#1d211b' // selected_bg
    }
  },
  updateInterval: null,
  dataPath: null,
  allowPrerelease: null,
  isSettingsModalOpen: false
})
