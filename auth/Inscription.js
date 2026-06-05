document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const prenomInput = document.getElementById('prenom');
  const nomInput = document.getElementById('nom');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirm-password');
  const errorDiv = document.getElementById('register-error');
  const successDiv = document.getElementById('register-success');
  let users = JSON.parse(localStorage.getItem('silkroad_users')) || [];
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
    if (prenomInput.value.trim().length < 2) {
      return showError('Le prénom doit contenir au moins 2 caractères.');
    }
    if (nomInput.value.trim().length < 2) {
      return showError('Le nom doit contenir au moins 2 caractères.');
    }
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      return showError('Veuillez entrer un email valide (ex: nom@domaine.com).');
    }
    if (users.find(u => u.email === emailInput.value.trim())) {
      return showError('Cet email est déjà utilisé.');
    }
    const password = passwordInput.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      return showError('Le mot de passe doit avoir au moins 6 caractères, une majuscule, une minuscule et un chiffre.');
    }
    if (password !== confirmInput.value) {
      return showError('Les mots de passe ne correspondent pas.');
    }
    const newUser = {
      prenom: prenomInput.value.trim(),
      nom: nomInput.value.trim(),
      email: emailInput.value.trim(),
      password: password
    };
    users.push(newUser);
    localStorage.setItem('silkroad_users', JSON.stringify(users));
    showSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    setTimeout(() => { window.location.href = 'Connexion.html'; }, 2000);
  });
  function showError(msg) {
    if (errorDiv) {
      errorDiv.querySelector('span').textContent = msg;
      errorDiv.style.display = 'flex';
    }
  }
  function showSuccess(msg) {
    if (successDiv) {
      successDiv.querySelector('span').textContent = msg;
      successDiv.style.display = 'flex';
    }
  }
});
