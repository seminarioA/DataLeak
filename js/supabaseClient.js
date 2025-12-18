// Initialize Supabase client
const supabaseUrl = "https://buykkihkvljctcahbsjq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1eWtraWhrdmxqY3RjYWhic2pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTM2MDAsImV4cCI6MjA3ODYyOTYwMH0.laSDQ4L4q7XlS3t7UrFMAEXVMKY2yCH9CzyNiyjCKwo";

// Create the supabase client instance and make it globally available
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
