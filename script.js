const members = ["Tanish", "Arpit", "Muskan", "Suhani", "Kartik", "Rinkle", "Yash", "Nikita"];
const PASSWORD = "cqst";

let selectedUser = null;

function displayProfiles() {
  const list = document.getElementById('profile-list');
  members.forEach(name => {
    const btn = document.createElement('div');
    btn.className = 'profile';
    btn.textContent = name;
    btn.onclick = () => {
      document.querySelectorAll('.profile').forEach(p => p.classList.remove('selected'));
      btn.classList.add('selected');
      selectedUser = name;
    };
    list.appendChild(btn);
  });
}

function login() {
  const passwordInput = document.getElementById('password').value;
  if (!selectedUser) return alert('Select your profile');
  if (passwordInput !== PASSWORD) return alert('Incorrect password');
  
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('chat-screen').style.display = 'block';
  document.getElementById('welcome').textContent = `Welcome, ${selectedUser}`;
  loadChats();
}

function loadChats() {
  const chatBox = document.getElementById('chat-box');
  const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
  const now = Date.now();

  const recentMessages = messages.filter(msg => now - msg.timestamp < 6 * 60 * 60 * 1000); // 6 hours
  localStorage.setItem('chatMessages', JSON.stringify(recentMessages));

  chatBox.innerHTML = '';
  recentMessages.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `<strong>${msg.user}:</strong> ${msg.text}`;
    if (msg.image) {
      const img = document.createElement('img');
      img.src = msg.image;
      div.appendChild(img);
    }
    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById('chat-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const messageInput = document.getElementById('message');
  const fileInput = document.getElementById('screenshot');
  const text = messageInput.value.trim();
  const file = fileInput.files[0];

  if (!text) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    const msg = {
      user: selectedUser,
      text,
      image: file ? reader.result : null,
      timestamp: Date.now()
    };
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    messages.push(msg);
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    loadChats();
    messageInput.value = '';
    fileInput.value = '';
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    reader.onloadend();
  }
});

window.onload = displayProfiles;
