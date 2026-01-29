const supabaseUrl = 'https://lfjormecnyrhplwfgyaq.supabase.co';
const supabaseKey = 'sb_publishable_XUvHyt_TEzDGqUBRP1flwg_GshP2c1I';
const sb = supabase.createClient(supabaseUrl, supabaseKey);

let timeUnits = { months:0, days:0, hours:0, minutes:0, seconds:0 };

function loginAdmin() {
  const key = document.getElementById('adminKey').value;
  if(key === 'admin123'){
    document.getElementById('adminPanel').classList.remove('hidden');
  } else alert('Password salah!');
}

async function resetUptime() {
  const now = Date.now();
  const { error } = await sb.from('uptime').update({ start_time: now }).eq('id',1);
  if(error) alert('Error: '+error.message);
  else alert('Uptime di-reset ke sekarang!');
}

function changeUnit(unit, val){
  timeUnits[unit] += val;
  if(timeUnits[unit]<0) timeUnits[unit]=0;
  document.getElementById(unit+'Val').innerText = timeUnits[unit];
  updatePreview();
}

function updatePreview(){
  const p = document.getElementById('previewDuration');
  p.innerText = `${timeUnits.months} Bulan ${timeUnits.days} Hari ${timeUnits.hours} Jam ${timeUnits.minutes} Menit ${timeUnits.seconds} Detik`;
}

async function setCustomUptime(){
  const ms = (((timeUnits.months*30 + timeUnits.days)*24 + timeUnits.hours)*60 + timeUnits.minutes)*60*1000
            + timeUnits.seconds*1000;
  const newTime = Date.now() - ms;

  const { error } = await sb.from('uptime').update({ start_time: newTime }).eq('id',1);
  if(error) alert('Error: '+error.message);
  else alert(`Uptime diset ke: ${updatePreviewText()}`);
}

function updatePreviewText(){
  return `${timeUnits.months} Bulan ${timeUnits.days} Hari ${timeUnits.hours} Jam ${timeUnits.minutes} Menit ${timeUnits.seconds} Detik`;
}
