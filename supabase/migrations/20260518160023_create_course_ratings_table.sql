/*
  # Create Course Ratings Table

  1. New Tables
    - `course_ratings`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to auth.users)
      - `course_id` (uuid, foreign key to courses)
      - `rating` (integer, 1-5)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `course_ratings` table
    - Add policy for authenticated users to create their own ratings
    - Add policy for authenticated users to read ratings
*/

CREATE TABLE IF NOT EXISTS course_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);

ALTER TABLE course_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own ratings"
  ON course_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can read ratings"
  ON course_ratings FOR SELECT
  TO authenticated
  USING (true);
