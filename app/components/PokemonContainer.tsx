interface PokemonContainerProps {
  pokemonId: number;
  pokemonName: string;
  pokemonImg: string;
  pokemonType: string;
}

export default function PokemonContainer({
  pokemonName,
  pokemonId,
}: PokemonContainerProps) {
  return (
    <div>
      <span>{pokemonId}</span>
      <span>{pokemonName}</span>
    </div>
  );
}
