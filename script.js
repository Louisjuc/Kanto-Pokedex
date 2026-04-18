let PokeData = [];
let ActualIndex = 0;
let spinner = document.getElementById("spinner");
let typesCache = {};

function getImg(index) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${index}.png`;
}
async function fetchDataJson() {
  spinner.classList.remove("hidden");
  let response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0"
  );
  PokeData = await response.json();
  spinner.classList.add("hidden");
  renderCategory();
}

async function renderCategory() {
  let contentRef = document.getElementById("content");
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

  ActualIndex = 20;
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

function FirstLetter(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
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
  let searchTerm = event.target.value.trim().toLowerCase();
  let listItems = document.querySelectorAll(".dialog_button");

  listItems.forEach(function (item) {
    let text = item.innerText.toLowerCase(); 
    if (text.includes(searchTerm)) {
      item.style.display = ""; 
    } else {
      item.style.display = "none"; 
    }
  });
}

function nextPkmn() {
  ActualIndex++;
  contentDialog(ActualIndex);
}

function prevPkmn() {
  ActualIndex--;
  contentDialog(ActualIndex);
}

async function loadMore() {
  
  let contentRef = document.getElementById("content");

  disableButton();

  let promises = [];
  let end = Math.min(ActualIndex + 20, PokeData.results.length);

  for (let index = ActualIndex; index < end; index++) {
    let name = PokeData.results[index].name;
    promises.push(getTypes(name));
  }

  let allTypes = await Promise.all(promises);

  for (let index = 0; index < allTypes.length; index++) {
    contentRef.innerHTML += getPokemonTemplate(
      ActualIndex + index,
      allTypes[index]
    );
  }

  ActualIndex = end;
  
}

function disableButton(){

  let button = document.getElementById("load");
  if (ActualIndex >= 140) {
    button.disabled = true;
    button.classList.add("d_none");
    
    return;
  }
}
