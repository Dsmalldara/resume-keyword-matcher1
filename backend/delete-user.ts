import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_SECRET! // must be service role key
);

async function deleteUser() {
  const userId = process.env.User_ID as string; // sample user id for dev environment
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) console.error('Error deleting user:', error);
  else console.log('✅ User deleted successfully');
}

deleteUser();
