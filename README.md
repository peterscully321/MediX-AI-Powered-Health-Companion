# MediX - Medication Management & Compliance System

A full-stack healthcare application for managing prescriptions, tracking medication adherence, and receiving smart medication reminders. Built with React, Supabase, and Vite.

## Features

- **User Authentication**: Secure email/password authentication with Supabase Auth
- **Prescription Management**: Upload prescription images and automatically extract medication details
- **Medication Tracking**: View all medications from your prescriptions with dosages and instructions
- **Smart Reminders**: Schedule and receive medication reminders for the next 7 days
- **Compliance Analytics**: Track your medication adherence rate and view compliance statistics
- **Beautiful UI**: Modern, responsive design optimized for all devices
- **Row-Level Security**: All data is encrypted and only accessible by authorized users

## Tech Stack

### Frontend
- **React 18**: Modern UI library
- **Vite**: Lightning-fast build tool
- **Supabase JS Client**: Database and authentication
- **Lucide React**: Beautiful icons

### Backend & Database
- **Supabase PostgreSQL**: Serverless Postgres with built-in auth
- **Row-Level Security**: Database-level security policies
- **Real-time Capabilities**: Optional real-time subscriptions

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth.jsx        # Authentication (sign up/sign in)
│   └── Navigation.jsx   # Top navigation bar
├── pages/              # Full page components
│   ├── Dashboard.jsx    # Analytics and prescription overview
│   ├── Upload.jsx       # Prescription upload interface
│   └── Reminders.jsx    # Medication reminders management
├── services/           # Data access layer
│   ├── authService.js   # Authentication operations
│   ├── prescriptionService.js # Prescription CRUD
│   └── reminderService.js # Reminder & compliance tracking
├── lib/
│   └── supabase.js      # Supabase client setup
├── App.jsx             # Main application component
└── main.jsx            # React app entry point
```

## Database Schema

### Core Tables
- **prescriptions** - User prescription documents with OCR-parsed data
- **medications** - Individual medications from prescriptions
- **reminders** - Scheduled medication reminders
- **compliance_events** - Log of taken/skipped doses

All tables have Row-Level Security policies enabled to protect user privacy.

## Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

These are provided by Supabase when you create a new project.

### Development

Start the development server:

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Production Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## How It Works

### 1. Authentication
- New users sign up with email and password
- Existing users log in with their credentials
- Authentication is handled by Supabase Auth with JWT tokens

### 2. Upload Prescriptions
- Users upload prescription images (PNG, JPG, PDF)
- Mock OCR parser extracts medication information
- Medications are saved to the database with dosage and instructions

### 3. Manage Reminders
- View all upcoming reminders for the next 7 days
- Mark medications as "taken" or "skip" as they're due
- Track compliance over time

### 4. View Analytics
- See your medication adherence rate
- View statistics on doses taken vs. skipped
- Track total medications being managed

## API Services

### authService
```javascript
authService.signUp(email, password)
authService.signIn(email, password)
authService.signOut()
authService.getCurrentUser()
authService.onAuthStateChange(callback)
```

### prescriptionService
```javascript
prescriptionService.uploadPrescription(userId, file, parsedData)
prescriptionService.getPrescriptions(userId)
prescriptionService.getPrescriptionById(prescriptionId)
prescriptionService.addMedications(prescriptionId, medications)
```

### reminderService
```javascript
reminderService.createReminder(userId, medicationId, scheduledAt)
reminderService.getReminders(userId, status)
reminderService.getUpcomingReminders(userId, days)
reminderService.updateReminderStatus(reminderId, status)
reminderService.logComplianceEvent(userId, reminderId, action, notes)
reminderService.getComplianceStats(userId, days)
```

## Security & Privacy

- All user data is stored in an encrypted Supabase database
- Row-Level Security policies ensure users can only access their own data
- Authentication is managed by Supabase Auth (OAuth2/JWT)
- Passwords are hashed and never exposed to the frontend
- All API calls are authenticated with JWT tokens

## Compliance Tracking

The system tracks medication adherence with the following metrics:

- **Total Doses**: All reminders scheduled
- **Doses Taken**: Reminders marked as completed
- **Doses Skipped**: Reminders marked as skipped
- **Adherence Rate**: Percentage of doses taken (taken / total * 100)

These metrics are calculated over a configurable period (default: 30 days).

## Future Enhancements

- Real OCR integration (Google Vision, AWS Textract)
- Push notifications for medication reminders
- Multi-language support
- Doctor integration for prescription sharing
- Medication interaction warnings
- PDF prescription support
- Export compliance reports
- Mobile app version
- Voice reminders
- Integration with pharmacy systems

## Development Notes

- The project uses Vite for fast development and building
- React components use functional components with hooks
- CSS is organized per component for maintainability
- Services provide a clean separation between UI and data access
- Supabase handles all backend operations (no separate server needed)

## License

This project is part of the MediX healthcare initiative.
