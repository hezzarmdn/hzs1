const supabaseUrl = 'https://lfjormecnyrhplwfgyaq.supabase.co';
const supabaseKey = 'sb_publishable_XUvHyt_TEzDGqUBRP1flwg_GshP2c1I';
const sb = window.supabase.createClient(supabaseUrl, supabaseKey);

let serverStartTime = Date.now(); // fallback

async function fetchServerStartTime() {
  const { data, error } = await sb.from('uptime').select('start_time').eq('id',1).single();
  if(data) serverStartTime = data.start_time;
}

// Hitung dan update UI
function updateUptime() {
  const diff = Date.now() - serverStartTime;

  // jam, menit, detik
  const h = String(Math.floor(diff / 3600000)).padStart(2,'0');
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
  document.getElementById('time').innerText = `${h}:${m}:${s}`;

  // Hari & Bulan
  const days = Math.floor(diff / (1000*60*60*24));
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  document.getElementById('duration').innerText = `${remainingDays} Hari ${months} Bulan`;
}

// Supabase Realtime subscribe
sb.from('uptime:id=eq.1').on('UPDATE', payload => {
  serverStartTime = payload.new.start_time;
}).subscribe();

// Update setiap 1 detik
setInterval(updateUptime, 1000);
fetchServerStartTime().then(updateUptime);
