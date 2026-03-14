import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function formatDate(date: string | Date, formatStr: string = 'yyyy-MM-dd') {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return date.toString()
    return format(dateObj, formatStr, { locale: zhCN })
  } catch (error) {
    console.error('Error formatting date:', error)
    return date.toString()
  }
}

export function formatDateTime(date: string | Date) {
  return formatDate(date, 'yyyy-MM-dd HH:mm')
}

export function formatRelativeTime(date: string | Date) {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return date.toString()
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: zhCN })
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return date.toString()
  }
}

export function formatAge(birthDate: string | Date) {
  try {
    const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate
    if (!isValid(birth)) return '未知'
    
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age.toString()
  } catch (error) {
    console.error('Error calculating age:', error)
    return '未知'
  }
}

export function isToday(date: string | Date) {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return false
    
    const today = new Date()
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    )
  } catch (error) {
    return false
  }
}

export function isThisWeek(date: string | Date) {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return false
    
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    return dateObj >= weekAgo && dateObj <= today
  } catch (error) {
    return false
  }
}