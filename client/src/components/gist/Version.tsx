
import React, { useState, useEffect } from 'react';
import { VersionType } from '../../services/types';
import Edit from './Edit';
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";


type VerionProps = {
  versions: VersionType[];  
};

const Version: React.FC<VerionProps> = ({ versions }) => {
 
  const [currentIndex, setCurrentIndex] = useState(0); 

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
    <div className='flex flex-col space-y-4 bg-slate-100 p-4 rounded-lg'>
        <div className='w-full  p-2 flex flex-row justify-start px-4 space-x-4'>

           <div className='user-arrow-btn  flex flex-col justify-start space-y-2 border-r border-slate-300 pr-4'>
                <div className='flex flex-row space-x-4 items-center'>
                  <div className='w-10 h-10 bg-slate-300 rounded-full'></div>
                  <div className='flex flex-col'>
                      <h1 className='text-[16px] text-slate-500 uppercase'> user Khan</h1>
                      <h2 className='text-[12px] text-slate-600'>12-03-2024</h2>
                  </div>
                  
                </div>
             
                <div className='flex flex-row text-[14px]  space-x-[6px]'>
                    
                    <button className='arrow' disabled={currentIndex === 0}  onClick={handlePrev}><IoIosArrowDropleft className='arrow'  /></button>

                    <div className='flex flex-row  font-semibold justify-center text-slate-500 '>{currentIndex+1}<h1 className='mx-1'>/</h1>{versions?.length}</div>

                    <button className='arrow' disabled={currentIndex + 1 === versions?.length} onClick={handleNext}><IoIosArrowDropright className='arrow' /></button>

                </div>
           </div>
    
            {versions?.length > 0 && (
              <div className='r'>
                <h1 className='text-[16px] text-sky-900'>{versions[currentIndex]?.point}</h1>
              </div>
            )}
        </div>
          <Edit edits={versions[currentIndex]?.edits}/>
    </div>
    
  );
};

export default Version;
