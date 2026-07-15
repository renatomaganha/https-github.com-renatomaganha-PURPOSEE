import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ojsgrhaopwwqpoyayumb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qc2dyaGFvcHd3cXBveWF5dW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzY4MjEsImV4cCI6MjA3NjQ1MjgyMX0.V7RjKxmng1mAizm5t9HFcp2LXhnxVqqIA-YEoMIPDKw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  try {
    console.log("Upserting profile...");
    const dbData = {
      id: "00000000-0000-0000-0000-000000000000",
      name: 'Test',
      age: 25,
      dob: '2001-01-01',
      gender: 'Mulher',
      seeking: ['Homem'],
      location: 'Test Location',
      photos: [],
      bio: 'Test Bio',
      denomination: 'Não Denominacional',
      church_frequency: 'Ocasionalmente',
      key_values: [],
      relationship_goal: 'Não sei',
      marital_status: 'Solteiro(a)',
      interests: [],
      languages: [],
      is_verified: false,
      is_premium: false,
      is_invisible_mode: false,
      is_paused: false,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(dbData, { onConflict: 'id' })
      .select(); // selecting default (which is *)
      
    if (error) {
      console.error("Error from upsert with .select() :", error);
    } else {
      console.log("Success! Data:", data);
    }
  } catch (e) {
    console.error("Exception:", e);
  }
}

run();
