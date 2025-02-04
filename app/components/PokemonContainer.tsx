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
    <div className="flex-auto flex flex-col items-center mb-8 p-5 w-30 h-30 justify-center">
      <span className="text-zinc-500">#{pokemonId}</span>
      <img src={pokemonImg} className="object-scale-down h-19 w-20" />
      <span className="capitalize">{pokemonName}</span>
    </div>
  );
}
