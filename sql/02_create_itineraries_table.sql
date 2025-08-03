-- Create itineraries table for user's travel plans
CREATE TABLE IF NOT EXISTS itineraries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    destination_id TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    destination_type TEXT,
    destination_icon TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'visited', 'cancelled')),
    visit_date DATE,
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5)
);

-- Enable Row Level Security (RLS)
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Create policies for users to only access their own itineraries
CREATE POLICY "Users can view their own itineraries" ON itineraries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own itineraries" ON itineraries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own itineraries" ON itineraries
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own itineraries" ON itineraries
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance on user_id queries
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);

-- Create index for better performance on destination queries
CREATE INDEX IF NOT EXISTS idx_itineraries_destination_id ON itineraries(destination_id);

-- Create index for better performance on date queries
CREATE INDEX IF NOT EXISTS idx_itineraries_added_at ON itineraries(added_at DESC);
