const seasonSelector = document.querySelector('#seasonSelector')
const dropdownSvg = document.querySelector('#dropdownSvg')
const dropdownMenu = document.querySelector('#dropdownMenu')

const seasonSelectorButton = document.querySelector('#seasonSelectorButton')

let buttonMenuOpen = false;

seasonSelector.addEventListener('mouseover', () => {
  if (!buttonMenuOpen) {
    dropdownSvg.classList.add('rotate-180')
    dropdownMenu.classList.remove('-translate-y-full')
  }
})

seasonSelector.addEventListener('mouseout', () => {
  if (!buttonMenuOpen) {
    dropdownSvg.classList.remove('rotate-180')
    dropdownMenu.classList.add('-translate-y-full')
  }
})

seasonSelectorButton.addEventListener('click', () => {
  if (buttonMenuOpen) {
    dropdownSvg.classList.remove('rotate-180')
    dropdownMenu.classList.add('-translate-y-full')
    buttonMenuOpen = false;
  } else {
    dropdownSvg.classList.add('rotate-180')
    dropdownMenu.classList.remove('-translate-y-full')
    buttonMenuOpen = true;
  }
})

document.addEventListener('click', (e) => {
  if (buttonMenuOpen && !seasonSelector.contains(e.target)) {
    dropdownSvg.classList.remove('rotate-180');
    dropdownMenu.classList.add('-translate-y-full');
    buttonMenuOpen = false;
  }
});