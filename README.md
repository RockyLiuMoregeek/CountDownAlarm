# CountDownAlarm

A React web application to manage multiple countdown alarms.

## Features

- **Multiple alarms** – Create, edit, delete, and toggle alarms, each with a title and date/time.
- **Repeat modes** – Each alarm can repeat:
  - *One Time* – fires once at the specified date/time.
  - *Daily* – fires every day at the specified time.
  - *Work Days* – fires Monday–Friday at the specified time.
  - *Weekend* – fires Saturday–Sunday at the specified time.
- **Countdown display** – Shows a live days/hours/minutes/seconds countdown to the next upcoming alarm.
- **Alarm dialog** – When an alarm fires, a dialog appears with a ringtone (Web Audio API). It auto-dismisses after 1 minute, or the user can dismiss it manually.
- **Persistent storage** – All alarms are saved in the browser's `localStorage`.

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

The production output will be in the `dist/` directory.
