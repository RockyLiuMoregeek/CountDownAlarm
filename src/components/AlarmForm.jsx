import { useState, useEffect } from 'react';
import { REPEAT_LABELS } from '../utils/alarmUtils';
import './AlarmForm.css';

const REPEAT_OPTIONS = Object.entries(REPEAT_LABELS);

function toLocalDateTimeInput(isoString) {
  if (!isoString) return '';
  // datetime-local input expects "YYYY-MM-DDTHH:MM"
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AlarmForm({ alarm, onSave, onCancel }) {
  const isEdit = Boolean(alarm);

  const [title, setTitle] = useState(alarm?.title ?? '');
  const [dateTime, setDateTime] = useState(
    alarm ? toLocalDateTimeInput(alarm.dateTime) : ''
  );
  const [repeat, setRepeat] = useState(alarm?.repeat ?? 'once');
  const [error, setError] = useState('');

  useEffect(() => {
    if (alarm) {
      setTitle(alarm.title);
      setDateTime(toLocalDateTimeInput(alarm.dateTime));
      setRepeat(alarm.repeat);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alarm?.id]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!dateTime) {
      setError('Date & time are required.');
      return;
    }
    setError('');
    onSave({
      title: title.trim(),
      dateTime: new Date(dateTime).toISOString(),
      repeat,
    });
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-box">
        <h3 className="modal-title">{isEdit ? 'Edit Alarm' : 'New Alarm'}</h3>
        {error && <p className="form-error">{error}</p>}
        <form onSubmit={handleSubmit} className="alarm-form">
          <label className="form-label">
            Title
            <input
              className="form-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Alarm title"
              maxLength={60}
              autoFocus
            />
          </label>

          <label className="form-label">
            Date &amp; Time
            <input
              className="form-input"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </label>

          <label className="form-label">
            Repeat
            <select
              className="form-input"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
            >
              {REPEAT_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {isEdit ? 'Save' : 'Add Alarm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
