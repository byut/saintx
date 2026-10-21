const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
const accountToggle = document.getElementById('account-toggle');

const panels = {
  settings: document.getElementById('panel-settings'),
  support: document.getElementById('panel-support'),
};

function closeAllPanels() {
  Object.values(panels).forEach(p => p && p.classList.add('hidden'));
}

menuToggle.addEventListener('click', () => {
  sideMenu.classList.toggle('hidden');
});

document.querySelectorAll('.side-menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const panelName = item.dataset.panel;
    closeAllPanels();
    if (panels[panelName]) {
      panels[panelName].classList.remove('hidden');
    }
    sideMenu.classList.add('hidden');
  });
});

// Abas: clique ou toque ativa, com destaque visual
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Suporte: envio de mensagem para a IA de atendimento (integrar com API externa, ex: Zendesk/Tidio/Chatsac)
const supportSend = document.getElementById('support-send');
if (supportSend) {
  supportSend.addEventListener('click', async () => {
    const message = document.getElementById('support-message').value.trim();
    if (!message) return;
    // TODO: substituir pela chamada real à API de suporte/IA escolhida
    await fetch('/api/support/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    document.getElementById('support-message').value = '';
  });
}
