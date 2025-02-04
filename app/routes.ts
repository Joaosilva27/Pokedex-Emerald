import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route(":PokemonName", "routes/PokemonInfoPage.tsx"),
] satisfies RouteConfig;
