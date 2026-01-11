import { DateTime } from 'luxon'

const getToday = () => {
  return DateTime.now().toISODate()
}

/**
 * Set the current day by click.
 * @param {*} date
 * @returns
 */
const setDate = (date) => {
  return DateTime.fromISO(date).toISODate()
}

/**
 * Takes in any integer and shifts the date by the value of the integer. Returns a normal date string.
 * @param {number} date
 * @param {string} days
 * @returns {string} date
 */
const shiftDate = (date, days) => {
  return DateTime.fromISO(date).plus({ days: days }).toISODate()
}

/**
 * Format a date into any string.
 * @param {string} date
 * @param {string} format
 * @returns {string}
 */
const formatDate = (date, format) => {
  return DateTime.fromISO(date)
    .setLocale(localStorage.lang ?? 'en-US')
    .toFormat(format)
}

/**
 * Returns an array of date strings in YYYY-mm-dd for the current active week
 */
const getCurrentWeekDates = (date) => {
  let week = []
  const startOfWeek = DateTime.fromISO(date).startOf('week')

  for (let i = 0; i <= 6; i++) {
    let day = startOfWeek
      .plus({ days: i })
      .setLocale(localStorage.lang ?? 'en-US')
    week.push({
      isoDate: day.toISODate(),
      day: day.toFormat('d'),
      weekDay: day.toFormat('EEE')
    })
  }
  return week
}

/**
 * Returns an array of all dates in a month, including padding days from previous/next month
 * @param {string} date - ISO date string
 * @returns {Array} Array of date objects with isoDate, day, and isCurrentMonth flag
 */
const getMonthDates = (date) => {
  const monthStart = DateTime.fromISO(date).startOf('month')
  const monthEnd = DateTime.fromISO(date).endOf('month')
  const calendarStart = monthStart.startOf('week')
  const calendarEnd = monthEnd.endOf('week')
  
  let dates = []
  let current = calendarStart
  
  while (current <= calendarEnd) {
    const isCurrentMonth = current.month === monthStart.month
    dates.push({
      isoDate: current.toISODate(),
      day: current.toFormat('d'),
      weekDay: current.toFormat('EEE'),
      isCurrentMonth: isCurrentMonth
    })
    current = current.plus({ days: 1 })
  }
  
  return dates
}

export { getToday, setDate, shiftDate, formatDate, getCurrentWeekDates, getMonthDates }
