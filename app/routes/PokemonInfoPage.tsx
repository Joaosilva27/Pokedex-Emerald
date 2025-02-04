import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

export default function PokemonInfoPage() {
  const params = useParams();
  const [pokemonData, setPokemonData] = useState<Array<any>>([]);

  useEffect(() => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${params.PokemonName}`)

      .then((res) => {
        const data = res.data;

        setPokemonData(data);

        console.log(pokemonData);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="flex flex-col">
      <h1 className="text-5xl capitalize">{params.PokemonName}</h1>
      <img
        className="h-70 w-70"
        src={`https://img.pokemondb.net/artwork/${params.PokemonName}.jpg`}
      />
      <span>Pokemon Sprites:</span>
      <img className="w-30 h-30" src={pokemonData.sprites.front_default} />
      <span>{pokemonData.order}</span>
    </div>
  );
}
