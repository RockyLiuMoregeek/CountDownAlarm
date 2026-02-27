import { useState, useEffect, useRef } from 'react';
import { useAlarms } from './hooks/useAlarms';
import { findNextAlarm, formatCountdown, getNextFireTime } from './utils/alarmUtils';
import Countdown from './components/Countdown';
import AlarmList from './components/AlarmList';
import AlarmForm from './components/AlarmForm';
import AlarmDialog from './components/AlarmDialog';
import './App.css';

export default function App() {
  const { alarms, addAlarm, updateAlarm, deleteAlarm, toggleAlarm } = useAlarms();

  // Countdown state
  const [nextAlarm, setNextAlarm] = useState(null);
  const [nextFireTime, setNextFireTime] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState(null);

  // Fired alarm state
  const [firedAlarm, setFiredAlarm] = useState(null);
  const firedIdsRef = useRef(new Set()); // track which alarms have been fired this cycle

  // Tick every second: update countdown and check for fired alarms
  useEffect(() => {
    function tick() {
      const now = new Date();
      const { alarm, fireTime } = findNextAlarm(alarms);
      setNextAlarm(alarm);
      setNextFireTime(fireTime);

      if (fireTime) {
        const diff = fireTime - now;
        setCountdown(formatCountdown(diff));
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }

      // Check each alarm to see if it should fire now (within the current second)
      if (!firedAlarm) {
        for (const a of alarms) {
          if (!a.enabled) continue;
          const ft = getNextFireTime(a);
          if (!ft) continue;
          const diff = ft - now;
          if (diff >= 0 && diff < 1000) {
            const key = `${a.id}-${ft.toISOString()}`;
            if (!firedIdsRef.current.has(key)) {
              firedIdsRef.current.add(key);
              setFiredAlarm(a);
              break;
            }
          }
        }
      }
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [alarms, firedAlarm]);

  function handleSave(data) {
    if (editingAlarm) {
      updateAlarm(editingAlarm.id, data);
    } else {
      addAlarm(data);
    }
    setShowForm(false);
    setEditingAlarm(null);
  }

  function handleEdit(alarm) {
    setEditingAlarm(alarm);
    setShowForm(true);
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingAlarm(null);
  }

  function handleDialogClose() {
    // If one-time alarm, disable it after firing
    if (firedAlarm?.repeat === 'once') {
      updateAlarm(firedAlarm.id, { enabled: false });
    }
    setFiredAlarm(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>⏰ Countdown Alarm</h1>
      </header>

      <main className="app-main">
        <Countdown
          alarm={nextAlarm}
          fireTime={nextFireTime}
          countdown={countdown}
        />

        <section className="alarms-section">
          <div className="section-header">
            <h2>My Alarms</h2>
            <button
              className="btn-add-alarm"
              onClick={() => { setEditingAlarm(null); setShowForm(true); }}
            >
              + Add Alarm
            </button>
          </div>
          <AlarmList
            alarms={alarms}
            onEdit={handleEdit}
            onDelete={deleteAlarm}
            onToggle={toggleAlarm}
          />
        </section>
      </main>

      {showForm && (
        <AlarmForm
          alarm={editingAlarm}
          onSave={handleSave}
          onCancel={handleCancelForm}
        />
      )}

      {firedAlarm && (
        <AlarmDialog alarm={firedAlarm} onClose={handleDialogClose} />
      )}
    </div>
  );
}
