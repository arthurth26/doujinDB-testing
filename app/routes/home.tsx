import type { Route } from "./+types/home";
import {Content} from "../content/content";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Content/>;
}
