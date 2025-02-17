import seasons from "../data/seasons.json";
import maps from "../data/maps.json";

const seasonNumber = document.querySelector("#seasonNumber");
const mapContainer = document.querySelector("#mapContainer");
const seasonLogo = document.querySelector("#seasonLogo");

const queries = window.location.search;
const params = new URLSearchParams(queries);
const seasonNum = params.get("season");

const season = seasons.find((season) => season.name === `Season ${seasonNum}`);

// set h1
seasonNumber.textContent = `Season ${seasonNum}`;

// set title
document.title = `TTL | Season 1`;

seasonLogo.src = `/assets/${season.logo}`;

season.maps.forEach((map) => {
  const mapJson = maps.find((obj) => obj.name === map);

  mapContainer.innerHTML += `
    <li><img src="/assets/maps/${
      mapJson.img.length > 0 ? mapJson.img : "cm_generic.png"
    }"></li>
  `;
});
