const supabaseUrl = 'https://lfjormecnyrhplwfgyaq.supabase.co';
const supabaseKey = 'sb_publishable_XUvHyt_TEzDGqUBRP1flwg_GshP2c1I';
const sb = window.supabase.createClient(supabaseUrl, supabaseKey);

let serverStartTime;

// Hitung & update UI
function updateUptime() {
  if(!serverStartTime) return; // jangan jalan kalau server belum ada
  const diff = Date.now() - serverStartTime;

  const h = String(Math.floor(diff / 3600000)).padStart(2,'0');
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
  document.getElementById('time').innerText = `${h}:${m}:${s}`;

  const days = Math.floor(diff / (1000*60*60*24));
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  document.getElementById('duration').innerText = `${remainingDays} Hari ${months} Bulan`;
}

// Ambil start_time dari server dulu
async function init() {
  const { data } = await sb.from('uptime').select('start_time').eq('id',1).single();
  if(data) serverStartTime = data.start_time;

  // start interval setelah serverStartTime ada
  setInterval(updateUptime,1000);
  updateUptime();
}

// Realtime subscribe
sb.from('uptime:id=eq.1').on('UPDATE', payload => {
  serverStartTime = payload.new.start_time;
  updateUptime(); // langsung update UI realtime
}).subscribe();

// Mulai
init();
