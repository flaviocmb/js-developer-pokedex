/**
 *
 * pokemon da nossa classe Pokemon
 *
 */

const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
// const ol = document.getElementById("pokemonList");
const closeModal = document.querySelector("#close-modal");
const modal = document.querySelector("#modal");
const modalBody = document.querySelectorAll(".modal-body")[0];
const fade = document.querySelector("#fade");
const modalTipos = document.getElementById("tipos-container");
const modalNumeroPokemon = document.getElementById("numero-pokemon");
maxRecords = 160;
const limit = 2;
let offset = 0;
const pokemonDataArray = [];
let classeTemporaria = null;

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons
      .map((pokemon) => {
        //exportando os dados do pokemon para usar no moda, depois, criar uma variável só pra isso ======================
        pokemonDataArray.push({
          number: pokemon.number,
          name: pokemon.name,
          type: pokemon.type,
          types: pokemon.types,
          photo: pokemon.photo,
          weight: pokemon.weight,
          height: pokemon.height,
          abilities: pokemon.abilities,
        });

        return `
          <li id="${pokemon.name}" class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
              <ol class="types">
                ${pokemon.types
                  .map((type) => `<li class="type ${type}">${type}</li>`)
                  .join("")}
              </ol>

              <img
                src="${pokemon.photo}"
                alt="${pokemon.name}"
              />
            </div>
          </li>
        `;
      })
      .join("");

    // ==================================================================>>>>>> O trabalho começa aqui
    // const modalHtml = pokemons.map((pokemon = []) => `
    //     <p>${pokemon.photo}</p>
    // `).join('');

    //Importante agora concatenar os carregamentos pois toda nova página
    //vai ser incrementada.
    pokemonList.innerHTML += newHtml;
  });
}

const toggleModal = () => {
  modal.classList.toggle("hide"); //aqui chama/desativa a janela
  fade.classList.toggle("hide"); //aqui chama/desativa o fundo preto
};

//evento de click para fechar o modal e desaparecer com o fade
[closeModal, fade].forEach((element) => {
  element.addEventListener("click", () => {
    toggleModal();
  });
});

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  // debugger
  const qtdRecordNextPage = offset + limit;

  if (qtdRecordNextPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

//evento de click para mostrar a janela e o fade
pokemonList.addEventListener("click", (event) => {
  const pokemonElement = event.target.closest(".pokemon");
  let idPokemon = pokemonElement ? pokemonElement.id : null;

  //event.target.classList.contains('.modal')
  //event.target.id

  //Se clicar em outra área da grade, ele vai trazer null (que já foi tratado na criação da variável idPokemon)
  //e não vai abrir o modal.

  for (let i = 0; i < pokemonDataArray.length; i++) {
    if (idPokemon === pokemonDataArray[i].name) {
      console.log(pokemonDataArray[i].name);
      console.log(pokemonDataArray[i].photo);
      console.log(pokemonDataArray[i].types);
      console.log(pokemonDataArray[i].height);
      console.log(pokemonDataArray[i].weight);
      console.log(pokemonDataArray[i].abilities);

      modal.classList.add(pokemonDataArray[i].type);

      modal.classList.forEach((classes) => {
        if (classeTemporaria === classes) {
          modal.classList.replace(classeTemporaria, pokemonDataArray[i].type);
        }
        classeTemporaria = pokemonDataArray[i].type;
      });

      const h2 = document.getElementById("modal-pokemon-name");
      h2.textContent = pokemonDataArray[i].name;

      const tipoHtml = pokemonDataArray[i].types
        .map((tipo) => `<div class='tipo ${tipo}'>${tipo}</div>`)
        .join("");
      modalTipos.innerHTML = tipoHtml;

      modalNumeroPokemon.textContent = "#" + pokemonDataArray[i].number;

      const imagemPokemon = document.getElementById("img-pokemon");
      imagemPokemon.src = pokemonDataArray[i].photo;

      //configuração inicial das guias quando abrir a primeira vez o modal 
      //ou quando reabrir em outro pokemon
      document.getElementById("dados-sobre").style.display = "block";
      document.getElementById("dados-status").style.display = "none";

      const guiaSobre = document.getElementById("guia-sobre");
      guiaSobre.style.borderBottom = ""; //limpando bordas prévias na guia Sobre
      guiaSobre.style.borderBottom = "1px solid black"; //iniciar a borda na guia Sobre
      guiaSobre.style.color = ""; //limpando cores prévias na guia Sobre
      const guiaStatus = document.getElementById("guia-status");
      guiaStatus.style.borderBottom = "";
      guiaStatus.style.color = ""; //Limpando cores prévias na guia Status
      guiaStatus.style.color = "gray"; //iniciar a cor cinza na guia Status

      [guiaSobre, guiaStatus].forEach((guia) => {
        guia.addEventListener("click", () => {
          const dados = document.getElementsByClassName("dados");
          for (let i = 0; i < dados.length; i++) {
            dados[i].style.display = "none";
          }
          if (guia.id === guiaSobre.id) {
            document.getElementById("dados-sobre").style.display = "block";
            guiaSobre.style.borderBottom = "1px solid black";
            guiaStatus.style.borderBottom = "";
            guiaSobre.style.color = "";
            guiaStatus.style.color = "gray";
          } else {
            document.getElementById("dados-status").style.display = "block";
            guiaStatus.style.borderBottom = "1px solid black";
            guiaSobre.style.borderBottom = "";
            guiaStatus.style.color = "";
            guiaSobre.style.color = "gray";
          }
        });
      });

      // console.log(pokemonDataArray[i].abilities.map((habilidade) => habilidade).join(""));
      console.log(pokemonDataArray[i].abilities);

      const dadosSobreHtml = `
          <p id="altura">${pokemonDataArray[i].height} cm</p>
          <p id="peso">${pokemonDataArray[i].weight} kg</p>
          <p id="habilidades">${pokemonDataArray[i].abilities.map((habilidade) => habilidade).join(", ")}</p>
      `;

      const colunaDadosSobreHtml = document.getElementById('coluna-dados-sobre');

      colunaDadosSobreHtml.innerHTML = dadosSobreHtml;

      toggleModal(); //precisa estar aqui para chamar a janela apenas quando clicar na área da li
    }
  }
});
