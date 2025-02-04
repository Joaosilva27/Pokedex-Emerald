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
      <img
        className="h-70 w-70"
        src={`https://img.pokemondb.net/artwork/${params.PokemonName}.jpg`}
      />
      <span>Pokemon Sprites:</span>
      <div className="flex">
        <img className="w-30 h-30" src={pokemonData.sprites.back_default} />
        <img
          className="w-30 h-30 -ml-6"
          src={pokemonData.sprites.front_default}
        />
      </div>
      <span>Shiny Pokemon Sprites:</span>
      <div className="flex">
        <img className="w-30 h-30" src={pokemonData.sprites.back_shiny} />
        <img
          className="w-30 h-30 -ml-6"
          src={pokemonData.sprites.front_shiny}
        />
      </div>

      <div></div>

      <span>{pokemonData.order}</span>
    </div>
  );
}
