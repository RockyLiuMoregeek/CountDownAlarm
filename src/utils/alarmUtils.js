/**
 * Compute the next fire time for a given alarm.
 * Returns a Date or null if the alarm won't fire (e.g. one-time alarm in the past).
 */
export function getNextFireTime(alarm) {
  const now = new Date();
  const alarmDate = new Date(alarm.dateTime);

  if (alarm.repeat === 'once') {
    return alarmDate > now ? alarmDate : null;
  }

  const hours = alarmDate.getHours();
  const minutes = alarmDate.getMinutes();
  const seconds = alarmDate.getSeconds();

  // Build a candidate starting from today at the alarm's time
  let candidate = new Date(now);
  candidate.setHours(hours, minutes, seconds, 0);

  // If that moment has already passed today, move to tomorrow
  if (candidate <= now) {
    candidate.setDate(candidate.getDate() + 1);
  }

  if (alarm.repeat === 'daily') {
    return candidate;
  }

  // Walk forward at most 7 days to find a matching weekday
  for (let i = 0; i < 7; i++) {
    const day = candidate.getDay(); // 0=Sun … 6=Sat
    if (alarm.repeat === 'workday' && day >= 1 && day <= 5) return candidate;
    if (alarm.repeat === 'weekend' && (day === 0 || day === 6)) return candidate;
    candidate = new Date(candidate);
    candidate.setDate(candidate.getDate() + 1);
  }

  return null;
}

/**
 * Given a millisecond duration, return { days, hours, minutes, seconds }.
 */
export function formatCountdown(ms) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

/**
 * Find the alarm with the soonest next fire time.
 */
export function findNextAlarm(alarms) {
  let soonest = null;
  let soonestTime = null;

  for (const alarm of alarms) {
    if (!alarm.enabled) continue;
    const t = getNextFireTime(alarm);
    if (t === null) continue;
    if (soonestTime === null || t < soonestTime) {
      soonest = alarm;
      soonestTime = t;
    }
  }

  return { alarm: soonest, fireTime: soonestTime };
}

export const REPEAT_LABELS = {
  once: 'One Time',
  daily: 'Daily',
  workday: 'Work Days (Mon–Fri)',
  weekend: 'Weekend (Sat–Sun)',
};
