// Elements
const navBtn = document.querySelector('#navBtn');
const navLinks = Array.from(
  document.querySelectorAll('#navContainer .nav__link')
);
const navContainer = document.querySelector('#navContainer');
const navOverlay = document.querySelector('#navOverlay');

const openNav = (status) => {
  if (status) navContainer.classList.remove('hidden');
  else navContainer.classList.add('hidden');
};

const monitorNav = () => {
  let navOpen = false;

  console.log('dd');

  navBtn.addEventListener('click', () => {
    navOpen = !navOpen;
    openNav(navOpen);
  });

  [navOverlay, ...navLinks].forEach((element) => {
    element.addEventListener('click', () => {
      openNav(false);
      navOpen = false;
    });
  });
};

monitorNav();
