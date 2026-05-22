/*
  # Create Payments Table

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `student_id` (uuid)
      - `course_id` (uuid)
      - `amount` (numeric)
      - `upi_id` (text)
      - `transaction_id` (text, unique)
      - `status` (text: pending, completed, failed)
      - `payment_date` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `payments` table
*/

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  course_id uuid NOT NULL,
  amount numeric NOT NULL DEFAULT 400,
  upi_id text,
  transaction_id text UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Users can create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);
