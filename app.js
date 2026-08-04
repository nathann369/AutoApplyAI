const SHEET_ENDPOINT = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showSuccess(successElement) {
  successElement.style.display = 'block';
}

function resetField(inputElement) {
  inputElement.style.borderColor = '';
}

function scrollToWaitlist() {
  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
}

async function saveEmail(email, source) {
  if (!SHEET_ENDPOINT || SHEET_ENDPOINT.includes('YOUR_SCRIPT_ID')) {
    console.warn('Spreadsheet endpoint is not configured yet. Update SHEET_ENDPOINT in app.js.');
    return { ok: true, mocked: true };
  }

  const payload = {
    email,
    source,
    submittedAt: new Date().toISOString(),
  };

  const response = await fetch(SHEET_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || 'Unable to save email.');
  }

  return { ok: true, mocked: false, responseText: text };
}

async function submitEmail(inputId, successId, buttonSelector, source) {
  const input = document.getElementById(inputId);
  const success = document.getElementById(successId);
  const button = document.querySelector(buttonSelector);

  if (!input || !success || !button) {
    return;
  }

  const email = input.value.trim();

  if (!isValidEmail(email)) {
    input.style.borderColor = '#c0392b';
    return;
  }

  resetField(input);
  button.disabled = true;

  try {
    await saveEmail(email, source);
    input.style.display = 'none';
    button.style.display = 'none';
    showSuccess(success);
  } catch (error) {
    console.error(error);
    success.textContent = 'Something went wrong. Please try again.';
    success.style.color = '#c0392b';
    success.style.display = 'block';
  } finally {
    button.disabled = false;
  }
}

function attachHandlers() {
  const heroSubmit = document.getElementById('hero-submit');
  if (heroSubmit) {
    heroSubmit.addEventListener('click', () => {
      submitEmail('hero-email', 'hero-success', '#hero-submit', 'hero');
    });
  }

  const waitlistSubmit = document.getElementById('waitlist-submit');
  if (waitlistSubmit) {
    waitlistSubmit.addEventListener('click', () => {
      submitEmail('waitlist-email', 'waitlist-success', '#waitlist-submit', 'waitlist');
    });
  }

  document.getElementById('nav-join')?.addEventListener('click', scrollToWaitlist);
  document.getElementById('starter-join')?.addEventListener('click', scrollToWaitlist);
  document.getElementById('pro-join')?.addEventListener('click', scrollToWaitlist);
  document.getElementById('agency-join')?.addEventListener('click', scrollToWaitlist);
}

document.addEventListener('DOMContentLoaded', attachHandlers);
