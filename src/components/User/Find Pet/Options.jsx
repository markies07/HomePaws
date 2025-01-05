import React, { useEffect, useState } from 'react'
import post from '../assets/post.svg'
import filter from '../assets/filter.svg'
import close from '../../../assets/icons/close-dark.svg'
import checkup from './assets/checkup.svg'
import water from './assets/water.svg'
import clean from './assets/clean.svg'
import walk from './assets/walk.svg'
import love from './assets/love.svg'


function Options({openPostPet, changeFilter, selected, onFilterChange, filters}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const handleFilterClick = () => {
    setFilterOpen(!filterOpen);
  }
  const closeFilter = () => {
    setFilterOpen(!filterOpen);
  }

  const tips = [
    { category: "General Tips", title: "Regular Vet Checkups", icon: checkup, text: "Schedule annual or semi-annual vet visits to ensure your pet is healthy and up-to-date on vaccinations." },
    { category: "General Tips", title: "Provide Fresh Water", icon: water, text: "Always keep a bowl of clean, fresh water available to keep your pet hydrated." },
    { category: "For Cats", title: "Litter Box Hygiene", icon: clean, text: "Clean the litter box daily to keep your cat happy and to avoid unpleasant odors." },
    { category: "For Dogs", title: "Daily Walks", icon: walk, text: "Take your dog on daily walks to keep them healthy and happy." },
    { category: "Best Tips", title: "Love and Attention", icon: love, text: "Spend quality time with your pet daily. Pets thrive on affection and attention from their owners." },
  ];

  const filterOptions = {
    breed: ['Any', 'Puspin', 'Aspin', 'German Shepherd', 'Golden Retriever', 'Persian', 'Pomeranian', 'Ragdol', 'Shih Tzu', 'Siamese', 'Siberian Husky', 'Other'],
    age: ['Any', 'Kitty/Puppy', 'Young', 'Adult', 'Senior'],
    gender: ['Any', 'Male', 'Female'],
    size: ['Any', 'Small', 'Medium', 'Large'],
    color: ['Any', 'Black', 'White', 'Brown', 'Gray', 'Orange', 'Multi-Color'],
    municipality: [
      "Any",
      "Alfonso",
      "Amadeo",
      "Bacoor",
      "Carmona",
      "Cavite City",
      "Dasmariñas",
      "General Emilio Aguinaldo",
      "General Mariano Alvarez",
      "General Trias",
      "Imus",
      "Indang",
      "Kawit",
      "Magallanes",
      "Maragondon",
      "Mendez",
      "Naic",
      "Noveleta",
      "Rosario",
      "Silang",
      "Tagaytay",
      "Tanza",
      "Ternate",
      "Trece Martires",
    ]
  };

  const handleFilterChange = (filterName, value) => {
    onFilterChange({
        ...filters,
        [filterName]: value
    });
  };

  useEffect(() => {
    const calculateTipIndex = () => {
      const now = new Date();
      // Calculate tip index based on current time in minutes
      return Math.floor(now.getTime() / (60 * 1000)) % tips.length;
    };

    // Set the initial tip index based on current time
    setCurrentTipIndex(calculateTipIndex());

    // Update the tip index every 1 minute
    const interval = setInterval(() => {
      setCurrentTipIndex(calculateTipIndex());
    }, 60000); // 1 minute interval

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const currentTip = tips[currentTipIndex];

  return (
    <div className='relative px-2 pt-3 lg:pt-4'>
      {/* MOBILE VIEW */}
      <div className='flex gap-2 sm:gap-3 justify-center lg:hidden'>
        <div className='bg-secondary pl-3 pr-4 py-2 gap-2 flex justify-center items-center rounded-lg shadow-custom'>
          <img onClick={openPostPet} src={post} className='p-1 bg-[#E9E9E9] rounded-lg cursor-pointer hover:bg-[#dbdbdb] duration-150' alt="" />
          <p className='font-medium leading-4'>Post Pet</p>
        </div>
        <div className='bg-secondary px-2 sm:px-3 py-2 gap-2 sm:gap-3 flex justify-center items-center rounded-lg shadow-custom'>
          <button onClick={() => changeFilter('All')} className={`font-medium px-1 ${selected === 'All' ? 'text-white bg-primary rounded-md' : ''} `}>All</button>
          <button onClick={() => changeFilter('Dog')} className={`font-medium px-1 ${selected === 'Dog' ? 'text-white bg-primary rounded-md' : ''} `}>Dogs</button>
          <button onClick={() => changeFilter('Cat')} className={`font-medium px-1 ${selected === 'Cat' ? 'text-white bg-primary rounded-md' : ''} `}>Cats</button>
        </div>
        <div className='bg-secondary shrink-0 px-2 sm:pr-4 py-1 gap-3 flex justify-center items-center rounded-lg shadow-custom'>
          <img onClick={handleFilterClick} src={filter} className='w-11 p-2 bg-[#E9E9E9] rounded-lg cursor-pointer hover:bg-[#dbdbdb] duration-150' alt="" />
          <p className='font-medium hidden sm:block'>Filter</p>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className='gap-3 justify-center hidden fixed lg:flex right-0 mr-3 flex-col w-48 xl:w-52 2xl:w-56'>
        <div className='bg-secondary px-2 py-3 xl:gap-2 gap-1 flex justify-center items-center rounded-lg shadow-custom'>
          <button onClick={() => changeFilter('All')} className={`font-medium px-2 ${selected === 'All' ? 'text-white bg-primary rounded-md' : ''} `}>All</button>
          <button onClick={() => changeFilter('Dog')} className={`font-medium px-2 ${selected === 'Dog' ? 'text-white bg-primary rounded-md' : ''} `}>Dogs</button>
          <button onClick={() => changeFilter('Cat')} className={`font-medium px-2 ${selected === 'Cat' ? 'text-white bg-primary rounded-md' : ''} `}>Cats</button>
        </div>
        <div className='bg-secondary pl-3 pr-4 py-2 gap-4 flex justify-start items-center rounded-lg shadow-custom'>
          <img onClick={handleFilterClick} src={filter} className='w-11 p-2 bg-[#E9E9E9] rounded-lg cursor-pointer hover:bg-[#dbdbdb] duration-150' alt="" />
          <p className='font-medium whitespace-nowrap '>Filter</p>
        </div>
        <div className='bg-secondary pl-3 pr-4 py-2 gap-4 flex justify-start items-center rounded-lg shadow-custom'>
          <img onClick={openPostPet} src={post} className='p-1 bg-[#E9E9E9] rounded-lg cursor-pointer hover:bg-[#dbdbdb] duration-150' alt="" />
          <p className='font-medium whitespace-nowrap '>Post Pet</p>
        </div>

        {/* TIPS */}
        <div className='bg-secondary px-4 py-4  h-full gap-4 justify-start items-center rounded-lg shadow-custom'>
          <h3 className='font-semibold text-center'>{currentTip.category}</h3>
          <div className='w-full flex justify-center pt-5 pb-3'>
            <img src={currentTip.icon} alt="" />
          </div>
          <h4 className='font-medium text-center'>{currentTip.title}</h4>
          <p className='text-sm pt-1 text-center'>{currentTip.text}</p>
        </div>

      </div>

      {/* FILTER */}
      <div 
      style={{
        right: filterOpen ? '0' : '-20rem',
        transition: 'right 0.5s ease-in-out',
      }}
      className='fixed px-5 lg:px-4 py-5 z-10 top-36 lg:top-20 bg-secondary shadow-custom h-full lg:w-60 xl:w-72'>
        <div className='w-full flex justify-end'>
          <img onClick={closeFilter} className='w-8 p-1 border-2 border-secondary hover:border-text cursor-pointer duration-150' src={close} alt="" />
        </div>
        <p className='font-semibold text-2xl'>Filter:</p>
        <div className='mt-3'>
          {Object.entries(filters).map(([filterName, value]) => (
            <div key={`filter-${filterName}`} className='flex flex-col mb-4'>
              <p className='text-center font-medium'>{filterName.toUpperCase()}</p>
              <select value={value} onChange={(e) => handleFilterChange(filterName, e.target.value)} className="border-text rounded-md sm:text-base w-52 lg:w-full py-2 px-1 outline-none font-medium text-text border-2">
                  {filterOptions[filterName].map(option => (
                    <option className="text-text py-5" key={`${filterName}-${option}`} value={option}>{option}</option>
                  ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Options