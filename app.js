const GOOGLE_FORM_URL = 'https://forms.gle/aRjUTEn2XXJjavRw6';

function openGoogleForm() {
  window.location.href = GOOGLE_FORM_URL;
}

function attachHandlers() {
  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', openGoogleForm);
  });
}

document.addEventListener('DOMContentLoaded', attachHandlers);
