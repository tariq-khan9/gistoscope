
import parse from 'html-react-parser'
import React, { useState, useEffect } from 'react';
import { EditType } from './../../../services/types';

type EditProps = {
  edits: EditType[];  // Define the expected type for the edits prop
};

const Edit: React.FC<EditProps> = ({ edits }) => {
  console.log("gist in edits", edits)
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current gist index



 
  // Function to handle "Next" button click
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % edits?.length); 
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % edits?.length); 
  };

  useEffect(()=>{
    setCurrentIndex(0)
  },[edits])

  return (
    <div>
       <div className='w-full bg-white flex flex-col justify-between px-10 p-4 rounded-lg'>

          <div className='flex flex-row justify-between space-y-2'>
                <div className='flex flex-row space-x-4 items-center'>
                  <div className='w-10 h-10 bg-sky-300 rounded-full'></div>
                  <h1 className='text-[16px] font-bold'>user</h1>
                </div>
             
                <div className='flex  text-[14px] flex-row border border-gray-500 justify-center p-1  space-x-4'>
        
                      <button className='bg-gray-200 p-1 px-4 hover:text-blue-600' disabled={currentIndex === 0}  onClick={handlePrev}>Prew</button>

                      <div className='flex flex-row  font-semibold justify-center mt-1'>{currentIndex+1}<h1 className='mx-2'>/</h1>{edits?.length}</div>
                      

                        <button className='bg-gray-200 p-1 px-4 hover:text-blue-600' disabled={currentIndex + 1 === edits?.length} onClick={handleNext}>Next</button>
     
                  </div>
           </div>
    
          {edits?.length > 0 && (
            <div className='mt-8'>
              <h1 className='text-[18px] font-inter'>{parse(edits[currentIndex]?.body)}</h1>
            </div>
          )}

   
    
        </div>
    </div>
    
  );
};

export default Edit;
