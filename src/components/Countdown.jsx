import './Countdown.css';

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function Countdown({ alarm, fireTime, countdown }) {
  if (!alarm) {
    return (
      <div className="countdown-container countdown-empty">
        <p>No upcoming alarms. Add one below!</p>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = countdown;

  return (
    <div className="countdown-container">
      <p className="countdown-label">Next Alarm</p>
      <h2 className="countdown-title">{alarm.title}</h2>
      <p className="countdown-datetime">
        {fireTime.toLocaleString()}
      </p>
      <div className="countdown-timer">
        <div className="countdown-unit">
          <span className="countdown-value">{pad(days)}</span>
          <span className="countdown-unit-label">Days</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-unit">
          <span className="countdown-value">{pad(hours)}</span>
          <span className="countdown-unit-label">Hours</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-unit">
          <span className="countdown-value">{pad(minutes)}</span>
          <span className="countdown-unit-label">Minutes</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-unit">
          <span className="countdown-value">{pad(seconds)}</span>
          <span className="countdown-unit-label">Seconds</span>
        </div>
      </div>
    </div>
  );
}
