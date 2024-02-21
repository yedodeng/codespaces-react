import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://oashewjkuudwdabgbsty.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hc2hld2prdXVkd2RhYmdic3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4ODA3ODMsImV4cCI6MjAyMzQ1Njc4M30.Y6sft-ujEyOzNhIt-KlccFC8sKBuRu7JTO1THn3fUKo"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)