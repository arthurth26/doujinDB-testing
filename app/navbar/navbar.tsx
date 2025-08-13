import React from 'react';
import { useYearAndSeason } from '~/content/timeOfM3Conext';
import { useSearch } from '~/content/searchContext';
import { useIsModalOpen } from '~/content/modalContext';
import { Discovery, ShowDiscoveryResults } from '~/content/discovery';

interface ModalProps {
  isOpen: boolean;
  isClose: () => void;
  children: React.ReactNode;
  isMobile: boolean;
}

const SearchBar = ({searchTerm, setSearchTerm, tag, setTag}:
  {searchTerm:string,setSearchTerm: React.Dispatch<React.SetStateAction<string>>, tag:string, setTag:React.Dispatch<React.SetStateAction<string>>}) => {
    const [isSearchDropDownOpen, setIsSearchDropDownOpen] = React.useState<boolean>(false);
    const [searchTag, setSearchTag] = React.useState<string>('');
    const {categoryOptions} = useSearch();
    const isMobile = window.innerWidth < 1500

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
    
    return (
      <div id="searchBar" className='flex items-center justify-between min-w-40 max-w-60 h-15 p-3 bg-gray-700 rounded-full lg:min-w-200'>
        <input placeholder='Search...' onChange={handleSearchChange} value={searchTerm} className={`bg-transparent text-gray-200 placeholder-gray-400 outline-none px-1 py-1 h-full ${isMobile? 'w-6/13': 'w-full'}`}/>
        <div id="dropdown" className="relative flex" ref={searchDropDownRef}>
            <button id="dropdown button" onClick={toggleSearchDropDown} className="flex justify-between items-between min-w-20 h-10 text-sm text-gray-200 bg-gray-600 px-4 py-2 rounded-full hover:bg-gray-500 lg:min-w-20 lg:text-base"> 
              {(isMobile && searchTag.length>3)? searchTag.slice(0,3): searchTag || categoryOptions[0]}
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
            <div className="absolute top-full right-0 mt-2 min-w-20 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5">
              {categoryOptions.map((option, index) => (
                <button key={index} value={tag} onClick={() =>handleTagOption(option)} className='block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-amber-200 hover:text-gray-800 active:bg-amber-200'>
                  {(isMobile && option.length > 4)? option.slice(0,5): option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
}

const TimeDropDownList = () => {
  const isMobile = window.innerWidth < 1500;
  const { setYearAndSeason, yearAndSeasonOptions } = useYearAndSeason();
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
    <div id="YearAndSeaonDropdown" className='relative w-15 h-15 flex-none lg:w-40' ref={yearAndSeasonRef}>
      <button onClick={toggleYearAndSeasonDropDown} className={isMobile? 'flex items-center p-1 justify-between w-full h-full rounded-2xl bg-gray-700 text-gray-200':'flex items-center justify-between w-full h-full text-gray-200 bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-600'}>
        {isMobile? `${yearAndSeasonSetting.replace(' ', '').slice(2,5) || yearAndSeasonOptions[0].replace(' ', '').slice(2,5)}`: `${yearAndSeasonSetting || yearAndSeasonOptions[0]}`}
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
            className='block w-full text-left px-1 py-3 text-sm text-gray-200 hover:bg-amber-200 active:bg-amber-200 hover:text-gray-800 lg:px-4 touch'>
              {isMobile? option.replace(' ', '').slice(2,5):option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const Modal: React.FC<ModalProps> = ({ isMobile, isOpen, isClose, children }) => {
  const ModalRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ModalRef.current && !ModalRef.current.contains(event.target as Node)) {
        isClose();
      }
    }
    if (isOpen) {
      document.addEventListener('click',handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen,isClose])
  
  if (!isOpen) return null;

  if (isMobile) {  
    return (
      <div className="flex flex-col fixed inset-5 z-50 text-sm overflow-auto bg-white" ref={ModalRef}>
        <div className="justify-start ml-2 mb-1 mt-1 bg-white">
            {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='hover:bg-gray-500'>
              <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg> */}
          <button className='text-sm hover:cursor-pointer text-gray-800 hover:text-gray-800 hover:bg-gray-500' onClick={isClose}>X</button>  
        </div>
        {children}
      </div>  
    );
  } else {
    return (
      <div className="fixed inset-23 w-min-40 w-max-100 h-270 z-50 gap-4 bg-gray-100 rounded" ref={ModalRef}> 
        <div className="border-b-2 border-gray-600 m-2">
          <button className='p-1 rounded-md text-gray-800 text-3xl hover:cursor-pointer hover:text-gray-200 hover:bg-gray-300' onClick={isClose}>X</button>
        </div>
        <div className='grid grid-cols-2 gap-4 m-2 '>
          {children}
        </div>
      </div>  
    );
  }
};

export default function Navbar() {
  const {searchTerm, setSearchTerm, category, setCategory} = useSearch();
  const {isModalOpen, setIsModalOpen} = useIsModalOpen();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const isMobile = window.innerWidth < 1024

  return (
    <div id="container" className='flex items-center justify-between p-1 h-20 w-full gap-2 bg-blue-900 fixed z-10'>
      <TimeDropDownList />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} tag={category} setTag={setCategory}/>
      <div id="discovery" className='flex h-15'>
        <button onClick={openModal} className='flex flex-row items-center rounded-3xl border p-2 bg-gray-700 hover:bg-gray-500 hover:text-gray-800 hover:ring-2 active:bg-amber-200'>
          <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  
              width={isMobile? "15px":'30px'} height={isMobile? "15px":'30px'} viewBox="0 0 256 159" >
            <path d="M116.1,2.3c18.5,0,33.5,15,33.5,33.5s-15,33.5-33.5,33.5s-33.5-15-33.5-33.5S97.6,2.3,116.1,2.3z M242.9,60.3
              c-12.1-6.3-28.3,1.9-37.1,18.7v0c-4,7.6-5.7,15.8-5,23.2c0.6,5.8,2.8,10.8,6.2,14.3l-8.6,14.4H160v-21.8c0-13.3-9.5-24.7-22.6-27.1
              L70.2,69.8c-18-3.3-36,5.6-44.3,21.8l-22,42.6c-5.4,10.2,2,22.5,13.5,22.5l57,0c7.3,0,13.2-5.9,13.2-13.2s-5.9-13.2-13.2-13.2h-25
              c-2.2,0-3.9-1.8-3.9-3.9s1.8-3.9,3.9-3.9h25c11.6,0,21,9.4,21,21c0,5-1.8,9.6-4.7,13.2h17.7l14.3,0l9.8-25.2v14
              c0,6.2,5,11.2,11.2,11.2h55c7.1,0,12.9-5.8,12.9-12.9c0-2.8-0.9-5.5-2.5-7.6l8.6-14.3c0.9,0.1,1.9,0.2,2.9,0.2
              c10.3,0,21.6-7.8,28.3-20.8C257.6,84.6,255,66.6,242.9,60.3z M238.4,95.9c-6,11.4-15.9,16.4-21.1,13.7c-3.4-1.8-4.3-6.1-4.6-8.6
              c-0.5-5,0.8-11.1,3.7-16.6v0c6-11.4,15.9-16.4,21.1-13.7C242.7,73.5,244.3,84.5,238.4,95.9z" fill="#e5e7eb"/>
            </svg>
            {isMobile? '': <span className='pl-2'>Discovery</span>}
        </button>
        {isMobile? <Modal isMobile={isMobile} isOpen={isModalOpen} isClose={closeModal}>
            <Discovery isMobile={isMobile}/>
        </Modal>:

        <Modal isMobile={isMobile} isOpen={isModalOpen} isClose={closeModal} >
            <Discovery isMobile={isMobile}/>
          <div>
            <ShowDiscoveryResults isMobile={isMobile} />
          </div>
        </Modal>
        }
        
      </div>
    </div>
    )
}

