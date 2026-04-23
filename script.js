let PokeData = [];
let ActualIndex = 0;
let loadedIndex = 0;
let spinner = document.getElementById("spinner");
let typesCache = {};
let button = document.getElementById("load");
let contentRef = document.getElementById("content");
const dialog = document.querySelector("dialog");
dialog.addEventListener("click", onClick);

async function init() {
  spinner.classList.remove("hidden");
  let response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0"
  );
  PokeData = await response.json();
  spinner.classList.add("hidden");
  renderPkmn();
}

async function renderPkmn() {
  contentRef.innerHTML = "";

  let promises = [];
  for (let index = 0; index < 20; index++) {
    let name = PokeData.results[index].name;
    promises.push(getTypes(name));
  }

  let allTypes = await Promise.all(promises);
  for (let index = 0; index < 20; index++) {
    contentRef.innerHTML += getPokemonTemplate(index, allTypes[index]);
  }
  loadedIndex = 20;
}

async function getTypes(name) {
  if (typesCache[name]) {
    return typesCache[name];
  }

  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  let data = await response.json();
  let types = data.types.map((p) => p.type.name);
  typesCache[name] = types;
  return types;
}

function fullSize(index) {
  ActualIndex = index;
  contentDialog(index);
  document.getElementById("dialog_wrapper").showModal();
  document.body.classList.add("dialog-open");
}

function closeDialog() {
  document.getElementById("dialog_wrapper").close();
  document.body.classList.remove("dialog-open");
}

function filterByName(event) {
  button.classList.remove("d_none");
  document.getElementById("no_Result")?.remove();

  let searchTerm = event.target.value.trim().toLowerCase();
  let listItems = document.querySelectorAll(".dialog_button");

  if (searchTerm.length < 3) {
    listItems.forEach((item) => (item.style.display = ""));
    return;
  }
  filterItems(listItems, searchTerm);
}

function filterItems(listItems, searchTerm) {
  let found = false;
  listItems.forEach((item) => {
    let text = item.innerText.toLowerCase();
    if (text.includes(searchTerm)) {
      item.style.display = "";
      found = true;
    } else {
      item.style.display = "none";
    }
  });
  if (found) {
    document.getElementById("no_Result")?.remove();
  } else if (!document.getElementById("no_Result")) {
    button.classList.add("d_none");
    contentRef.insertAdjacentHTML(
      "beforeend",
      `<p id="no_Result">Couldn't find any Pokémon.</p>`
    );
  }
}

function nextPkmn() {
  ActualIndex++;

  contentDialog(ActualIndex);
}

function prevPkmn() {
  if (ActualIndex < loadedIndex - 1) {
    ActualIndex++;
    contentDialog(ActualIndex);
  }
}

async function loadMore() {
  let contentRef = document.getElementById("content");
  disableButton();
  let promises = [];
  let end = Math.min(loadedIndex + 20, PokeData.results.length);
  for (let index = loadedIndex; index < end; index++) {
    promises.push(getTypes(PokeData.results[index].name));
  }
  let allTypes = await Promise.all(promises);
  for (let index = 0; index < allTypes.length; index++) {
    contentRef.innerHTML += getPokemonTemplate(
      loadedIndex + index,
      allTypes[index]
    );
  }
  loadedIndex = end;
}

function disableButton() {
  if (loadedIndex >= 140) {
    button.disabled = true;
    button.classList.add("d_none");

    return;
  }
}

function onClick(event) {
  if (event.target === dialog) {
    dialog.close();
  }
}

document.addEventListener("keydown", (esc) => {
  if (esc.key === "Escape") {
    closeDialog();
  }
});

async function getPokemonData(index) {
  let url = PokeData.results[index].url;
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

function FirstLetter(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

async function fetchDetails(index) {
  let data = await getPokemonData(index);

  return {
    data,
    stats: data.stats,
    name: data.name,
    types: data.types.map((t) => t.type.name),
  };
}
