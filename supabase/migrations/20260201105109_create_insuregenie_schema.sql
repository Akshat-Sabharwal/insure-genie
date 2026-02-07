/*
  # InsureGenie Database Schema

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key) - Unique conversation identifier
      - `session_id` (text) - Browser session identifier
      - `conversation_type` (text) - Type: 'claims' or 'recommendation'
      - `context` (jsonb) - Additional context data (document info, purchase details, etc.)
      - `created_at` (timestamptz) - Conversation creation time
      - `updated_at` (timestamptz) - Last update time

    - `messages`
      - `id` (uuid, primary key) - Unique message identifier
      - `conversation_id` (uuid, foreign key) - Reference to conversation
      - `role` (text) - Message role: 'user' or 'assistant'
      - `content` (text) - Message content
      - `metadata` (jsonb) - Additional message metadata (attachments, formatting, etc.)
      - `created_at` (timestamptz) - Message creation time

    - `documents`
      - `id` (uuid, primary key) - Unique document identifier
      - `conversation_id` (uuid, foreign key) - Reference to conversation
      - `file_name` (text) - Original file name
      - `file_type` (text) - MIME type
      - `file_size` (integer) - File size in bytes
      - `storage_path` (text) - Path in storage system
      - `extracted_data` (jsonb) - Extracted information from document
      - `created_at` (timestamptz) - Upload time

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since no auth for now)
    
  3. Indexes
    - Add index on conversation_id for messages and documents
    - Add index on session_id for conversations
*/

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  conversation_type text NOT NULL CHECK (conversation_type IN ('claims', 'recommendation')),
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  storage_path text NOT NULL,
  extracted_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_conversation_id ON documents(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to conversations"
  ON conversations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to conversations"
  ON conversations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to conversations"
  ON conversations FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to messages"
  ON messages FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to messages"
  ON messages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to documents"
  ON documents FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to documents"
  ON documents FOR INSERT
  TO anon
  WITH CHECK (true);