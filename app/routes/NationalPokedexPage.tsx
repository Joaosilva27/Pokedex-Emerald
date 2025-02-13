import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import PokeballLoadingIcon from "~/icons/pokeball.png";
import SearchBarIcon from "~/icons/glass.png";
import PokemonContainer from "~/components/PokemonContainer";

export default function Home() {
  const [pokemonData, setPokemonData] = useState<Array<any>>([]);
  const [originalPokemonData, setOriginalPokemonData] = useState<Array<any>>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState<any>("");

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokedex/1")
      .then((res) => {
        const data = res.data.pokemon_entries;
        setPokemonData(data);
        setOriginalPokemonData(data);
      })
      .catch((error) => {
        console.log(`Error trying to fetch the data: ${error}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onPokemonSearch = (e) => {
    e.preventDefault();
    if (searchInput === "") {
      setPokemonData(originalPokemonData);
    } else {
      // Filter based on the search input
      const filteredResults = originalPokemonData.filter(
        (pokemon) =>
          pokemon.pokemon_species.name
            .toLowerCase()
            .includes(searchInput.toLowerCase()) // Case-insensitive filter
      );
      setPokemonData(filteredResults);
    }
  };

  return (
    <div
      title="National Pokédex"
      className="flex flex-col justify-center items-center"
    >
      <div className="flex items-center justify-center m-4">
        <h1 className="text-4xl">
          Pokémon <span className="text-red-600">National</span> Pokédex
        </h1>
      </div>
      <Link to="/">
        <button className="flex items-center justify-center cursor-pointer underline">
          <h1 className="text-xl">
            <span>Click here to view the&nbsp;</span>
            <span className="text-emerald-600">Emerald</span> Pokédex instead.
          </h1>
        </button>
      </Link>
      <form className="text-lg flex justify-center" onSubmit={onPokemonSearch}>
        <input
          className="focus:outline-none"
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          placeholder="Search for a Pokémon..."
        ></input>
        <button type="button" onClick={onPokemonSearch}>
          <img className="w-5 h-5" src={SearchBarIcon} />
        </button>
      </form>

      <Outlet />

      {isLoading ? (
        <div className="flex flex-center items-center text-4xl mt-60">
          <div className="flex items-center">
            <span>Loading...</span>
            <img src={PokeballLoadingIcon} className="ml-2 h-8 w-8" />
          </div>
        </div>
      ) : (
        <div className="flex flex-row justify-center flex-wrap p-10 pt-2">
          {pokemonData.map((data, index) => (
            <Link key={index} to={`/${data.entry_number}`}>
              <PokemonContainer
                pokemonId={data.entry_number}
                pokemonName={data.pokemon_species.name}
                pokemonImg={`https://img.pokemondb.net/artwork/${data.pokemon_species.name}.jpg`}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
