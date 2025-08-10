import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shhmlmejukbvtotgjule.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaG1sbWVqdWtidnRvdGdqdWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNzc0NTUsImV4cCI6MjA2OTc1MzQ1NX0.qvcmpysmFjPwtQRl0ueuCtcx6SckBbS73wzDqiBsN8E';

export const supabase = createClient(supabaseUrl, supabaseKey);
