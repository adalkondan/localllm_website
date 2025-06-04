/*
  # Create interviews table and related schemas

  1. New Tables
    - interviews
      - id (uuid, primary key)
      - job_title (text)
      - job_description (text)
      - candidate_name (text)
      - candidate_experience (text)
      - scheduled_time (timestamptz)
      - status (text)
      - interviewer_notes (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title text NOT NULL,
  job_description text NOT NULL,
  candidate_name text NOT NULL,
  candidate_experience text NOT NULL,
  scheduled_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  interviewer_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users"
  ON interviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow update access for authenticated users"
  ON interviews
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);