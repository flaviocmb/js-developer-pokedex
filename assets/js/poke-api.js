/**
 *
 * Esse arquivo terá como saída um objeto em que teremos as funções de
 * manipulação da PokeAPI.
 *
 *
 */

//Poderia ser uma classe, mas vamos usar um objeto para representar a PokeApi.
const pokeApi = {};

function convertPokeApiDefaultToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;
  
  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  
  //type (destructor) equivale a types.get(0)
  const [type] = types;
  
  pokemon.types = types;
  pokemon.type = type;
  
  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;
  
  pokemon.height = pokeDetail.height * 10; //converter de decímetro para centímetro
  pokemon.weight = pokeDetail.weight * 0.1; //converter de hectograma para quilograma

  const abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name);
  pokemon.abilities = abilities;

  return pokemon;
}

//Aqui ele acessa a url para ter acesso aos detalhes do pokemon
//equivale a https://pokeapi.co/api/v2/pokemon/1/
//equivale a .then((pokemons => pokemons.map(pokemon) => fetch(pokemon.url).then((response) => response.json())))

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDefaultToPokemon);
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  //Se tudo der certo (fetch), então você recebe uma promessa de resposta (url)
  //then - serve para processar a resposta

  /**
   *
   * Objetivo de uma Promise.All é receber diversas requisições (fetch) de uma vez só e
   * processar o resultado em uma única then(). Ou seja, ele concatena vários fetch() juntos.
   * No exemplo abaixo ele vai fazer 4 requisições de uma vez só. Observe:
   *
   * Promise.all([
   *
   *    fetch('https://pokeapi.co/api/v2/pokemon/1'),
   *    fetch('https://pokeapi.co/api/v2/pokemon/2'),
   *    fetch('https://pokeapi.co/api/v2/pokemon/3'),
   *    fetch('https://pokeapi.co/api/v2/pokemon/4')
   *
   * ]).then((results) => {
   *
   *    console.log(results);
   *
   * })
   *
   */

  /**
   * 
   * "Uma lista de promessas do detalhe do pokemon em json"
   * 
   * .then((pokemons => pokemons.map(pokemon) => fetch(pokemon.url).then((response) => response.json())))
   * 
   * Isso dá origem a Promise.All que precisará fazer várias requisições. Onde? em pokemon.url (em cada uma).
   * 
   * pokemons.map - transforma a lista em uma "lista de busca do detalhe".
   * 
   */

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) //.then((pokemons => pokemons.map(pokemon) => fetch(pokemon.url).then((response) => response.json())))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails);

    // .then((pokemonsDetails) => {
    //     console.log(pokemonsDetails);
    // });

};
