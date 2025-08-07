-- Migration script لتحديث جدول profiles لإضافة عمود role
-- يمكن تشغيل هذا في Supabase SQL editor

-- إضافة عمود role إذا لم يكن موجوداً
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- تحديث الملفات الموجودة لتحتوي على بيانات من auth.users
DO $$ 
BEGIN 
    UPDATE profiles 
    SET 
        email = auth_users.email,
        name = COALESCE(auth_users.raw_user_meta_data->>'name', 'User')
    FROM auth.users AS auth_users 
    WHERE profiles.id = auth_users.id 
    AND (profiles.email IS NULL OR profiles.name IS NULL);
END $$;

-- إضافة policy للسماح للمديرين بقراءة جميع الملفات
CREATE POLICY IF NOT EXISTS "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles admin_profile 
            WHERE admin_profile.id = auth.uid() 
            AND admin_profile.role = 'admin'
        )
    );

-- إضافة policy للسماح للمديرين بتعديل جميع الملفات
CREATE POLICY IF NOT EXISTS "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles admin_profile 
            WHERE admin_profile.id = auth.uid() 
            AND admin_profile.role = 'admin'
        )
    );

-- إضافة index لتسريع البحث بالدور
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- إضافة constraint للتأكد من أن الأدوار صحيحة
ALTER TABLE profiles 
ADD CONSTRAINT IF NOT EXISTS check_valid_role 
CHECK (role IN ('user', 'admin', 'moderator'));

-- إنشاء function لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء trigger لتحديث updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
