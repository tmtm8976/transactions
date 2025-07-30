# Offline-First Remittance App with Biometric Authentication

A React Native app for secure money transfers that works offline, supports biometric authentication, and syncs data when online.

## Features

### Core Functionality
- Registration and KYC upload via camera
- Send Money flow with mock Cybrid rate fetch
- Transaction history with real-time status (Created, Completed) – pending

### Offline Support
- Queue transactions locally (SQLite/WatermelonDB) – pending
- Sync when connectivity resumes – pending

### Security
- Biometric auth via react-native-keychain
- Jailbreak/root detection

### Notifications
- Firebase push alerts for transaction updates – pending

## TODO

### Completed
- [x] Registration & KYC upload
- [x] Send Money flow (mock rate)
- [x] Biometric authentication
- [x] Jailbreak detection

### Pending
- [ ] Transaction history with status updates
- [ ] Offline queueing (SQLite/WatermelonDB)
- [ ] Sync on reconnect
- [ ] Firebase push notifications
