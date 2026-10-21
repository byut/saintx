const clickSound = new Audio('assets/sounds/click.mp3');
const soundToggle = document.getElementById('sound-toggle');

let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
if (soundToggle) soundToggle.checked = soundEnabled;

function playClick() {
  if (!soundEnabled) return;
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
}

document.querySelectorAll('button, .tab').forEach(el => {
  el.addEventListener('click', playClick);
});

if (soundToggle) {
  soundToggle.addEventListener('change', () => {
    soundEnabled = soundToggle.checked;
    localStorage.setItem('soundEnabled', soundEnabled);
  });
}
