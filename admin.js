const supabaseUrl = 'https://lfjormecnyrhplwfgyaq.supabase.co';
const supabaseKey = 'sb_publishable_XUvHyt_TEzDGqUBRP1flwg_GshP2c1I'; // ANON KEY
const sb = supabase.createClient(supabaseUrl, supabaseKey);

function loginAdmin() {
  const key = document.getElementById('adminKey').value;
  if(key === 'admin123'){ // ganti sesuai password admin lu
    document.getElementById('adminPanel').classList.remove('hidden');
  } else {
    alert('Password salah!');
  }
}

async function resetUptime() {
  const now = Date.now();
  const { error } = await sb.from('uptime')
    .update({ start_time: now })
    .eq('id', 1);
  if(error) alert('Error: '+error.message);
  else alert('Uptime di-reset ke sekarang!');
}

async function setUptime() {
  const days = parseInt(document.getElementById('daysAgo').value);
  if(isNaN(days)) return alert('Isi angka dulu!');
  const ms = days * 24*60*60*1000;
  const newTime = Date.now() - ms;
  const { error } = await sb.from('uptime')
    .update({ start_time: newTime })
    .eq('id', 1);
  if(error) alert('Error: '+error.message);
  else alert(`Uptime diset ${days} hari lalu!`);
}
