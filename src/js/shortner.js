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
    console.log(url);
    const res = await fetch(`https://cleanuri.com/api/v1/shorten?url=${url}`, {
      method: 'POST',
      mode: 'no-cors',
    });

    const { data } = await res.json();

    if (!res.ok) throw new Error();

    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

const monitorForm = () => {
  const form = shortenerForm;
  const input = shortenerForm.querySelector('input');
  let isValid;

  input.addEventListener('input', () => {
    inputValid(input, true);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const value = input.value.trim();

    isValid = isURL(value);

    if (!isValid) {
      inputValid(input, false);
      return;
    }

    shortenUrl(value);
  });
};

export default monitorForm;
////
