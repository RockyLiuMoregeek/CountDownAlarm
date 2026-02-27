import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'countdownalarm_alarms';

function loadAlarms() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAlarms(alarms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
}

export function useAlarms() {
  const [alarms, setAlarms] = useState(loadAlarms);

  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);

  const addAlarm = useCallback((alarm) => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const newAlarm = {
      ...alarm,
      id,
      enabled: true,
    };
    setAlarms((prev) => [...prev, newAlarm]);
    return newAlarm;
  }, []);

  const updateAlarm = useCallback((id, updates) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  }, []);

  const deleteAlarm = useCallback((id) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleAlarm = useCallback((id) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  }, []);

  return { alarms, addAlarm, updateAlarm, deleteAlarm, toggleAlarm };
}
