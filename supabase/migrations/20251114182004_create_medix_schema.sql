/*
  # MediX Database Schema

  1. New Tables
    - `prescriptions`: Stores uploaded prescriptions
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `uploaded_at` (timestamp)
      - `parsed_data` (jsonb) - contains medications extracted from OCR
      - `original_filename` (text)
      - `created_at` (timestamp)
    
    - `medications`: Individual medications from prescriptions
      - `id` (uuid, primary key)
      - `prescription_id` (uuid, foreign key)
      - `name` (text)
      - `dose` (text)
      - `frequency` (text)
      - `instructions` (text)
      - `created_at` (timestamp)
    
    - `reminders`: Medication reminders
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `medication_id` (uuid, foreign key)
      - `scheduled_at` (timestamp)
      - `status` (text) - 'scheduled', 'taken', 'skipped', 'missed'
      - `created_at` (timestamp)
    
    - `compliance_events`: Track when reminders are taken/missed
      - `id` (uuid, primary key)
      - `reminder_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `action` (text) - 'taken', 'skipped'
      - `timestamp` (timestamp)
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own prescriptions, medications, reminders, and compliance events
    - Service role can manage data for administrative purposes
*/

CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  uploaded_at timestamp DEFAULT now(),
  parsed_data jsonb NOT NULL,
  original_filename text,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  name text NOT NULL,
  dose text,
  frequency text,
  instructions text,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_id uuid NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  scheduled_at timestamp NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'taken', 'skipped', 'missed')),
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS compliance_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id uuid NOT NULL REFERENCES reminders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('taken', 'skipped')),
  timestamp timestamp DEFAULT now(),
  notes text,
  created_at timestamp DEFAULT now()
);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own prescriptions"
  ON prescriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prescriptions"
  ON prescriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view medications from their prescriptions"
  ON medications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM prescriptions
      WHERE prescriptions.id = medications.prescription_id
      AND prescriptions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own reminders"
  ON reminders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders"
  ON reminders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
  ON reminders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own compliance events"
  ON compliance_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own compliance events"
  ON compliance_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_prescriptions_user_id ON prescriptions(user_id);
CREATE INDEX idx_medications_prescription_id ON medications(prescription_id);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_scheduled_at ON reminders(scheduled_at);
CREATE INDEX idx_compliance_events_user_id ON compliance_events(user_id);
CREATE INDEX idx_compliance_events_reminder_id ON compliance_events(reminder_id);
