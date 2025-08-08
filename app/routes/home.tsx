import type { Route } from "./+types/home";
import {ContentList} from "../content/content";
import Navbar from "~/navbar/navbar";
import { SearchProvider } from "~/content/searchContext";
import { TimeOfM3Provider } from "~/content/timeOfM3Conext";
import { IsModalOpenProvider } from "~/content/modalContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "M3 DataBase" },
    { name: "description", content: "For easy query of the M3 Music Catalogue" },
  ];
}

export default function Home() {
  return (
    <div>
      <SearchProvider>
        <TimeOfM3Provider>
          <IsModalOpenProvider>
            <Navbar/>
            <ContentList/>  
          </IsModalOpenProvider>
        </TimeOfM3Provider>
      </SearchProvider>
    </div>
  );
}
