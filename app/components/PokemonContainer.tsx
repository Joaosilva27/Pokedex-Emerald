interface PokemonContainerProps {
  pokemonId: number;
  pokemonName: string;
  pokemonImg: string;
  pokemonType: string;
}

export default function PokemonContainer({
  pokemonName,
  pokemonId,
  pokemonImg,
}: PokemonContainerProps) {
  return (
    <div className="flex-auto flex flex-col items-center mb-8 p-5">
      <span>{pokemonId}</span>
      <img src={pokemonImg} className="max-h-20 max-w-20 object-fit " />
      <span>{pokemonName}</span>
    </div>
  );
}
