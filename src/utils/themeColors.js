/**
 * Helper functions for dynamic theme colors
 * Use these instead of hardcoded color classes
 */

export const accentColorClasses = {
  text: 'text-accent',
  textHover: 'text-accent-hover',
  textDark: 'text-accent-dark dark:text-accent-dark',
  bg: 'bg-accent',
  bgHover: 'bg-accent-hover',
  ring: 'ring-accent',
  border: 'border-accent',
  hover: 'hover:text-accent-hover'
}

/**
 * Get dynamic accent color classes based on theme
 * @param {string} type - 'text', 'bg', 'ring', 'border', 'hover'
 * @returns {string} Tailwind class string
 */
export const getAccentClass = (type = 'text') => {
  return accentColorClasses[type] || accentColorClasses.text
}

