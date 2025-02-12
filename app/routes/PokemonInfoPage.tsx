import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import axios from "axios";
import PokeballLoadingIcon from "~/icons/pokeball.png";
import HomeIcon from "~/icons/home.png";
import PokemonEvolutionLineArrowIcon from "~/icons/arrow.png";
import GameboyIcon from "~/icons/gb.png";
import GameboyColorIcon from "~/icons/gbc.jpg";
import GameboyAdvanceIcon from "~/icons/gba.png";
import NintendoIcon from "~/icons/dsi.png";
import Nintendo3dsIcon from "~/icons/3ds.png";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";
import Handsontable from "handsontable/base";
import { registerAllModules } from "handsontable/registry";
import { HotTable } from "@handsontable/react-wrapper";

registerAllModules();

export default function PokemonInfoPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [pokemonData, setPokemonData] = useState<any | null>(null);
  const [pokedexEntries, setPokedexEntries] = useState<any | null>(null);
  const [pokemonEvolutionLine, setPokemonEvolutionLine] = useState<any | null>(
    null
  );

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

        return axios.get(res.data.evolution_chain.url);
      })
      .then((res) => {
        setPokemonEvolutionLine(res.data);
        console.log(res.data);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);

  const PokemonSpriteContainer = ({ imgFront, imgBack, text, deviceIcon }) => {
    if (imgFront != null) {
      return (
        <div>
          <div className="flex items-center flex-col w-fit mt-4 ml-8">
            <div className="flex">
              {deviceIcon && (
                <img
                  className="h-7 w-7 mr-1 object-scale-down"
                  src={deviceIcon}
                />
              )}
              <span>{text}:</span>
            </div>
            <div className="flex">
              <img
                className="w-30 h-30 bg-gray-100 rounded-lg object-scale-down"
                src={imgBack}
              />
              <img
                className="w-30 h-30 bg-gray-100 rounded-lg ml-2 object-scale-down"
                src={imgFront}
              />
            </div>
          </div>
        </div>
      );
    }
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
    const gameNameColor = {
      red: "text-red-500",
      blue: "text-blue-500",
      yellow: "text-yellow-200",
      gold: "text-yellow-500",
      silver: "text-gray-400",
      crystal: "text-purple-500",
      ruby: "text-red-600",
      sapphire: "text-blue-600",
      emerald: "text-green-500",
      firered: "text-orange-600",
      leafgreen: "text-green-700",
      diamond: "text-blue-400",
      pearl: "text-pink-400",
      platinum: "text-blue-900",
      heartgold: "text-yellow-500",
      soulsilver: "text-gray-700",
      black: "text-gray-900",
      white: "text-gray-300",
      "black-2": "text-gray-900",
      "white-2": "text-gray-300",
      x: "text-indigo-600",
      y: "text-yellow-600",
      "omega-ruby": "text-red-500",
      "alpha-sapphire": "text-blue-500",
      sun: "text-yellow-400",
      "ultra-sun": "text-yellow-600",
      moon: "text-blue-200",
      "ultra-moon": "text-blue-400",
      sword: "text-blue-900",
      shield: "text-red-900",
      "lets-go-pikachu": "text-yellow-300",
      "lets-go-eevee": "text-orange-950",
      "legends-arceus": "text-blue-900",
    };

    return (
      <div className="flex flex-wrap items-center bg-gray-100 mt-2 w-full">
        <div className="flex items-center p-4 flex-wrap">
          <span
            className={`capitalize text-xl mr-4 ${
              gameNameColor[pokemonGameName] || "text-black"
            }`}
          >
            {pokemonGameName}
          </span>
          <span className="text-lg">{entryText}</span>
        </div>
      </div>
    );
  };

  const PokemonEvolutionLineContainer = () => {
    return (
      <div className="flex w-full justify-center mt-3">
        {pokemonEvolutionLine.chain.species.name != null &&
        pokemonEvolutionLine.chain.evolves_to[0]?.species?.name == null ? (
          <div className="text-center">
            <span className="capitalize">{pokemonData.name}&nbsp;</span>
            <span>
              does not have regular evolutions in any of the Pokémon games
              (ignoring Mega Evolutions).
            </span>
          </div>
        ) : (
          pokemonEvolutionLine.chain.evolves_to[0]?.species?.name != null && (
            <div className="flex items-center">
              <a href={`/${pokemonEvolutionLine.chain.species.name}`}>
                <div className="flex flex-col items-center mr-4">
                  <img // fetching the 1st pokemon in evolution line (or the only pokemon in case of no evolution)
                    src={`https://img.pokemondb.net/artwork/${pokemonEvolutionLine.chain.species.name}.jpg`}
                    className="h-20 w-25 object-scale-down"
                    alt={pokemonEvolutionLine.chain.species.name}
                  />
                  <span className="capitalize">
                    {pokemonEvolutionLine.chain.species.name}
                  </span>
                </div>
              </a>

              <div className="flex flex-col items-center text-center">
                <span>
                  {pokemonEvolutionLine.chain.evolves_to[0] // The monstrosity from here below is due to my lazyness but I'm too burned out to fix it. 08/02/2025
                    ?.evolution_details[0]?.min_level != null ? (
                    <span>
                      (Level&nbsp;
                      {
                        pokemonEvolutionLine.chain.evolves_to[0]
                          .evolution_details[0].min_level
                      }
                      )
                    </span>
                  ) : pokemonEvolutionLine.baby_trigger_item != null ? (
                    <span>({pokemonEvolutionLine.baby_trigger_item.name})</span>
                  ) : pokemonEvolutionLine.chain.evolves_to[0]
                      ?.evolution_details[0]?.held_item?.name != null ? (
                    <span className="capitalize">
                      (
                      {
                        pokemonEvolutionLine.chain.evolves_to[0]
                          .evolution_details[0].held_item.name
                      }
                      )
                    </span>
                  ) : pokemonEvolutionLine.chain.evolves_to[0]
                      ?.evolution_details[0]?.item?.name != null ? (
                    <span className="capitalize">
                      (
                      {
                        pokemonEvolutionLine.chain.evolves_to[0]
                          .evolution_details[0].item.name
                      }
                      )
                    </span>
                  ) : pokemonEvolutionLine.chain.evolves_to[0]
                      ?.evolution_details[0]?.min_happiness != null ? (
                    <div className="capitalize">
                      (<span>Reach minimum happiness</span>&nbsp;
                      {
                        pokemonEvolutionLine.chain.evolves_to[0]
                          .evolution_details[0].min_happiness
                      }
                      )
                    </div>
                  ) : pokemonEvolutionLine.chain.evolves_to[0]
                      ?.evolution_details[0]?.min_beauty != null ? (
                    <div className="capitalize">
                      (<span>Reach minimum beauty</span>&nbsp;
                      {
                        pokemonEvolutionLine.chain.evolves_to[0]
                          .evolution_details[0].min_beauty
                      }
                      )
                    </div>
                  ) : pokemonEvolutionLine.chain.evolves_to[0]
                      ?.evolution_details[0]?.location?.name != null ? (
                    <div className="capitalize">
                      (<span>Lvl up while being located at</span>&nbsp;
                      {
                        pokemonEvolutionLine.chain.evolves_to[0]
                          .evolution_details[0].location.name
                      }
                      )
                    </div>
                  ) : pokemonEvolutionLine.chain.evolves_to[0]
                      ?.evolution_details[0]?.trigger.name != null ? (
                    <div className="capitalize">
                      (
                      {
                        pokemonEvolutionLine.chain.evolves_to[0]
                          .evolution_details[0].trigger.name
                      }
                      )
                    </div>
                  ) : (
                    <div></div>
                  )}
                </span>
                <img src={PokemonEvolutionLineArrowIcon} className="w-10 h-5" />
              </div>
              <a
                href={`/${pokemonEvolutionLine.chain.evolves_to[0].species.name}`}
              >
                <div className="flex flex-col items-center ml-6 mr-6">
                  <img // fetching the 2nd pokemon in evolution line
                    src={`https://img.pokemondb.net/artwork/${pokemonEvolutionLine.chain.evolves_to[0].species.name}.jpg`}
                    className="h-20 w-25 object-scale-down"
                    alt={pokemonEvolutionLine.chain.evolves_to[0].species.name}
                  />
                  <span className="capitalize">
                    {pokemonEvolutionLine.chain.evolves_to[0].species.name}
                  </span>
                </div>
              </a>
            </div>
          )
        )}

        {pokemonEvolutionLine.chain.evolves_to[0]?.evolves_to[0]?.species
          ?.name != null && (
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <span>
                {pokemonEvolutionLine.chain.evolves_to[0]?.evolves_to[0]
                  ?.evolution_details[0]?.item != null ? (
                  <span className="capitalize">
                    (
                    {
                      pokemonEvolutionLine.chain.evolves_to[0].evolves_to[0]
                        .evolution_details[0].item.name
                    }
                    )
                  </span>
                ) : pokemonEvolutionLine.chain.evolves_to[0]?.evolves_to[0]
                    ?.evolution_details[0]?.held_item?.name != null ? (
                  <span className="capitalize">
                    (
                    {
                      pokemonEvolutionLine.chain.evolves_to[0].evolves_to[0]
                        .evolution_details[0].held_item.name
                    }
                    )
                  </span>
                ) : pokemonEvolutionLine.chain.evolves_to[0]?.evolves_to[0]
                    ?.evolution_details[0]?.min_level != null ? (
                  <span>
                    (Level&nbsp;
                    {
                      pokemonEvolutionLine.chain.evolves_to[0].evolves_to[0]
                        .evolution_details[0].min_level
                    }
                    )
                  </span>
                ) : pokemonEvolutionLine.baby_trigger_item != null ? (
                  <span>({pokemonEvolutionLine.baby_trigger_item.name})</span>
                ) : pokemonEvolutionLine.chain.evolves_to[0]?.evolves_to[0]
                    ?.evolution_details[0]?.min_beauty != null ? (
                  <div className="capitalize">
                    (
                    {
                      pokemonEvolutionLine.chain.evolves_to[0].evolves_to[0]
                        .evolution_details[0].min_beauty
                    }
                    )
                  </div>
                ) : pokemonEvolutionLine.chain.evolves_to[0]?.evolves_to[0]
                    ?.evolution_details[0]?.min_happiness != null ? (
                  <div className="capitalize">
                    (<span>Reach minimum happiness</span>&nbsp;
                    {
                      pokemonEvolutionLine.chain.evolves_to[0].evolves_to[0]
                        .evolution_details[0].min_happiness
                    }
                    )
                  </div>
                ) : pokemonEvolutionLine.chain.evolves_to[0]?.evolves_to[0]
                    ?.evolution_details[0]?.location?.name != null ? (
                  <div className="capitalize">
                    (<span>Lvl up while being located at</span>&nbsp;
                    {
                      pokemonEvolutionLine.chain.evolves_to[0].evolves_to[0]
                        .evolution_details[0].location.name
                    }
                    )
                  </div>
                ) : pokemonEvolutionLine.chain.evolves_to[0]?.evolves_to[0]
                    ?.evolution_details[0]?.trigger.name != null ? (
                  <div className="capitalize">
                    (
                    {
                      pokemonEvolutionLine.chain.evolves_to[0].evolves_to[0]
                        .evolution_details[0].trigger.name
                    }
                    )
                  </div>
                ) : (
                  <div></div>
                )}
              </span>
              <img src={PokemonEvolutionLineArrowIcon} className="w-10 h-5" />
            </div>

            <a
              href={`/${pokemonEvolutionLine.chain.evolves_to[0].evolves_to[0].species.name}`}
            >
              <div className="flex flex-col items-center">
                <img // fetching the 3rd pokemon in evolution line
                  src={`https://img.pokemondb.net/artwork/${pokemonEvolutionLine.chain.evolves_to[0].evolves_to[0].species.name}.jpg`}
                  className="h-20 w-25 object-scale-down ml-4"
                  alt={
                    pokemonEvolutionLine.chain.evolves_to[0].evolves_to[0]
                      .species.name
                  }
                />
                <span className="capitalize">
                  {
                    pokemonEvolutionLine.chain.evolves_to[0].evolves_to[0]
                      .species.name
                  }
                </span>
              </div>
            </a>
          </div>
        )}
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
          <div className="flex items-center justify-center">
            <div className="absolute flex flex-col pt-5 pl-3">
              <button onClick={() => navigate(-1)} className="cursor-pointer">
                <img src={HomeIcon} className="w-5 h-5 relative right-40" />
                <span className="relative right-40">Back</span>
              </button>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-4xl capitalize">{pokemonData.name}</h1>
              <span>
                <span className="capitalize">{pokemonData.name}</span> is a
                <span>
                  {pokemonData.types.map((array) => {
                    return (
                      <span className="ml-1 capitalize">{array.type.name}</span>
                    );
                  })}{" "}
                  type Pokémon
                </span>
              </span>
              <span className="capitalize">
                Introduced in {pokedexEntries?.generation.name}
              </span>
            </div>
          </div>

          <img
            className="w-full h-full object-contain p-4"
            src={`https://img.pokemondb.net/artwork/${pokemonData.name}.jpg`}
            alt={pokemonData.name}
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
            {pokemonData.name}'s cry{" "}
            <img
              src={`https://github.com/msikma/pokesprite/blob/master/icons/pokemon/regular/${pokemonData.name}.png?raw=true`}
              className="w-fit h-10 animate-bounce animate-infinite"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
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

        {/* Pokemon evolution line */}
        <div className="w-90 h-90 flex flex-col items-center justify-center">
          <h1 className="text-3xl">Evolution line</h1>
          {pokemonEvolutionLine != null && <PokemonEvolutionLineContainer />}
        </div>
      </div>

      {/* Pokemon Sprites */}
      <div className="flex justify-center flex-wrap">
        <div className="text-center mt-8 mr-10">
          <span className="text-2xl capitalize">
            {pokemonData.name}'s sprites across the different generations:
          </span>

          {/* Pokemon Red and Blue */}
          <div className="flex flex-wrap justify-center">
            <PokemonSpriteContainer
              deviceIcon={GameboyColorIcon}
              text="Gameboy Color Red / Blue Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-i"]["red-blue"]
                  .back_default
              }
              imgFront={
                pokemonData.sprites.versions["generation-i"]["red-blue"]
                  .front_default
              }
            />

            <PokemonSpriteContainer
              deviceIcon={GameboyIcon}
              text="Original Gameboy R/B Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-i"]["red-blue"]
                  .back_gray
              }
              imgFront={
                pokemonData.sprites.versions["generation-i"]["red-blue"]
                  .front_gray
              }
            />
          </div>

          {/* Pokemon Yellow */}
          <div className="flex flex-wrap justify-center">
            <PokemonSpriteContainer
              deviceIcon={GameboyColorIcon}
              text="Gameboy Color Yellow Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-i"]["yellow"]
                  .back_default
              }
              imgFront={
                pokemonData.sprites.versions["generation-i"]["yellow"]
                  .front_default
              }
            />

            <PokemonSpriteContainer
              deviceIcon={GameboyIcon}
              text="Original Gameboy Yellow Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-i"]["yellow"].back_gray
              }
              imgFront={
                pokemonData.sprites.versions["generation-i"]["yellow"]
                  .front_gray
              }
            />
          </div>

          {/* Pokemon Gold and Silver */}
          <div className="flex flex-wrap justify-center">
            <PokemonSpriteContainer
              deviceIcon={GameboyColorIcon}
              text="Gold / Silver Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-ii"]["gold"]
                  .back_default
              }
              imgFront={
                pokemonData.sprites.versions["generation-ii"]["gold"]
                  .front_default
              }
            />

            <PokemonSpriteContainer
              deviceIcon={GameboyColorIcon}
              text="G/S Shiny Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-ii"]["gold"].back_shiny
              }
              imgFront={
                pokemonData.sprites.versions["generation-ii"]["gold"]
                  .front_shiny
              }
            />
          </div>

          {/* Pokemon Gold and Silver */}
          <div className="flex flex-wrap justify-center">
            <PokemonSpriteContainer
              deviceIcon={GameboyColorIcon}
              text="Crystal Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-ii"]["crystal"]
                  .back_default
              }
              imgFront={
                pokemonData.sprites.versions["generation-ii"]["crystal"]
                  .front_default
              }
            />

            <PokemonSpriteContainer
              deviceIcon={GameboyColorIcon}
              text="Crystal Shiny Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-ii"]["crystal"]
                  .back_shiny
              }
              imgFront={
                pokemonData.sprites.versions["generation-ii"]["crystal"]
                  .front_shiny
              }
            />
          </div>

          {/* Pokemon Emerald Sprites (fetching ruby-sapphire becausefor some reason emerald object does not contain the back_default as a property) */}
          <div className="flex flex-wrap justify-center">
            <PokemonSpriteContainer
              deviceIcon={GameboyAdvanceIcon}
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
              deviceIcon={GameboyAdvanceIcon}
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
              deviceIcon={GameboyAdvanceIcon}
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
              deviceIcon={GameboyAdvanceIcon}
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
              deviceIcon={NintendoIcon}
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
              deviceIcon={NintendoIcon}
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
              deviceIcon={NintendoIcon}
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
              deviceIcon={NintendoIcon}
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
              deviceIcon={NintendoIcon}
              text="Black & White Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-v"]["black-white"]
                  .animated.back_default
              }
              imgFront={
                pokemonData.sprites.versions["generation-v"]["black-white"]
                  .animated.front_default
              }
            />

            <PokemonSpriteContainer
              deviceIcon={NintendoIcon}
              text="B&W Shiny Sprites"
              imgBack={
                pokemonData.sprites.versions["generation-v"]["black-white"]
                  .animated.back_shiny
              }
              imgFront={
                pokemonData.sprites.versions["generation-v"]["black-white"]
                  .animated.front_shiny
              }
            />
          </div>

          {/* Pokemon Sprites for all 3ds games. Fetching from showdown due to none of the 3ds entries endpoints having back_default sprites */}
          <div className="flex flex-wrap justify-center">
            <PokemonSpriteContainer
              deviceIcon={Nintendo3dsIcon}
              text="X&Y, ORAS and Sun/Moon Sprites"
              imgBack={pokemonData.sprites.other.showdown.back_default}
              imgFront={pokemonData.sprites.other.showdown.front_default}
            />

            <PokemonSpriteContainer
              deviceIcon={Nintendo3dsIcon}
              text="X&Y, ORAS and S/M Shiny Sprites"
              imgBack={pokemonData.sprites.other.showdown.back_shiny}
              imgFront={pokemonData.sprites.other.showdown.front_shiny}
            />
          </div>

          {/* Other Pokemon artwork/sprites */}
          <div className=" flex flex-col justify-center mt-10">
            <span className=" text-center text-xl underline">
              Other artwork{" "}
            </span>
            <div className="flex flex-wrap justify-center">
              <PokemonSpriteContainer
                text="Pokemon Dream World and Pokemon Home"
                imgBack={pokemonData.sprites.other.home.front_default}
                imgFront={pokemonData.sprites.other.dream_world.front_default}
              />

              <PokemonSpriteContainer
                text="Official Artwork Normal/Shiny"
                imgBack={
                  pokemonData.sprites.other["official-artwork"].front_default
                }
                imgFront={
                  pokemonData.sprites.other["official-artwork"].front_shiny
                }
              />
            </div>
          </div>
          <div className="mt-10 flex flex-col">
            <span className="text-2xl capitalize mb-2">
              {pokemonData.name}'s moves learnt by level-up:
            </span>
            <div
              className="capitalize"
              style={{
                margin: "0 auto",
                width: "10rem", // the only way i could find to center the table
              }}
            >
              <HotTable
                rowHeaders={false}
                colHeaders={["Lvl", "Name"]}
                data={pokemonData.moves
                  .filter(
                    (array) =>
                      array.version_group_details[0].level_learned_at !== 0
                  )
                  .sort(
                    (a, b) =>
                      a.version_group_details[0].level_learned_at -
                      b.version_group_details[0].level_learned_at
                  )
                  .map((array) => [
                    array.version_group_details[0].level_learned_at,
                    array.move.name,
                  ])}
                height="auto"
                autoWrapRow={true}
                autoWrapCol={true}
                licenseKey="non-commercial-and-evaluation"
              />
            </div>
            <span className="text-2xl capitalize mb-2 mt-6">
              {pokemonData.name}'s moves learnt by TM / Tutor / Eggs:
            </span>
            <div
              className="capitalize"
              style={{
                margin: "0 auto",
                width: "12rem",
              }}
            >
              <HotTable
                rowHeaders={false}
                colHeaders={["Tutor/TM", "Name"]}
                data={pokemonData.moves
                  .filter(
                    (array) =>
                      array.version_group_details[0].level_learned_at == 0
                  )

                  .map((array) => [
                    array.version_group_details[0].move_learn_method.name,
                    array.move.name,
                  ])}
                height="auto"
                autoWrapRow={true}
                autoWrapCol={true}
                licenseKey="non-commercial-and-evaluation"
              />
            </div>
          </div>
        </div>

        {/* Pokedex entries in english */}
        <div className="flex flex-col text-center mt-8 max-w-150">
          <div className="text-2xl capitalize">
            <span>{pokemonData.name}</span>'s Pokédex entries across the
            different generations:
          </div>
          {pokedexEntries ? (
            <div className="flex flex-col items-start mt-4">
              {pokedexEntries.flavor_text_entries
                .filter((lang) => lang.language.name == "en") // filtering for english pokedex entries...
                .map((array, key) => (
                  <PokedexEntriesContainer
                    key={key}
                    pokemonGameName={array.version.name}
                    entryText={array.flavor_text}
                  />
                ))}
            </div>
          ) : (
            <div>
              Could not fetch data from PokeAPI for any pokedex entries. If the
              Pokémon you are viewing has a normal-form, please check its page
              instead.
            </div>
          )}
        </div>
        <div className=" capitalize mt-8 ml-8 flex flex-col">
          <span className="text-2xl">
            {pokemonData.name}'s name in other languages:
          </span>
          <div className="bg-gray-100 p-4 mt-2 flex flex-col">
            <span>
              <span className="text-lg mr-1 text-gray-500">English:</span>{" "}
              <span className="text-xl">{pokedexEntries?.names[8].name}</span>
            </span>
            <span>
              <span className="text-lg mr-1 text-gray-500">Japanese:</span>{" "}
              <span className="text-xl">{pokedexEntries?.names[0].name}</span>
            </span>
            <span>
              <span className="text-lg mr-1 text-gray-500">Korean:</span>{" "}
              <span className="text-sm">{pokedexEntries?.names[2].name}</span>
            </span>
            <span>
              <span className="text-lg mr-1 text-gray-500">Chinese:</span>{" "}
              <span className="text-sm">{pokedexEntries?.names[3].name}</span>
            </span>
            <span>
              <span className="text-lg mr-1 text-gray-500">Spanish:</span>{" "}
              <span className="text-xl">{pokedexEntries?.names[6].name}</span>
            </span>
            <span>
              <span className="text-lg mr-1 text-gray-500">French:</span>{" "}
              <span className="text-xl">{pokedexEntries?.names[4].name}</span>
            </span>
            <span>
              <span className="text-lg mr-1 text-gray-500">German:</span>{" "}
              <span className="text-xl">{pokedexEntries?.names[5].name}</span>
            </span>
          </div>
          <div className=" capitalize mt-8 ml-8 flex flex-col">
            <span className="text-2xl">
              {pokemonData.name} type in other languages:
            </span>
            <div className="bg-gray-100 p-4 mt-2 flex flex-col">
              <span>
                <span className="text-lg mr-1 text-gray-500">English:</span>{" "}
                <span className="text-xl">
                  {pokedexEntries?.genera[7].genus}
                </span>
              </span>
              <span>
                <span className="text-lg mr-1 text-gray-500">Japanese:</span>{" "}
                <span className="text-xl">
                  {pokedexEntries?.genera[0].genus}
                </span>
              </span>
              <span>
                <span className="text-lg mr-1 text-gray-500">Korean:</span>{" "}
                <span className="text-sm">
                  {pokedexEntries?.genera[1].genus}
                </span>
              </span>
              <span>
                <span className="text-lg mr-1 text-gray-500">Chinese:</span>{" "}
                <span className="text-sm">
                  {pokedexEntries?.genera[2].genus}
                </span>
              </span>
              <span>
                <span className="text-lg mr-1 text-gray-500">Spanish:</span>{" "}
                <span className="text-xl">
                  {pokedexEntries?.genera[5].genus}
                </span>
              </span>
              <span>
                <span className="text-lg mr-1 text-gray-500">French:</span>{" "}
                <span className="text-xl">
                  {pokedexEntries?.genera[3].genus}
                </span>
              </span>
              <span>
                <span className="text-lg mr-1 text-gray-500">German:</span>{" "}
                <span className="text-xl">
                  {pokedexEntries?.genera[4].genus}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
