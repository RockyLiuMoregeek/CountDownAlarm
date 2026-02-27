import { useEffect, useState } from 'react';
import { startAlarmSound, stopAlarmSound } from '../utils/audioUtils';
import './AlarmDialog.css';

const DIALOG_DURATION_MS = 60 * 1000; // 1 minute

export default function AlarmDialog({ alarm, onClose }) {
  const [remaining, setRemaining] = useState(DIALOG_DURATION_MS);

  useEffect(() => {
    startAlarmSound();

    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const left = Math.max(0, DIALOG_DURATION_MS - elapsed);
      setRemaining(left);
      if (left === 0) {
        clearInterval(tick);
        stopAlarmSound();
        onClose();
      }
    }, 500);

    return () => {
      clearInterval(tick);
      stopAlarmSound();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCancel() {
    stopAlarmSound();
    onClose();
  }

  const secs = Math.ceil(remaining / 1000);

  return (
    <div className="dialog-overlay" role="alertdialog" aria-modal="true">
      <div className="dialog-box">
        <div className="dialog-icon">🔔</div>
        <h2 className="dialog-alarm-title">{alarm.title}</h2>
        <p className="dialog-message">Alarm is ringing!</p>
        <p className="dialog-countdown">
          Auto-dismiss in <strong>{secs}s</strong>
        </p>
        <button className="btn-dismiss" onClick={handleCancel}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
