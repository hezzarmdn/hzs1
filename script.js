const supabaseUrl = 'https://lfjormecnyrhplwfgyaq.supabase.co';
const supabaseKey = 'sb_publishable_XUvHyt_TEzDGqUBRP1flwg_GshP2c1I';
const sb = window.supabase.createClient(supabaseUrl, supabaseKey);


async function updateUptime() {
const { data } = await sb
.from('uptime')
.select('start_time')
.eq('id', 1)
.single();


const diff = Date.now() - data.start_time;
const h = String(Math.floor(diff / 3600000)).padStart(2,'0');
const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
const s = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');


document.getElementById('time').innerText = `${h}:${m}:${s}`;
}


setInterval(updateUptime, 1000);
updateUptime();
