-- TELsTP OmniCognitor Database Schema
-- Complete database setup for unified AI platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Platforms table (ChatGPT, Claude, Gemini, etc.)
CREATE TABLE IF NOT EXISTS platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'chat', 'image', 'audio', 'code', etc.
    description TEXT,
    api_endpoint TEXT,
    is_enabled BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    platform_id UUID REFERENCES platforms(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform_id UUID REFERENCES platforms(id) ON DELETE SET NULL,
    role TEXT NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_workspace_id ON conversations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Sample data for testing
INSERT INTO users (email, username, full_name) VALUES
    ('demo@telstp.com', 'demo_user', 'Demo User'),
    ('admin@telstp.com', 'admin', 'Admin User')
ON CONFLICT (email) DO NOTHING;

INSERT INTO platforms (name, type, description, is_enabled) VALUES
    ('ChatGPT', 'chat', 'OpenAI ChatGPT - Advanced language model', true),
    ('Claude', 'chat', 'Anthropic Claude - AI assistant', true),
    ('Gemini', 'chat', 'Google Gemini - Multimodal AI', true),
    ('DALL-E', 'image', 'OpenAI DALL-E - Image generation', true),
    ('Midjourney', 'image', 'Midjourney - AI art generation', true),
    ('GitHub Copilot', 'code', 'AI pair programming assistant', true),
    ('Stable Diffusion', 'image', 'Open source image generation', true),
    ('Whisper', 'audio', 'OpenAI speech recognition', true)
ON CONFLICT DO NOTHING;

-- Insert sample workspaces
INSERT INTO workspaces (user_id, name, description, is_public)
SELECT 
    u.id,
    'Personal Workspace',
    'My personal AI workspace for daily tasks',
    false
FROM users u
WHERE u.email = 'demo@telstp.com'
ON CONFLICT DO NOTHING;

INSERT INTO workspaces (user_id, name, description, is_public)
SELECT 
    u.id,
    'Team Collaboration',
    'Shared workspace for team projects',
    true
FROM users u
WHERE u.email = 'admin@telstp.com'
ON CONFLICT DO NOTHING;

-- Insert sample conversation
INSERT INTO conversations (workspace_id, user_id, title, platform_id)
SELECT 
    w.id,
    u.id,
    'Getting Started with AI',
    p.id
FROM users u
CROSS JOIN workspaces w
CROSS JOIN platforms p
WHERE u.email = 'demo@telstp.com'
  AND w.name = 'Personal Workspace'
  AND p.name = 'ChatGPT'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert sample messages
INSERT INTO messages (conversation_id, user_id, platform_id, role, content)
SELECT 
    c.id,
    c.user_id,
    c.platform_id,
    'user',
    'Hello! How can I use TELsTP OmniCognitor?'
FROM conversations c
WHERE c.title = 'Getting Started with AI'
ON CONFLICT DO NOTHING;

INSERT INTO messages (conversation_id, user_id, platform_id, role, content)
SELECT 
    c.id,
    c.user_id,
    c.platform_id,
    'assistant',
    'Welcome to TELsTP OmniCognitor! This platform allows you to interact with multiple AI platforms from a single unified interface. You can create workspaces, start conversations, and seamlessly switch between different AI models.'
FROM conversations c
WHERE c.title = 'Getting Started with AI'
ON CONFLICT DO NOTHING;
