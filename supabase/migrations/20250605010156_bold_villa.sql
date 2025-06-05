/*
  # Add Profile Policies

  1. Changes
    - Add RLS policies for profiles table to allow:
      - Users to insert their own profile
      - Users to read their own profile
      - Users to update their own profile

  2. Security
    - Enable RLS on profiles table (if not already enabled)
    - Add policies for INSERT, SELECT, and UPDATE operations
*/

-- First ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own profile
CREATE POLICY "Users can create their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);