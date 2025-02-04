import { Outlet } from "react-router";
import type { Route } from "./+types/home";
import Header from "~/components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import PokemonContainer from "~/components/PokemonContainer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [pokemonData, setPokemonData] = useState<Array<any>>([]);
  const [pokemonImages, setPokemonImages] = useState<Array<string>>([]);

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
      });
  }, []);

  return (
    <div>
      <Header />
      <Outlet />
      <div className="flex flex-row flex-wrap p-10">
        {pokemonData.map((data, index) => (
          <PokemonContainer
            key={index}
            pokemonId={data.entry_number}
            pokemonName={data.pokemon_species.name}
            pokemonImg={`https://img.pokemondb.net/artwork/${data.pokemon_species.name}.jpg`}
          />
        ))}
      </div>
    </div>
  );
}
