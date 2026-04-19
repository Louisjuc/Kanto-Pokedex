async function getPokemonData(index) {
  let url = PokeData.results[index].url;
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

function getPokemonTemplate(index, types) {
  return `
    <button class="dialog_button" onclick="fullSize(${index})">
    <div class="pkmn_card ${types[0]}">
    <h2> ${FirstLetter(PokeData.results[index].name)}</h2>

    <img src="${getImg(
      index + 1
    )}" class="pkmn_img" alt="Picture of the Pokemon">
    <div class="types">
    ${types.map((type) => `<span>${type}</span>`).join(" ")}
  </div>

    </div>
    </button>
    `;
}
async function contentDialog(index) {
  let data = await getPokemonData(index);
  let stats = data.stats;

  let name = data.name;
  let types = typesCache[name];

  let dialogContent = document.getElementById("dialog_content");
  dialogContent.innerHTML = `
  <section class="pkmn_card_dialog">

    <img src="./assets/icons/cancel.svg" class="close_button" onclick="closeDialog(${index})">

    <div class="pkmn_card_dialog_content">
<section class="dialog_inner">
<section>

<img src="${getImg(
    index + 1
  )}" class="pkmn_img_dialog" alt="Picture of the Pokemon">
      <div class="arrows">
<button  onclick="prevPkmn()"><img src="./assets/icons/left.svg" alt="arrow left" class="arrow_pkmn"></button>
<button onclick="nextPkmn()"><img src="./assets/icons/right.svg" alt="arrow right" class="arrow_pkmn"></button>
</div>
      </section>
<div>
<h2> #${data.id} ${FirstLetter(data.name)}</h2>
<div class="types">
${types.map((type) => `<span class="${type}">${type}</span>`).join(" ")}
</div>
      <p class="stat">
        HP: ${stats.find((s) => s.stat.name === "hp").base_stat}
      </p>
      <p class="stat">
      Attack: ${stats.find((s) => s.stat.name === "attack").base_stat}
    </p>
    <p class="stat">
    Defense: ${stats.find((s) => s.stat.name === "attack").base_stat}
  </p>
  </div>
  </section>
    
    </div>
  </section>
  `;
}
