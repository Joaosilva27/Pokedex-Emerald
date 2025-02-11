import { Outlet } from "react-router";
import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import PokeballLoadingIcon from "~/icons/pokeball.png";
import PokemonContainer from "~/components/PokemonContainer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Emerald Pokedex" },
    { name: "description", content: "Emerald Pokedex" },
  ];
}

export default function Home() {
  const [pokemonData, setPokemonData] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokedex/1")
      .then((res) => {
        const data = res.data.pokemon_entries;

        setPokemonData(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(`Error trying to fetch the data: ${error}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex items-center justify-center m-4">
        <h1 className="text-4xl">
          Pokémon <span className="text-red-600">National</span> Pokédex
        </h1>
      </div>
      <Link to="/">
        <button className="flex items-center justify-center cursor-pointer">
          <h1 className="text-xl">
            <span>Click here to view the&nbsp;</span>
            <span className="text-emerald-600">Emerald</span> Pokédex instead.
          </h1>
        </button>
      </Link>

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
            <>
              <Link to={`/${data.pokemon_species.name}`}>
                <PokemonContainer
                  key={index}
                  pokemonId={data.entry_number}
                  pokemonName={data.pokemon_species.name}
                  pokemonImg={`https://img.pokemondb.net/artwork/${data.pokemon_species.name}.jpg`}
                />
              </Link>
            </>
          ))}
        </div>
      )}
    </div>
  );
}
