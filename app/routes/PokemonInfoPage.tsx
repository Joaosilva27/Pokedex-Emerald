import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import PokeballLoadingIcon from "~/icons/pokeball.png";
import MusicNoteIcon from "~/icons/note.png";

export default function PokemonInfoPage() {
  const params = useParams();
  const [pokemonData, setPokemonData] = useState<any | null>(null);
  const [pokedexEntries, setPokedexEntries] = useState<any | null>(null);

  useEffect(() => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${params.PokemonName}`)

      .then((res) => {
        const data = res.data;

        setPokemonData(data);

        console.log(data);

        return axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${data.id}`
        );
      })
      .then((res) => {
        setPokedexEntries(res.data);
        console.log(res.data);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);

  const PokemonSpriteContainer = ({ imgFront, imgBack, text }) => {
    {
      /* For the pokemon that are not in a certain game the fetching result is always null */
    }
    if (imgFront == null) {
      return (
        <div>
          <div className="flex items-center flex-col w-fit m-4">
            <span>{text}:</span>
            <div className="flex">
              <div className="w-60 h-30 bg-gray-100 rounded-lg flex justify-center items-center text-2xl text-center">
                <span>
                  <span className="capitalize">{params.PokemonName}</span> does
                  not appear in this game.
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="flex items-center flex-col w-fit mt-4 ml-8">
          <span>{text}:</span>
          <div className="flex">
            <img className="w-30 h-30 bg-gray-100 rounded-lg" src={imgBack} />
            <img
              className="w-30 h-30 bg-gray-100 rounded-lg ml-2"
              src={imgFront}
            />
          </div>
        </div>
      </div>
    );
  };

  const PokemonBaseStatsTotal = () => {
    // Calculating the total of all base_stat pokemon values
    const totalStats = pokemonData.stats.reduce(
      (acc, stats) => acc + stats.base_stat,
      0
    );

    return (
      <div>
        {pokemonData.stats.map((stats, index) => (
          <span
            key={index}
            className="border-b-1 pb-2 pt-2 flex justify-center items-center"
          >
            <span className="text-gray-400 capitalize">{stats.stat.name} </span>
            <span className="ml-2 text-xl">{stats.base_stat}</span>
          </span>
        ))}

        <div className="mt-4 text-lg text-gray-400">
          Total Stats:{" "}
          <span className="ml-1 text-2xl text-black font-bold">
            {totalStats}
          </span>
        </div>
      </div>
    );
  };

  const PokedexEntriesContainer = ({ pokemonGameName, entryText }) => {
    return (
      <div>
        <span>{pokemonGameName}</span>
        <span>{entryText}</span>
      </div>
    );
  };

  if (!pokemonData) {
    return (
      <div className="flex flex-center justify-center items-center text-4xl mt-60">
        <span>Loading...</span>
        <img src={PokeballLoadingIcon} className="ml-2 h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-3">
      {/* Main Pokemon Image with its respective name */}
      <div className="flex flex-wrap justify-center">
        <div className="w-80 h-90 flex flex-col items-center justify-center">
          <h1 className="text-4xl capitalize">{params.PokemonName}</h1>

          <img
            className="w-full h-full object-contain p-4"
            src={`https://img.pokemondb.net/artwork/${params.PokemonName}.jpg`}
            alt={params.PokemonName}
          />

          {/* Play the pokemon's cry */}
          <span
            className="capitalize flex items-center text-xl underline cursor-pointer"
            onClick={() => {
              const pokemonSoundUrl = pokemonData.cries.legacy;
              const playSound = new Audio(pokemonSoundUrl);
              playSound.play();
            }}
          >
            {params.PokemonName}'s cry{" "}
            <img src={MusicNoteIcon} className="w-10 h-10" />
          </span>
        </div>
        <div className="w-50 h-90 flex flex-col items-center justify-center">
          <h6 className="text-3xl">Pokédex data</h6>
          <div className="border-b-1 w-full flex justify-center items-center">
            <span className="text-gray-400">National № </span>
            <span className="text-xl ml-1">{pokemonData.id}</span>
          </div>
          <div className="flex items-center justify-center border-b-1 mb-2 w-full p-2">
            {/* Fetch pokemon type and conditionally get bg color. It's a mess but it is what it is */}
            <span className="text-gray-400 mr-1">Type</span>

            {pokemonData.types.map((array, key) => {
              const typeColorMap = {
                normal: "bg-gray-400",
                fighting: "bg-red-700",
                flying: "bg-blue-200",
                poison: "bg-purple-600",
                ground: "bg-amber-500",
                rock: "bg-yellow-700",
                bug: "bg-lime-500",
                ghost: "bg-purple-800",
                steel: "bg-slate-400",
                fire: "bg-red-600",
                water: "bg-blue-400",
                grass: "bg-green-500",
                electric: "bg-yellow-400",
                psychic: "bg-pink-500",
                ice: "bg-cyan-300",
                dragon: "bg-purple-700",
                dark: "bg-gray-800",
                fairy: "bg-pink-300",
              };

              return (
                <div>
                  <div
                    className={`${
                      typeColorMap[array.type.name] || "bg-gray-400"
                    } 
                  px-4 py-1 rounded-full text-white text-xl shadow-sm ml-1`}
                    key={key}
                  >
                    <span className="capitalize">{array.type.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Height and Weight calculation
            I divided both height and weight by 10 due to the api returning the kg result * 10
             (e.g. Rayquaza's height is 7meters but it returns 70).

            Added .toFixed(2) since calculation often returns way too many decimal digits.
            (e.g. Rayquaza's weight in lbs without .toFixed method is 45430000000001 kg, which is unnesseray since there is no need for precision)
          */}
          <span className="border-b-1 pb-2 w-full flex justify-center items-center">
            <span className="text-gray-400">Height </span>
            <span className="ml-1 text-xl">
              {pokemonData.height / 10}m /{" "}
              {((pokemonData.height / 10) * 3.28).toFixed(2)}ft
            </span>
          </span>
          <span className="border-b-1 pb-2 pt-2 w-full flex justify-center items-center">
            <span className="text-gray-400">Weight </span>
            <span className="ml-1 text-xl">
              {pokemonData.weight / 10}kg /{" "}
              {((pokemonData.weight / 10) * 2.2).toFixed(2)}
            </span>
            lbs
          </span>

          {/* Pokemon Special Abilities */}
          <div className="flex items-center border-b-1 pb-1 w-full justify-center">
            <span className="text-gray-400">Abilities</span>
            <div className="flex flex-col text-xl">
              {pokemonData.abilities.map((abilities, key) => (
                <span key={key} className="capitalize ml-2">
                  {abilities.ability.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pokemon base stats container */}
        <div className="w-80 h-90 flex flex-col items-center justify-center">
          <h1 className="text-3xl">Base stats</h1>
          <PokemonBaseStatsTotal />
        </div>
      </div>

      {/* Pokemon Sprites */}
      <div className="flex flex-wrap justify-center">
        <div className="text-center mt-8">
          <span className="text-2xl">
            <span className="capitalize">{params.PokemonName}</span>'s sprites
            across the different generations:
          </span>

          {/* Pokemon Emerald Sprites (fetching ruby-sapphire becausefor some reason emerald object does not contain the back_default as a property) */}
          <div className="flex flex-wrap justify-center">
            <PokemonSpriteContainer
              text="Emerald Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-iii"]["ruby-sapphire"]
                  .back_default
              }
              imgFront={
                pokemonData.sprites.versions["generation-iii"]["ruby-sapphire"]
                  .front_default
              }
            />

            <PokemonSpriteContainer
              text="Emerald Shiny Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-iii"]["ruby-sapphire"]
                  .back_shiny
              }
              imgFront={
                pokemonData.sprites.versions["generation-iii"]["ruby-sapphire"]
                  .front_shiny
              }
            />
          </div>

          {/* Pokemon FireRed / LeafGreen Sprites  */}
          <div className="flex flex-wrap justify-center">
            <PokemonSpriteContainer
              text="FireRed / LeafGreen Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-iii"][
                  "firered-leafgreen"
                ].back_default
              }
              imgFront={
                pokemonData.sprites.versions["generation-iii"][
                  "firered-leafgreen"
                ].front_default
              }
            />

            <PokemonSpriteContainer
              text="FR / LF Shiny Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-iii"][
                  "firered-leafgreen"
                ].back_shiny
              }
              imgFront={
                pokemonData.sprites.versions["generation-iii"][
                  "firered-leafgreen"
                ].front_shiny
              }
            />
          </div>

          {/* Pokemon Platinum Sprites (once again fetching from different versions (pearl/diamond) due to platinum object not having all the right properties)  */}
          <div className="flex flex-wrap justify-center">
            <PokemonSpriteContainer
              text="Platinum Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-iv"]["diamond-pearl"]
                  .back_default
              }
              imgFront={
                pokemonData.sprites.versions["generation-iv"]["diamond-pearl"]
                  .front_default
              }
            />

            <PokemonSpriteContainer
              text="Platinum Shiny Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-iv"]["diamond-pearl"]
                  .back_shiny
              }
              imgFront={
                pokemonData.sprites.versions["generation-iv"]["diamond-pearl"]
                  .front_shiny
              }
            />
          </div>

          {/* Pokemon HeartGold / SoulSilver Sprites */}
          <div className="flex flex-wrap justify-center">
            <PokemonSpriteContainer
              text="HeartGold / SoulSilver Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-iv"][
                  "heartgold-soulsilver"
                ].back_default
              }
              imgFront={
                pokemonData.sprites.versions["generation-iv"][
                  "heartgold-soulsilver"
                ].front_default
              }
            />

            <PokemonSpriteContainer
              text="HG / SS Shiny Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-iv"][
                  "heartgold-soulsilver"
                ].back_shiny
              }
              imgFront={
                pokemonData.sprites.versions["generation-iv"][
                  "heartgold-soulsilver"
                ].front_shiny
              }
            />
          </div>

          {/* Pokemon Black & White Sprites */}
          <div className="flex flex-wrap justify-center">
            <PokemonSpriteContainer
              text="Black & White Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-v"]["black-white"]
                  .back_default
              }
              imgFront={
                pokemonData.sprites.versions["generation-v"]["black-white"]
                  .front_default
              }
            />

            <PokemonSpriteContainer
              text="B&W Shiny Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-v"]["black-white"]
                  .back_shiny
              }
              imgFront={
                pokemonData.sprites.versions["generation-v"]["black-white"]
                  .front_shiny
              }
            />
          </div>

          {/* For some reason PokeAPI does not have 'back' sprites from this generation on,
       so I will be showing only the front and its shiny version */}

          {/* Pokemon X & Y */}
          <div className="flex w-160 flex-wrap justify-center mt-10">
            <span className=" text-center text-xl underline">
              Due to PokeAPI limitations, from X/Y generation forward only front
              sprites of Pokemon can be shown{" "}
            </span>
            <PokemonSpriteContainer
              text="X & Y Default and Shiny Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-vi"]["x-y"]
                  .front_default
              }
              imgFront={
                pokemonData.sprites.versions["generation-vi"]["x-y"].front_shiny
              }
            />

            {/* Pokemon OmegaRuby / AlphraSapphire Sprites */}
            <PokemonSpriteContainer
              text="OmegaRuby / AlphaSapphire Default and Shiny Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-vi"][
                  "omegaruby-alphasapphire"
                ].front_default
              }
              imgFront={
                pokemonData.sprites.versions["generation-vi"][
                  "omegaruby-alphasapphire"
                ].front_shiny
              }
            />

            {/* Pokemon Ultra-Sun / Ultra-Moon Sprites */}
            <PokemonSpriteContainer
              text="Ultra-Sun / Ultra-Moon Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-vii"][
                  "ultra-sun-ultra-moon"
                ].front_default
              }
              imgFront={
                pokemonData.sprites.versions["generation-vii"][
                  "ultra-sun-ultra-moon"
                ].front_shiny
              }
            />
          </div>
        </div>
        <div className="flex justify-center text-center mt-8">
          <div className="text-2xl capitalize">
            <span>{params.PokemonName}</span>'s sprites across the different
            generations:
          </div>
          {pokedexEntries ? (
            <div>
              {pokedexEntries.flavor_text_entries
                .slice(0, 16)
                .filter((array) => array.flavor_text.charAt(0) !== "S") {/* for some reason two texts (12, 14) were in french and both started with the word 'Ses' so this is a funny fucking way to remove them lmao */}
                .map((array, key) => (
                  <PokedexEntriesContainer
                    key={key}
                    pokemonGameName={array.version.name}
                    entryText={array.flavor_text}
                  />
                ))}
            </div>
          ) : (
            <div>Loading Entries...</div>
          )}
        </div>
      </div>
    </div>
  );
}
