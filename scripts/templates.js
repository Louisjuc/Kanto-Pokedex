function getImg(index) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${index}.png`;
}

function getPokemonTemplate(index, types) {
  return `
    <button class="dialog_button" onclick="fullSize(${index})">
    <div class="pkmn_card ${types[0]}">
    <h2> ${FirstLetter(PokeData.results[index].name)}</h2>
    <img src="${getImg(index + 1)}" class="pkmn_img" alt="Picture of the Pokemon">
    <div class="types">
    ${types.map((type) => `<span>${FirstLetter(type)}</span>`).join(" ")}
  </div>
    </div>
    </button>
    `;
}
async function contentDialog(index) {
  let result = await fetchDetails(index);

  let dialogContent = document.getElementById("dialog_content");
  dialogContent.innerHTML = `
  <section class="pkmn_card_dialog">
    <img src="./assets/icons/cancel.svg" class="close_button" onclick="closeDialog(${index})">
    <div class="pkmn_card_dialog_content">
      <section class="dialog_inner">
        <section>
          <img src="${getImg(index + 1)}" class="pkmn_img_dialog">
          <div class="arrows">
            <button onclick="prevPkmn()">
              <img src="./assets/icons/left.svg" class="arrow_pkmn">
            </button>
            <button onclick="nextPkmn()">
              <img src="./assets/icons/right.svg" class="arrow_pkmn">
            </button>
          </div>
        </section>
        <div>
          <h2>#${result.data.id} ${FirstLetter(result.data.name)}</h2>
          <div class="types">
            ${result.types.map(type => `
              <span class="${type}">${FirstLetter(type)}</span>
            `).join("")}
          </div>
          <p class="stat">
            HP: ${result.stats.find(s => s.stat.name === "hp").base_stat}
          </p>
          <p class="stat">
            Attack: ${result.stats.find(s => s.stat.name === "attack").base_stat}
          </p>
          <p class="stat">
            Defense: ${result.stats.find(s => s.stat.name === "defense").base_stat}
          </p>
        </div>
      </section>
    </div>
  </section>
  `;
}
