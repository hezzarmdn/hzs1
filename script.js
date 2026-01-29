const supabaseUrl = 'https://lfjormecnyrhplwfgyaq.supabase.co';
const supabaseKey = 'sb_publishable_XUvHyt_TEzDGqUBRP1flwg_GshP2c1I';
const sb = window.supabase.createClient(supabaseUrl, supabaseKey);

let serverStartTime;

// Hitung & update UI
function updateUptime() {
  if(!serverStartTime) return; // jangan jalan kalau server belum ada

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

// Init: ambil start_time dari server & start interval
async function init() {
  const { data, error } = await sb.from('uptime').select('start_time').eq('id',1).single();
  console.log('Fetched data:', data, 'Error:', error);

  if(!data || !data.start_time) {
    alert('Gagal ambil start_time dari server!');
    return;
  }

  // pastikan start_time dalam milidetik (jika awalnya detik)
  serverStartTime = data.start_time;
  if(serverStartTime < 1e12) serverStartTime *= 1000; 

  // start interval setelah serverStartTime ada
  updateUptime();
  setInterval(updateUptime, 1000);
}

// Realtime subscribe Supabase
sb.from('uptime:id=eq.1').on('UPDATE', payload => {
  if(payload.new && payload.new.start_time){
    serverStartTime = payload.new.start_time;
    if(serverStartTime < 1e12) serverStartTime *= 1000;
    updateUptime();
  }
}).subscribe();

// Mulai
init();
