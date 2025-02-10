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
  }')" class="bg-no-repeat bg-cover w-3xs aspect-3/4">
      <div class="bg-linear-to-t from-black/80 from-30% to-black/0 w-full h-full">
        <div><img src="https://flagsapi.com/${
          player.country
        }/flat/24.png" /></div>
        <div>${player.ign}</div>
        <div>${player.dob ? age : ""}</div>
      </div>
    </li>
  `;
});
