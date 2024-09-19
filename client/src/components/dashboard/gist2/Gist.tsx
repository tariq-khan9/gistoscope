
import React, { useState } from 'react';
import { GistType } from './../../../services/types';
import Version from './Version';

type GistProps = {
  gists: GistType[];  // Define the expected type for the gists prop
};

const Gist: React.FC<GistProps> = ({ gists }) => {
  console.log("gist in gists", gists)
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current gist index



 
  // Function to handle "Next" button click
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gists?.length); 
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % gists?.length); 
  };

  return (
    <div className='flex flex-col space-y-4'>
          <div className='w-full bg-amber-200 p-4 flex flex-row justify-between px-20 rounded-lg'>
    
    {gists?.length > 0 && (
      <div className='r'>
        <h1 className='text-[25px] font-mono'>{gists[currentIndex]?.title}</h1>
      </div>
    )}

    <div className='flex flex-row text-[14px] border border-gray-500 justify-center p-1  space-x-4'>
        
        <button className='bg-gray-200 p-1 px-4 hover:text-blue-600' disabled={currentIndex === 0}  onClick={handlePrev}>Prev</button>

        <div className='flex flex-row  font-semibold justify-center mt-1'>{currentIndex+1}<h1 className='mx-2'>/</h1>{gists?.length}</div>
         

          <button className='bg-gray-200 p-1 px-4 hover:text-blue-600' disabled={currentIndex + 1 === gists?.length} onClick={handleNext}>Next</button>

          
     
    </div>
    
      </div>

  <Version versions={gists[currentIndex].versions}/>
    </div>
    
  );
};

export default Gist;
