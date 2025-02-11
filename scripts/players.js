import players from "../data/players.json";

const charMap = {
  Ø: "O",
  ø: "o",
  Æ: "AE",
  æ: "ae",
  Å: "A",
  å: "a",
  É: "E",
  é: "e",
  Á: "A",
  á: "a",
  Í: "I",
  í: "i",
  Ó: "O",
  ó: "o",
  Ú: "U",
  ú: "u",
  Ñ: "N",
  ñ: "n",
  Ü: "U",
  ü: "u",
  Ç: "C",
  ç: "c",
  Š: "S",
  š: "s",
  Ž: "Z",
  ž: "z",
};

const countries = {
  NO: "Norway",
  DE: "Germany",
  RS: "Serbia",
  BR: "Brazil",
  UA: "Ukraine",
  VN: "Vietnam",
  CA: "Canada",
  FI: "Finland",
  CN: "China",
  PL: "Poland",
  IN: "India",
  RU: "Russia",
  AT: "Austria",
  AR: "Argentina",
  ES: "Spain",
};

function getAge(dateOfBirth) {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age--;
  }

  return age;
}

const playersContainer = document.querySelector("#playersContainer");

players.forEach((player) => {
  const normalizedName = player.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(
      /[ØøÆæÅåÉéÁáÍíÓóÚúÑñÜüÇçŠšŽž]/g,
      (match) => charMap[match] || match
    );

  let age = getAge(player.dob);

  playersContainer.innerHTML += `
    <li data-info="${player.ign} ${player.name} ${player.country} ${
    countries[player.country]
  } ${player.team || ""} ${
    normalizedName === player.name ? "" : normalizedName
  }" style="background-image: url('${
    player.img ?? "../assets/playerunknown.png"
  }')" class=" flex-1 basis-[calc(50%-0.375rem)] sm:basis-[calc(33.33%-0.5rem)] bg-no-repeat bg-cover max-w-3xs aspect-3/4 duration-100 overflow-hidden rounded-md hover:outline-2 hover:outline-sky-50 hover:scale-102 player-card">
      <div class="bg-linear-to-t from-black/80 from-30% to-black/0 w-full h-full flex flex-col text-center p-2">
        <div class="flex w-full justify-center gap-2"><img src="https://flagsapi.com/${
          player.country
        }/flat/24.png" />${player.team ? `<div>${player.team}</div>` : ''}</div>
        <div class="mt-auto font-black text-xl md:text-3xl">${player.ign}</div>
        <div class="font-light text-sm text-sky-50/75 pt-1">${player.name}</div>
        <div class="font-light text-xs text-sky-50/75 min-h-4">${player.dob ? `${age} years old` : ""}</div>
      </div>
    </li>
  `;
});

const playerCards = document.querySelectorAll('.player-card')

const searchInput = document.querySelector('#searchInput')
const searchButton = document.querySelector('#searchButton')

searchButton.addEventListener('click', searchPlayers)

function searchPlayers () {
  playerCards.forEach((card) => {
    if (card.dataset.info.toLowerCase().search(searchInput.value.toLowerCase()) >= 0) {
      card.classList.remove('hidden')
    } else {
      card.classList.add('hidden')
    }
  })
}