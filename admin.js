const ADMIN_SECRET = 'ADMIN123'; // ganti sendiri


const supabaseUrlA = 'https://lfjormecnyrhplwfgyaq.supabase.co';
const supabaseKeyA = 'sb_publishable_XUvHyt_TEzDGqUBRP1flwg_GshP2c1I';
const adminSB = window.supabase.createClient(supabaseUrlA, supabaseKeyA);


function loginAdmin() {
const key = document.getElementById('adminKey').value;
if (key === ADMIN_SECRET) {
document.getElementById('adminPanel').classList.remove('hidden');
} else {
alert('Admin key salah');
}
}


async function resetUptime() {
await adminSB
.from('uptime')
.update({ start_time: Date.now() })
.eq('id', 1);


alert('Uptime berhasil direset');
}
