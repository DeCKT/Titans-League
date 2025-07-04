import maps from "../data/maps.json";

const mapsContainer = document.querySelector("#mapsContainer");

maps.forEach((map) => {
  mapsContainer.innerHTML += `
    <li data-info="${map.name} ${map.types.join(
    " "
  )}" class="w-full duration-100 rounded-md hover:outline-2 hover:outline-sky-50 hover:scale-102 relative map-card">
      <img src="${
        map.img ? `/assets/maps/${map.img}` : "/assets/maps/cm_generic.png"
      }">
      <div class="absolute left-[50%] translate-x-[-50%] bottom-5 py-2 px-1 w-[90%] text-center bg-gray-950 border border-x-1 border-y-2 border-sky-50 rounded-sm">${
        map.name
      }</div>
    </li>
  `;
});

const mapCards = document.querySelectorAll(".map-card");

const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");

searchButton.addEventListener("click", searchMaps);

function searchMaps() {
  mapCards.forEach((card) => {
    if (
      card.dataset.info.toLowerCase().search(searchInput.value.toLowerCase()) >=
      0
    ) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}
