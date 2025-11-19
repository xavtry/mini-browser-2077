// CONFIG
const PROXY = "http://localhost:3000/proxy?url=";
const START_URL = "https://en.wikipedia.org/wiki/Cyberpunk_2077";

const iframe = document.getElementById('frame');
const urlInput = document.getElementById('url');
let history = [START_URL];
let pointer = 0;

function play(id) {
  document.getElementById('snd-' + id)?.play().catch(() => {});
}

// Load URL safely
function load(url) {
  if (!url) return;
  if (!url.match(/^https?:\/\//)) url = "https://" + url;

  play('load');
  document.getElementById('status').textContent = "CONNECTING...";
  
  iframe.src = PROXY + encodeURIComponent(url);

  // Update history
  if (history[pointer] !== url) {
    history = history.slice(0, pointer + 1);
    history.push(url);
    pointer++;
  }
  urlInput.value = url;
}

// Navigation
document.getElementById('go').onclick = () => load(urlInput.value);
urlInput.addEventListener('keypress', e => { if (e.key === 'Enter') load(urlInput.value); });

document.getElementById('back').onclick = () => {
  if (pointer > 0) { pointer--; load(history[--pointer]); }
};
document.getElementById('forward').onclick = () => {
  if (pointer < history.length - 1) { pointer++; load(history[pointer]); }
};
document.getElementById('reload').onclick = () => iframe.src = iframe.src;
document.getElementById('fullscreen').onclick = () => {
  document.documentElement.requestFullscreen?.();
};

// Iframe events
iframe.onload = () => {
  document.getElementById('status').textContent = "SECURE LINK ESTABLISHED";
  play('click');
};
iframe.onerror = () => {
  document.getElementById('error').classList.remove('hidden');
  document.getElementById('status').textContent = "LINK DEAD";
  play('error');
};

// 3D NEON CITY
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth; canvas.height = innerHeight;

const buildings = [];
for(let i=0; i<80; i++){
  buildings.push({
    x: Math.random()*canvas.width,
    w: 30 + Math.random()*80,
    h: 150 + Math.random()*500,
    color: ['#0ff','#f0f','#ff0','#0f0'][i%4]
  });
}

function animate() {
  ctx.fillStyle = 'rgba(0,0,15,0.05)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  
  buildings.forEach(b => {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, canvas.height - b.h, b.w, b.h);
    ctx.fillStyle = '#fff';
    for(let j=0; j<15; j++){
      if(Math.random() > 0.3){
        ctx.fillRect(b.x + 8 + j*6, canvas.height - b.h + 30 + Math.random()*(b.h-60), 4, 10);
      }
    }
  });
  requestAnimationFrame(animate);
}
animate();

// Boot sequence
setTimeout(() => {
  document.getElementById('bootmsg').textContent = "PROXY ONLINE • RENDERING UI";
}, 1500);
setTimeout(() => {
  document.getElementById('boot').style.opacity = '0';
  document.getElementById('ui').classList.remove('hidden');
  setTimeout(() => document.getElementById('boot').style.display = 'none', 1000);
  load(START_URL);
}, 3500);

window.addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
