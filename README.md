# Offline-First Remittance App with Biometric Authentication

A React Native app for secure money transfers with offline support, biometric authentication, and automatic background sync.

## Features

### Core
- Registration with KYC upload via camera
- Send Money flow with mock rate fetch
- Transaction history with status (Created, Completed)

### Offline Support
- Queue transactions locally using SQLite
- Sync automatically:
  - Foreground: on connectivity change
  - Background: every 15 minutes

### Security
- Biometric auth with react-native-keychain
- Jailbreak/root detection
- Idempotent transactions via client-generated IDs

### Notifications
- Push alerts via Firebase Cloud Messaging

## Status

- [x] Registration & KYC
- [x] Send Money flow (mock)
- [x] Biometric authentication
- [x] Jailbreak/root detection
- [x] Offline queueing (SQLite)
- [x] Foreground and background sync
- [x] Push notifications
- [x] Transaction history with status

## System Design

### 1. Offline Sync

- On send:
  - If offline (via NetInfo), cache transaction with status `pending`
- Foreground:
  - Subscribe to connectivity changes, send pending transactions when online
- Background:
  - Use react-native-background-fetch to check connectivity and sync every 15 minutes

### 2. Security
- Store sensitive data (e.g., tokens) using react-native-keychain

### 3. Idempotency
- Use UUIDs to prevent duplicate transaction processing

## Tech Stack

- React Native (Android only)
- Express.js backend ([repo](https://github.com/tmtm8976/tansactions_be))
- SQLite
- Firebase Cloud Messaging
- react-native-background-fetch
- react-native-keychain

## Getting Started

### Prerequisites

- Node.js v22.13.1+
- Android development environment ([docs](https://reactnative.dev/docs/running-on-device))


### Run

```bash
npm install
cd android && ./gradlew clean && cd ..
npm run android
```
# Notes
- android only: background fetch and notifications not supported on iOS
- APK uses ngrok to tunnel to a local backend with necessary credentials

## server
 - the app uses [this](https://github.com/tmtm8976/tansactions_be) repo, you can clone and run to connect it to your app
 However, the apk file provided is using ngrok link forwarding to the running backend on my pc as it includes required credentials for database and firebase

## Tech Stack
- React Native
- Express.js (Backend)
- SQLite
- Firebase Cloud Messaging
- Ngrok (for development tunneling)


## Known Limitations
- iOS support is limited (e.g., no background fetch or push notifications).

