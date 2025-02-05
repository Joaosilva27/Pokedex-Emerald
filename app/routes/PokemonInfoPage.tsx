import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import PokeballLoadingIcon from "~/icons/pokeball.png";

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

  const PokemonSpriteContainer = ({ imgFront, imgBack, text }) => {
    {
      /* For the pokemon that are not in a certain game the fetching result is always null */
    }
    if (imgFront == null) {
      return (
        <div>
          <div className="flex items-center flex-col w-fit mt-4">
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
      <div className="w-80 h-80 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
        <h1 className="text-4xl capitalize">{params.PokemonName}</h1>

        <img
          className="w-full h-full object-contain p-4"
          src={`https://img.pokemondb.net/artwork/${params.PokemonName}.jpg`}
          alt={params.PokemonName}
        />
      </div>

      {/* Pokemon Sprites */}
      <span className="mt-8">
        <span className="capitalize text-center">{params.PokemonName}</span>'s
        Sprites Throughout the different generations:
      </span>

      {/* Pokemon Emerald Sprites (fetching ruby-sapphire becausefor some reason emerald object does not contain the back_default as a property) */}
      <div className="flex flex-wrap justify-center">
        <PokemonSpriteContainer
          text="Pokemon Emerald Sprites"
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
          text="Pokemon Emerald Shiny Sprites"
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
          text="Pokemon FireRed / LeafGreen Sprites"
          imgBack={
            pokemonData.sprites.versions["generation-iii"]["firered-leafgreen"]
              .front_default
          }
          imgFront={
            pokemonData.sprites.versions["generation-iii"]["firered-leafgreen"]
              .back_default
          }
        />

        <PokemonSpriteContainer
          text="Pokemon FR / LF Shiny Sprites"
          imgBack={
            pokemonData.sprites.versions["generation-iii"]["firered-leafgreen"]
              .back_shiny
          }
          imgFront={
            pokemonData.sprites.versions["generation-iii"]["firered-leafgreen"]
              .front_shiny
          }
        />
      </div>

      {/* Pokemon Platinum Sprites (once again fetching from different versions (pearl/diamond) due to platinum object not having all the right properties)  */}
      <div className="flex flex-wrap justify-center">
        <PokemonSpriteContainer
          text="Pokemon Platinum Sprites"
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
          text="Pokemon Platinum Shiny Sprites"
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
          text="Pokemon HeartGold / SoulSilver Sprites"
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
          text="Pokemon HG / SS Shiny Sprites"
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
          text="Pokemon Black & White Sprites"
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
          text="Pokemon B&W Shiny Sprites"
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

      {/* For some reason PokeAPI does not have 'back' sprites from this generation on, so I will be showing only the front and its shiny version */}
      <span className="mt-4 text-center">
        Due to PokeAPI limitations, sprites from X/Y generation forward only
        front sprites of Pokemon can be shown{" "}
      </span>
      {/* Pokemon X & Y */}
      <div className="flex w-fit flex-wrap justify-center">
        <PokemonSpriteContainer
          text="Pokemon X & Y Default and Shiny Sprites"
          imgBack={
            pokemonData.sprites.versions["generation-vi"]["x-y"].front_default
          }
          imgFront={
            pokemonData.sprites.versions["generation-vi"]["x-y"].front_shiny
          }
        />

        {/* Pokemon OmegaRuby / AlphraSapphire Sprites */}
        <PokemonSpriteContainer
          text="Pokemon OmegaRuby / AlphaSapphire Default and Shiny Sprites"
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
          text="Pokemon Ultra-Sun / Ultra-Moon Sprites"
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
  );
}
