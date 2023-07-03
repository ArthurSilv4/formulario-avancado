import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://wchyngyohctbbpattzfn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjaHluZ3lvaGN0YmJwYXR0emZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODM1MjAyNiwiZXhwIjoyMDAzOTI4MDI2fQ.KMO9og2kqgPvEgV9BxhYrfSxiid1wsqRtYtEG2QNWvY',
)
