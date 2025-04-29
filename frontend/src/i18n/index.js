import { createI18n } from 'vue-i18n'

// List of supported locales
export const supportedLocales = ['en', 'vi']
export const defaultLocale = 'en'

const messages = {
  en: {
    timerSettings: {
      title: 'Title',
      timeLimit: 'Time Limit',
      clockStyle: 'Clock Style',
      saveSettings: 'Save Settings',
      alerts: 'Alerts',
      soundAlert: 'Sound Alert',
      visualAlert: 'Visual Alert',
      warningTime: 'Warning Time',
      timerMode: 'Timer Mode',
      digital: 'Digital',
      icon: 'Icon',
      flipClock: 'Flip Clock',
      showAdvanced: 'Show advanced settings',
      hideAdvanced: 'Hide advanced settings',
    },
    timer: {
      start: 'Start',
      stop: 'Stop',
      reset: 'Reset',
      countdown: 'Countdown',
      stopwatch: 'Stopwatch'
    },
    common: {
      appTitle: 'Hackathon Timer',
      english: 'English',
      vietnamese: 'Vietnamese'
    }
  },
  vi: {
    timerSettings: {
      title: 'Tiêu đề',
      timeLimit: 'Thời gian',
      clockStyle: 'Kiểu đồng hồ',
      saveSettings: 'Lưu cài đặt',
      alerts: 'Cảnh báo',
      soundAlert: 'Cảnh báo âm thanh',
      visualAlert: 'Cảnh báo hình ảnh',
      warningTime: 'Thời gian cảnh báo',
      timerMode: 'Chế độ hẹn giờ',
      digital: 'Số',
      icon: 'Biểu tượng',
      flipClock: 'Đồng hồ lật',
      showAdvanced: 'Hiện cài đặt nâng cao',
      hideAdvanced: 'Ẩn cài đặt nâng cao',
    },
    timer: {
      start: 'Bắt đầu',
      stop: 'Dừng',
      reset: 'Đặt lại',
      countdown: 'Đếm ngược',
      stopwatch: 'Bấm giờ'
    },
    common: {
      appTitle: 'Bộ đếm thời gian Hackathon',
      english: 'Tiếng Anh',
      vietnamese: 'Tiếng Việt'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages
})

export default i18n 