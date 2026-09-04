# Still — Hack for Humanity Summer 2026

**Private, local-first urge interruption and recovery support.**

This repository is the public judging snapshot for **Hack for Humanity Summer 2026**.

## Hackathon scope

Still existed before the hackathon as an early local-first recovery prototype. This submission includes the full runnable app for context, but the hackathon-period work is the work completed **August 7–September 4, 2026**.

Key work completed during the hackathon period includes:

- private recovery dashboard
- on-device progress analytics
- seven-day recovery summaries
- self-reported trigger-frequency insights
- time-of-day pattern insights presented as historical context, not prediction
- offline calming soundscapes
- breathing / interruption reliability improvements
- urge-log persistence and streak-handling fixes
- privacy and local-data deletion hardening
- clearer error, empty, and recovery states

Earlier functionality is included so judges can run and understand the product. It is **not claimed as hackathon-period work**.

## Product boundary

Still is not a diagnostic or treatment product and does not claim to predict a user's mental state or future behavior. It is designed to provide immediate, private interruption and reflection tools while keeping the core experience useful offline.

## Stack

- React Native
- Expo / Expo Router
- TypeScript
- SQLite
- Expo SecureStore
- Expo Local Authentication
- Expo Audio
- Expo Haptics
- Expo Notifications
- Expo Screen Capture
- React Native Reanimated

## Run locally

```bash
npm install
npm run start
```

For Android:

```bash
npm run android
```

## Verify

```bash
npm run verify
```

## Privacy

The core product is local-first. Do not add real user recovery data, credentials, signing keys, keystores, or private environment files to this public repository.

## Hackathon submission

Project: **Still**  
Category focus: **Best Mental Health Tool**  
Demo: see the Devpost submission.
