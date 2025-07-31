import React from 'react';
import { useYearAndSeason } from '~/content/timeOfM3Conext';
import { useSearch } from '~/content/searchContext';

const SearchBar = ({searchTerm, setSearchTerm, tag, setTag}:
  {searchTerm:string,setSearchTerm: React.Dispatch<React.SetStateAction<string>>, tag:string, setTag:React.Dispatch<React.SetStateAction<string>>}) => {

    const [isSearchDropDownOpen, setIsSearchDropDownOpen] = React.useState<boolean>(false);
    const [searchTag, setSearchTag] = React.useState<string>('');
    const {categoryOptions} = useSearch();

    const searchDropDownRef = React.useRef<HTMLDivElement>(null)


    const toggleSearchDropDown = (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsSearchDropDownOpen(!isSearchDropDownOpen)
    };

    const handleTagOption = (option:string) => {
      setSearchTag(option);
      setTag(option);
      setIsSearchDropDownOpen(false);
    };

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchDropDownRef.current && !searchDropDownRef.current.contains(event.target as Node)) {
          setIsSearchDropDownOpen(false)
        }
      }
      document.addEventListener('click', handleClickOutside)
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }, [])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = e.target.value;

      if (newSearchTerm.slice(-1) === ' '){
        setSearchTerm(newSearchTerm.slice(0,-1));
      };

      setSearchTerm(newSearchTerm)
    }

    const handleTagChange = (e: React.ChangeEvent<HTMLButtonElement>) =>{
      const newTag = e.target.value;
      setTag(newTag)
    }
    
    return (
          <div id="searchBar" className='flex items-center justify-between w-180 h-15 p-3 bg-gray-700 rounded-full '>
            <input placeholder='Search...' onChange={handleSearchChange} value={searchTerm} className='bg-transparent text-gray-200 placeholder-gray-400 outline-none px-4 py-1 w-150'/>
          <div id="dropdown" className="relative flex-none" ref={searchDropDownRef}>
              <button id="dropdown button" onClick={toggleSearchDropDown} className="flex justify-between items-between w-48 h-10 text-gray-200 bg-gray-600 px-4 py-2 rounded-full hover:bg-gray-500"> 
                {searchTag || categoryOptions[0]}
              <svg
              className="ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
                </svg>
              </button>
            {isSearchDropDownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5">
                {categoryOptions.map((option, index) => (
                  <button key={index} value={tag} onClick={() =>handleTagOption(option)} className='block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-amber-200 hover:text-gray-800'>
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
      </div>
    )
}

const TimeDropDownList = () => {
  const { yearAndSeason, setYearAndSeason, yearAndSeasonOptions } = useYearAndSeason();
  const [yearAndSeasonListOpen, setYearAndSeasonListOpen] = React.useState<boolean>(false);
  const [yearAndSeasonSetting, setYearAndSeasonSetting] = React.useState<string>(yearAndSeasonOptions[0]);

  const yearAndSeasonRef = React.useRef<HTMLDivElement>(null)

  const toggleYearAndSeasonDropDown = (e:React.MouseEvent) => {
    e.stopPropagation()
    setYearAndSeasonListOpen(!yearAndSeasonListOpen)
  }

  const handleYearAndSeasonOption = (option:string) => {
    setYearAndSeasonSetting(option)
    setYearAndSeason(option);
    setYearAndSeasonListOpen(false)
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearAndSeasonRef.current && !yearAndSeasonRef.current.contains(event.target as Node)) {
        setYearAndSeasonListOpen(false);
      }
    }
    document.addEventListener('click',handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [])
  
  return (
    <div id="YearAndSeaonDropdown" className='relative w-40 h-10 flex-none' ref={yearAndSeasonRef}>
      <button onClick={toggleYearAndSeasonDropDown} className='flex items-center justify-between w-full h-full text-gray-200 bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600'>
        {yearAndSeasonSetting || yearAndSeasonOptions[0]}
        <svg
        className="-mr-1 ml-2 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true">
          <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
          />
        </svg>
      </button>
      {yearAndSeasonListOpen && (
        <div className='absolute top-full left-0 mt-2 w-full rounded-md shadow-lg bg-gray-700 ring-1 ring-black '>
          {yearAndSeasonOptions.map((option, index) => (
            <button key={index}
            onClick={()=>handleYearAndSeasonOption(option)}
            className='block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-amber-200 hover:text-gray-800'>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const {searchTerm, setSearchTerm, category, setCategory} = useSearch()

  return (
    <div id="container" className='flex items-center justify-between p-4 h-20 w-full bg-blue-900 fixed z-10'>
      <TimeDropDownList />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} tag={category} setTag={setCategory}/>
      <div id="discovery" className='flex'>
        <button className='rounded-3xl border p-2 hover:bg-amber-200 hover:text-gray-800 hover:ring-4'>Discovery</button>
      </div>
    </div>
    )
}

