-- Migration script لإنشاء جدول itineraries
-- يمكن تشغيل هذا في Supabase SQL editor

CREATE TABLE IF NOT EXISTS itineraries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    destination_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_destination_id ON itineraries(destination_id);

-- إنشاء فهرس مركب لتجنب التكرار
CREATE UNIQUE INDEX IF NOT EXISTS idx_itineraries_user_destination ON itineraries(user_id, destination_id);

-- تفعيل RLS (Row Level Security)
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- إنشاء policy للسماح للمستخدمين بقراءة وتعديل بياناتهم فقط
CREATE POLICY "Users can view their own itineraries" ON itineraries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own itineraries" ON itineraries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own itineraries" ON itineraries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own itineraries" ON itineraries
    FOR DELETE USING (auth.uid() = user_id);

-- إنشاء function لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء trigger لتحديث updated_at
CREATE TRIGGER update_itineraries_updated_at 
    BEFORE UPDATE ON itineraries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
