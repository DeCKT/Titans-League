const page_header = document.querySelector("#page_header");
const league_selector = document.querySelector("#league_selector");

const params = new URLSearchParams(window.location.search);

const seasonParam = params.get("season");

async function getSeasonsData() {
  try {
    const res = await fetch("../data/seasons.json");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

getSeasonsData().then((seasonsData) => {
  const selectedSeason = seasonsData.find(
    (season) => season.name === `Season ${seasonParam}`
  );
  console.log(selectedSeason.leagues);
});

if (season) {
  document.title = `Season ${season} | T90 Titans League`;
  page_header.textContent = `Season ${season}`;
}
