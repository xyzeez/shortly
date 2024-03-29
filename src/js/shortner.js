import { isURL } from 'validator';

// Elements
const shortenerForm = document.querySelector('#shortenerForm');
const shortenerList = document.querySelector('#shortenerList');

// Functions
const inputValid = (input, status) => {
  input.setAttribute('aria-invalid', !status);
};

const clearInput = (input) => {
  input.value = '';
  inputValid(input, true);
};

const shortenUrl = async (url) => {
  try {
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`);

    if (!res.ok) throw new Error('Failed to shorten URL');

    const data = await res.text();

    return data;
  } catch (error) {
    console.log(error);
  }
};

const renderUrlMarkup = (oldUrl, newUrl) => {
  const markup = `
    <li class="shorter__listitem">
      <div class="shortened">
        <p class="text shortened__text">${oldUrl}</p>
        <div class="shortened__inner">
          <p class="text shortened__link">${newUrl}</p>
          <button class="btn btn--sec shortened__btn">Copy</button>
        </div>
      </div>
    </li>`;

  shortenerList.insertAdjacentHTML('afterbegin', markup);
};

const monitorForm = () => {
  const form = shortenerForm;
  const input = shortenerForm.querySelector('input');
  let isValid;

  input.addEventListener('input', () => {
    inputValid(input, true);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = input.value.trim();

    isValid = isURL(url);

    if (!isValid) {
      inputValid(input, false);
      return;
    }

    const newUrl = await shortenUrl(url);

    renderUrlMarkup(url, newUrl);

    clearInput(input);
  });
};

export default monitorForm;
