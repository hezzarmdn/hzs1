const supabaseUrl = 'https://lfjormecnyrhplwfgyaq.supabase.co';
const supabaseKey = 'sb_publishable_XUvHyt_TEzDGqUBRP1flwg_GshP2c1I';
const sb = supabase.createClient(supabaseUrl, supabaseKey);

let serverStartTime;

// Update UI
function updateUptime() {
  if(!serverStartTime) return;

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

// Init
async function init() {
  const { data, error } = await sb.from('uptime').select('start_time').eq('id',1).single();
  console.log('Fetched data:', data, 'Error:', error);

  if(!data || !data.start_time){
    alert('Gagal ambil start_time dari server. Pastikan baris ID=1 ada dan start_time benar.');
    return;
  }

  serverStartTime = data.start_time;
  if(serverStartTime < 1e12) serverStartTime *= 1000; // detik → ms

  updateUptime();
  setInterval(updateUptime, 1000);

  // Realtime Supabase v2
  const channel = sb.channel('public:uptime')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'uptime', filter: 'id=eq.1' }, payload => {
      console.log('Realtime payload:', payload);
      if(payload.new && payload.new.start_time){
        serverStartTime = payload.new.start_time;
        if(serverStartTime < 1e12) serverStartTime *= 1000;
        updateUptime();
      }
    })
    .subscribe();
}

init();
