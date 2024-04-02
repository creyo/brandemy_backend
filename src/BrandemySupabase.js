
const { createClient } = require('@supabase/supabase-js')


const supabaseUrl = 'https://vswslypjtkwyzainjgzn.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzd3NseXBqdGt3eXphaW5qZ3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkwMzg0MDEsImV4cCI6MjAyNDYxNDQwMX0.CTtkIrZDgmhxfgwU8u7jsJocguakXWUTRXuRya0EUQs"
const BrandeMysupabase = createClient(supabaseUrl, supabaseKey)

module.exports = BrandeMysupabase 