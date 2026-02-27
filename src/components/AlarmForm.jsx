import { useState, useEffect, useCallback } from 'react';
import { REPEAT_LABELS, WEEKDAY_LABELS } from '../utils/alarmUtils';
import './AlarmForm.css';

const REPEAT_OPTIONS = Object.entries(REPEAT_LABELS);
// Display order: Sun first (index 0) through Sat (index 6)
const WEEKDAY_OPTIONS = WEEKDAY_LABELS.map((label, index) => ({ label, index }));

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
  const [customDays, setCustomDays] = useState(alarm?.customDays ?? []);
  const [error, setError] = useState('');

  useEffect(() => {
    if (alarm) {
      setTitle(alarm.title);
      setDateTime(toLocalDateTimeInput(alarm.dateTime));
      setRepeat(alarm.repeat);
      setCustomDays(alarm.customDays ?? []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alarm?.id]);

  const handleDayToggle = useCallback((dayIndex) => {
    setCustomDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex]
    );
  }, []);

  function handleRepeatChange(e) {
    const newRepeat = e.target.value;
    setRepeat(newRepeat);
    if (newRepeat !== 'custom') {
      setCustomDays([]);
    }
  }

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
    if (repeat === 'custom' && customDays.length === 0) {
      setError('Please select at least one day.');
      return;
    }
    setError('');
    onSave({
      title: title.trim(),
      dateTime: new Date(dateTime).toISOString(),
      repeat,
      ...(repeat === 'custom' ? { customDays } : {}),
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
              onChange={handleRepeatChange}
            >
              {REPEAT_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          {repeat === 'custom' && (
            <div className="form-label">
              Days
              <div className="weekday-checkboxes">
                {WEEKDAY_OPTIONS.map(({ label, index }) => (
                  <label key={index} className="weekday-checkbox-label">
                    <input
                      type="checkbox"
                      className="weekday-checkbox"
                      checked={customDays.includes(index)}
                      onChange={() => handleDayToggle(index)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          )}

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
