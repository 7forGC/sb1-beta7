export const RINGTONES = {
  message: {
    default: '/sounds/message/default.mp3',
    gentle: '/sounds/message/gentle.mp3',
    pop: '/sounds/message/pop.mp3',
    ding: '/sounds/message/ding.mp3',
    chime: '/sounds/message/chime.mp3'
  },
  call: {
    default: '/sounds/call/default.mp3',
    classic: '/sounds/call/classic.mp3',
    modern: '/sounds/call/modern.mp3',
    minimal: '/sounds/call/minimal.mp3',
    retro: '/sounds/call/retro.mp3'
  },
  notification: {
    default: '/sounds/notification/default.mp3',
    soft: '/sounds/notification/soft.mp3',
    alert: '/sounds/notification/alert.mp3',
    bell: '/sounds/notification/bell.mp3',
    crystal: '/sounds/notification/crystal.mp3'
  }
} as const;

export type RingtoneCategory = keyof typeof RINGTONES;
export type RingtoneName<T extends RingtoneCategory> = keyof typeof RINGTONES[T];