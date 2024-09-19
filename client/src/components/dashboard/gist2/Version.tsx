

import React, { useState, useEffect } from 'react';
import { VersionType } from './../../../services/types';
import Edit from './Edit';

type VerionProps = {
  versions: VersionType[];  // Define the expected type for the versions prop
};

const Version: React.FC<VerionProps> = ({ versions }) => {
  console.log("gist in versions", versions)
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current gist index



 
  // Function to handle "Next" button click
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % versions?.length); 
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % versions?.length); 
  };

  useEffect(()=>{
    setCurrentIndex(0)
  },[versions])

  return (
    <div className='flex flex-col space-y-4 bg-amber-100 p-4 rounded-lg'>
        <div className='w-full  p-2 flex flex-row justify-start px-8 space-x-4'>
           <div className='flex flex-col space-y-2'>
                <div className='flex flex-row space-x-4 items-center'>
                  <div className='w-10 h-10 bg-sky-300 rounded-full'></div>
                  <h1 className='text-[16px] font-bold'> user</h1>
                </div>
             
                <div className='flex text-[14px] flex-row border border-gray-500 justify-center p-1  space-x-2'>
              
              <button className='bg-gray-200 p-1 px-4 hover:text-blue-600' disabled={currentIndex === 0}  onClick={handlePrev}>Prew</button>

              <div className='flex flex-row  font-semibold justify-center mt-1'>{currentIndex+1}<h1 className='mx-2'>/</h1>{versions?.length}</div>
              

                <button className='bg-gray-200 p-1 px-4 hover:text-blue-600' disabled={currentIndex + 1 === versions?.length} onClick={handleNext}>Next</button>
          
                </div>
           </div>
    
            {versions?.length > 0 && (
              <div className='r'>
                <h1 className='text-[20px] font-mono'>{versions[currentIndex]?.point}</h1>
              </div>
            )}

         
    
        </div>

          <Edit edits={versions[currentIndex]?.edits}/>
    </div>
    
  );
};

export default Version;
