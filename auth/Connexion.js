document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorDiv = document.getElementById('login-error');
  const successDiv = document.getElementById('login-success');
  let users = JSON.parse(localStorage.getItem('silkroad_users')) || [];
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
      showError('Veuillez remplir tous les champs.');
      return;
    }
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('silkroad_user', JSON.stringify({ email: user.email, prenom: user.prenom }));
      showSuccess('Connexion réussie ! Redirection...');
      setTimeout(() => { window.location.href = '../index/index.html'; }, 1500);
    } else {
      showError('Email ou mot de passe incorrect.');
    }
  });
  function showError(msg) {
    if (errorDiv) {
      errorDiv.querySelector('span').textContent = msg;
      errorDiv.style.display = 'flex';
      if (successDiv) successDiv.style.display = 'none';
    }
  }
  function showSuccess(msg) {
    if (successDiv) {
      successDiv.querySelector('span').textContent = msg;
      successDiv.style.display = 'flex';
      if (errorDiv) errorDiv.style.display = 'none';
    }
  }
  const togglePw = document.getElementById('toggle-pw');
  if (togglePw) {
    togglePw.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      const icon = togglePw.querySelector('i');
      if (icon) icon.classList.toggle('fa-eye-slash');
    });
  }
});
