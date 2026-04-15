-- AutoCFO — Supabase Schema
-- Run this in the Supabase SQL Editor to create all tables

-- 1. businesses
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  business_name TEXT NOT NULL,
  gst_number TEXT,
  industry TEXT,
  revenue_range TEXT,
  bank TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id TEXT NOT NULL,
  date DATE NOT NULL,
  amount FLOAT NOT NULL,
  type TEXT CHECK (type IN ('credit', 'debit')),
  category TEXT CHECK (category IN ('vendor', 'client', 'gst', 'salary', 'upi')),
  description TEXT,
  source TEXT CHECK (source IN ('bank', 'upi', 'gst')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. risks
CREATE TABLE IF NOT EXISTS risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id TEXT NOT NULL,
  risk_type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('high', 'medium', 'low')),
  description TEXT,
  recommended_action TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. actions_log
CREATE TABLE IF NOT EXISTS actions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('completed', 'pending', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. whatsapp_messages
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id TEXT NOT NULL,
  message_body TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT
);

-- Enable Row Level Security on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Optional: Allow all access for service role (use in backend with service key)
-- These policies let your FastAPI backend (with service role key) read/write freely.
CREATE POLICY "Service role full access" ON businesses FOR ALL USING (true);
CREATE POLICY "Service role full access" ON transactions FOR ALL USING (true);
CREATE POLICY "Service role full access" ON risks FOR ALL USING (true);
CREATE POLICY "Service role full access" ON actions_log FOR ALL USING (true);
CREATE POLICY "Service role full access" ON whatsapp_messages FOR ALL USING (true);