import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const supabase = createClient(
  'https://bgggsbydvuvbrnlpspml.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZ2dzYnlkdnV2YnJubHBzcG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQwODk2NDMsImV4cCI6MTk3OTY2NTY0M30.tpoiMeNXa5lpUimFrdA0nqik9K29gLCOndgWMA276fI',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)