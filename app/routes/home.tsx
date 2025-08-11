import type { Route } from "./+types/home";
import {ContentList} from "../content/content";
import Navbar from "~/navbar/navbar";
import { SearchProvider } from "~/content/searchContext";
import { TimeOfM3Provider } from "~/content/timeOfM3Conext";
import { IsModalOpenProvider } from "~/content/modalContext";
import { TagsProvider } from "~/content/discovery";
import { CacheContextProvider } from "~/content/cacheContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "M3 DataBase" },
    { name: "description", content: "For easy query of the M3 Music Catalogue" },
  ];
}

export default function Home() {
  return (
    <div>
      <CacheContextProvider>
        <SearchProvider>
          <TimeOfM3Provider>
            <IsModalOpenProvider>
              <TagsProvider>
                <Navbar/>
                <ContentList/>  
              </TagsProvider>
            </IsModalOpenProvider>
          </TimeOfM3Provider>
        </SearchProvider>
      </CacheContextProvider>
      
    </div>
  );
}
