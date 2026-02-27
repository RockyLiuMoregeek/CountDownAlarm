import { REPEAT_LABELS } from '../utils/alarmUtils';
import './AlarmList.css';

export default function AlarmList({ alarms, onEdit, onDelete, onToggle }) {
  if (alarms.length === 0) {
    return <p className="alarm-list-empty">No alarms set yet.</p>;
  }

  return (
    <ul className="alarm-list">
      {alarms.map((alarm) => (
        <li key={alarm.id} className={`alarm-item ${alarm.enabled ? '' : 'alarm-item--disabled'}`}>
          <div className="alarm-info">
            <span className="alarm-title">{alarm.title}</span>
            <span className="alarm-datetime">
              {new Date(alarm.dateTime).toLocaleString()}
            </span>
            <span className="alarm-repeat">{REPEAT_LABELS[alarm.repeat] ?? alarm.repeat}</span>
          </div>
          <div className="alarm-actions">
            <button
              className={`btn-toggle ${alarm.enabled ? 'btn-toggle--on' : 'btn-toggle--off'}`}
              onClick={() => onToggle(alarm.id)}
              aria-label={alarm.enabled ? 'Disable alarm' : 'Enable alarm'}
            >
              {alarm.enabled ? 'ON' : 'OFF'}
            </button>
            <button className="btn-edit" onClick={() => onEdit(alarm)} aria-label="Edit alarm">
              Edit
            </button>
            <button className="btn-delete" onClick={() => onDelete(alarm.id)} aria-label="Delete alarm">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
