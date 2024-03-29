import { isURL } from 'validator';
import { squircle } from 'ldrs';

// Elements
const shortenerForm = document.querySelector('#shortenerForm');
const shortenerList = document.querySelector('#shortenerList');

// Functions
// validate input
const validateInput = (input) => {
  const url = input.value.trim();
  return isURL(url);
};

// validate input and set validity status
const inputValid = (input, status) => {
  input.setAttribute('aria-invalid', !status);
};

// clear input and reset validation
const clearInput = (input) => {
  input.value = '';
  inputValid(input, true);
};

// handle API request for shortening URL
const shortenUrl = async (url) => {
  try {
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`);

    if (!res.ok) throw new Error('Failed to shorten URL');

    return await res.text();
  } catch (error) {
    console.error('Error shortening URL:', error);
    throw error;
  }
};

// render spinner
const renderSpinner = () => {
  squircle.register();

  return `
    <l-squircle
      size="24"
      stroke="5"
      stroke-length="0.15"
      bg-opacity="0.1"
      speed="0.9" 
      color="white"
    ></l-squircle>`;
};

// update button content
const awaitBtn = (btn, content = false) => {
  if (!content) btn.innerHTML = renderSpinner();
  else btn.innerHTML = `<span>${content}</span>`;
};

// render URL markup
const renderUrlMarkup = (oldUrl, newUrl) => {
  const markup = `
    <li class="shorter__listitem">
      <div class="shortened">
        <p class="text shortened__text">${oldUrl}</p>
        <div class="shortened__inner">
          <p id="linkElement" class="text shortened__link">${newUrl}</p>
          <button id="linkCopyBtn" class="btn btn--sec shortened__btn">
            <span>copy</span>
          </button>
        </div>
      </div>
    </li>`;

  shortenerList.insertAdjacentHTML('afterbegin', markup);
};

// copy link to clipboard
const copyLink = async (link) => {
  try {
    await navigator.clipboard.writeText(link);
  } catch (error) {
    console.error('Error copying link to clipboard:', error);
    throw error;
  }
};

//  reset copy buttons
const resetCopyBtns = () => {
  shortenerList.querySelectorAll('button').forEach((btn) => {
    btn.innerHTML = 'copy';
    btn.classList.remove('shortened__btn--copied');
  });
};

// Event listener for copy button
export const monitorCopyBtn = () => {
  shortenerList.addEventListener('click', async (e) => {
    e.preventDefault();

    const list = e.target.closest('li');
    if (!list) return;

    resetCopyBtns();

    const btn = e.target.closest('button');
    if (!btn) return;

    const link = list.querySelector('#linkElement').textContent;
    await copyLink(link);

    btn.innerHTML = `<span>Copied</span>`;
    btn.classList.add('shortened__btn--copied');
  });
};

// Event listener for form submission
export const monitorForm = () => {
  const form = shortenerForm;
  const input = shortenerForm.querySelector('input');
  const btn = shortenerForm.querySelector('#formBtn');

  input.addEventListener('input', () => {
    inputValid(input, true);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateInput(input)) {
      inputValid(input, false);
      return;
    }

    awaitBtn(btn);
    try {
      const newUrl = await shortenUrl(input.value.trim());
      awaitBtn(btn, 'Shorten It!');
      renderUrlMarkup(input.value.trim(), newUrl);
      clearInput(input);
    } catch (error) {
      awaitBtn(btn, 'Shorten It!');
      console.error('Error processing form submission:', error);
    }
  });
};
