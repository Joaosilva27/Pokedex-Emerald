import { Outlet } from "react-router";
import type { Route } from "./+types/home";
import Header from "~/components/Header";
import { use, useEffect, useState } from "react";
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
  const [isPokedexNational, setIsPokedexNational] = useState(false);

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokedex/hoenn/")
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

  const ShowNationalPokedex = () => {
    axios
      .get("https://pokeapi.co/api/v2/pokedex/1")
      .then((res) => {
        const data = res.data.pokemon_entries;

        setPokemonData(data);
      })
      .finally(() => {
        setIsPokedexNational(true);
      });
  };

  const DeoxysContainer = () => {
    return (
      <div className="flex flex-wrap justify-center">
        <Link to={`/deoxys-normal`}>
          <PokemonContainer
            pokemonId={202}
            pokemonName="Deoxys-Normal"
            pokemonImg={`https://img.pokemondb.net/artwork/deoxys.jpg`}
          />
        </Link>

        <Link to={`/deoxys-attack`}>
          <PokemonContainer
            pokemonId={203}
            pokemonName="Deoxys-ATK"
            pokemonImg={`https://img.pokemondb.net/artwork/deoxys-attack.jpg`}
          />
        </Link>

        <Link to={`/deoxys-defense`}>
          <PokemonContainer
            pokemonId={204}
            pokemonName="Deoxys-DEF"
            pokemonImg={`https://img.pokemondb.net/artwork/deoxys-defense.jpg`}
          />
        </Link>

        <Link to={`/deoxys-speed`}>
          <PokemonContainer
            pokemonId={205}
            pokemonName="Deoxys-SPD"
            pokemonImg={`https://img.pokemondb.net/artwork/deoxys-speed.jpg`}
          />
        </Link>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Header />
      <button
        onClick={ShowNationalPokedex}
        className="flex items-center justify-center cursor-pointer"
      >
        <h1 className="text-xl">
          <span>Click here to view the&nbsp;</span>
          <span className="text-red-600">National</span> Pokédex instead.
        </h1>
      </button>
      <Outlet />

      {isLoading ? (
        <div className="flex flex-center items-center text-4xl mt-60">
          <div className="flex items-center">
            <span>Loading...</span>
            <img src={PokeballLoadingIcon} className="ml-2 h-8 w-8" />
          </div>
        </div>
      ) : isPokedexNational == false ? (
        <div className="flex flex-row justify-center flex-wrap p-10 pt-2">
          {pokemonData.slice(0, 201).map((data, index) => (
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
          <DeoxysContainer />
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
