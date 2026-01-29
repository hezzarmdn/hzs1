const supabaseUrl = 'https://lfjormecnyrhplwfgyaq.supabase.co';
const supabaseKey = 'sb_publishable_XUvHyt_TEzDGqUBRP1flwg_GshP2c1I';
const sb = supabase.createClient(supabaseUrl, supabaseKey);

let timeUnits = { months:0, days:0, hours:0, minutes:0, seconds:0 };

function loginAdmin() {
  const key = document.getElementById('adminKey').value;
  if(key==='admin123'){ 
    document.getElementById('adminPanel').classList.remove('hidden');
  } else alert('Password salah!');
}

// Reset ke sekarang pakai waktu server
async function resetUptime(){
  const serverTime = Date.now();
  const { error } = await sb.from('uptime').update({ start_time: serverTime }).eq('id',1);
  if(error) alert('Error: '+error.message);
  else alert('Uptime di-reset ke sekarang!');
}

// Tombol + / - untuk set unit waktu
function changeUnit(unit,val){
  timeUnits[unit] += val;
  if(timeUnits[unit]<0) timeUnits[unit]=0;
  document.getElementById(unit+'Val').innerText = timeUnits[unit];
  updatePreview();
}

// Update preview realtime
function updatePreview(){
  document.getElementById('previewDuration').innerText = 
    `${timeUnits.months} Bulan ${timeUnits.days} Hari ${timeUnits.hours} Jam ${timeUnits.minutes} Menit ${timeUnits.seconds} Detik`;
}

// Set custom uptime ke server
async function setCustomUptime(){
  // total ms dari semua unit
  const ms = (((timeUnits.months*30 + timeUnits.days)*24 + timeUnits.hours)*60 + timeUnits.minutes)*60*1000
            + timeUnits.seconds*1000;
  const serverTime = Date.now();
  const newTime = serverTime - ms;

  const { error } = await sb.from('uptime').update({ start_time: newTime }).eq('id',1);
  if(error) alert('Error: '+error.message);
  else alert(`Uptime diset ke: ${timeUnits.months} Bulan ${timeUnits.days} Hari ${timeUnits.hours} Jam ${timeUnits.minutes} Menit ${timeUnits.seconds} Detik`);
}
