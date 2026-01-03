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
 * Returns an array of date objects for the entire month calendar view
 */
const getMonthDates = (date) => {
  const dt = DateTime.fromISO(date)
  const startOfMonth = dt.startOf('month')
  const endOfMonth = dt.endOf('month')
  const startOfCalendar = startOfMonth.startOf('week')
  const endOfCalendar = endOfMonth.endOf('week')
  
  let days = []
  let current = startOfCalendar
  
  while (current <= endOfCalendar) {
    days.push({
      isoDate: current.toISODate(),
      day: current.toFormat('d'),
      weekDay: current.toFormat('EEE'),
      isCurrentMonth: current.month === dt.month
    })
    current = current.plus({ days: 1 })
  }
  return days
}

export { getToday, setDate, shiftDate, formatDate, getCurrentWeekDates, getMonthDates }
