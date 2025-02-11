import seasons from '../data/seasons.json'

const seasonSelector = document.querySelector('#seasonSelector')
const dropdownSvg = document.querySelector('#dropdownSvg')
const dropdownMenu = document.querySelector('#dropdownMenu')

const seasonSelectorButton = document.querySelector('#seasonSelectorButton')

let buttonMenuOpen = false;

seasons.forEach((season) => {
  dropdownMenu.innerHTML += `
    <li class="w-30">
      <a class="p-4 duration-100 hover:bg-slate-800 h-30 flex items-center justify-center" href="/seasons?season=${season.name[season.name.length - 1]}">
        <img class="max-h-full max-w-full object-contain" src="/assets/${season.logo}" >
      </a>
    </li>
  `
})

function openMenu() {
  dropdownSvg.classList.add('rotate-180')
  dropdownMenu.classList.remove('-translate-y-full')
}

function closeMenu() {
  dropdownSvg.classList.remove('rotate-180')
  dropdownMenu.classList.add('-translate-y-full')
}

seasonSelector.addEventListener('mouseover', () => {
  if (!buttonMenuOpen) {
    openMenu()
  }
})

seasonSelector.addEventListener('mouseout', () => {
  if (!buttonMenuOpen) {
    closeMenu()
  }
})

dropdownMenu.addEventListener('mouseover', () => {
  if (!buttonMenuOpen) {
    openMenu()
  }
})

dropdownMenu.addEventListener('mouseout', () => {
  if (!buttonMenuOpen) {
    closeMenu()
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