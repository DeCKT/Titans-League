import maps from "../data/maps.json"

const mapsContainer = document.querySelector("#mapsContainer")

maps.forEach((map) => {

  map.types.join(' ')

  mapsContainer.innerHTML += `
    <li data-info="${map.name} ${map.types.join(' ')}" class="w-full max-w-[calc((100%-1.5rem)/3)]  
sm:max-w-[calc((100%-2.25rem)/4)]  
md:max-w-[calc((100%-3rem)/5)]  
lg:max-w-[calc((100%-3.75rem)/6)]  
xl:max-w-[calc((100%-4.5rem)/7)]  
2xl:max-w-[calc((100%-5.25rem)/8)] duration-100 rounded-md hover:outline-2 hover:outline-sky-50 hover:scale-102 relative">
      <img src="${map.img ? `/assets/maps/${map.img}` : '/assets/maps/cm_generic.png'}">
      <div class="absolute left-[50%] translate-x-[-50%] bottom-5 py-2 px-1 w-[90%] text-center bg-amber-950">${map.name}</div>
    </li>
  `
})