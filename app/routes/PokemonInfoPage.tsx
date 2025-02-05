import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

export default function PokemonInfoPage() {
  const params = useParams();
  const [pokemonData, setPokemonData] = useState<any | null>(null);

  useEffect(() => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${params.PokemonName}`)

      .then((res) => {
        const data = res.data;

        setPokemonData(data);

        console.log(data);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!pokemonData) {
    return <div>Loading Pokémon data...</div>;
  }

  return (
    <div className="flex flex-col p-3">
      <h1 className="text-5xl capitalize">{params.PokemonName}</h1>
      <div className="w-80 h-80 bg-gray-100 rounded-lg flex items-center justify-center">
        <img
          className="w-full h-full object-contain p-4"
          src={`https://img.pokemondb.net/artwork/${params.PokemonName}.jpg`}
          alt={params.PokemonName}
        />
      </div>
      <span>Pokemon Sprites:</span>
      <div className="flex">
        <img
          className="w-30 h-30 bg-gray-100 rounded-lg"
          src={pokemonData.sprites.back_default}
        />
        <img
          className="w-30 h-30 bg-gray-100 rounded-lg ml-2"
          src={pokemonData.sprites.front_default}
        />
      </div>
      <span>Shiny Pokemon Sprites:</span>
      <div className="flex">
        <img
          className="w-30 h-30 bg-gray-100 rounded-lg"
          src={pokemonData.sprites.back_shiny}
        />
        <img
          className="w-30 h-30 -ml-6 bg-gray-100 rounded-lg ml-2"
          src={pokemonData.sprites.front_shiny}
        />
      </div>

      <div></div>

      <span>{pokemonData.order}</span>
    </div>
  );
}
