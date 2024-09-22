
import parse from 'html-react-parser'
import React, { useState, useEffect } from 'react';
import { EditType } from '../../services/types';
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io';
import RichEditor from '../dashboard/RichEditor';

type EditProps = {
  edits: EditType[];  
};

const Edit: React.FC<EditProps> = ({ edits }) => {
  const [content, setContent] = useState<string>()
  console.log("gist in edits", edits)
  const [currentIndex, setCurrentIndex] = useState(0); 

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % edits?.length); 
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % edits?.length); 
  };

  useEffect(()=>{
    setCurrentIndex(0)
    setContent(edits[currentIndex]?.body)
  },[edits])

  return (
    <div>
       <div className='w-full flex flex-col justify-between px-10 py-4 rounded-lg'>

           <div className='user-arrow-btn  flex flex-row w-full  justify-between'>
                <div className='flex flex-row space-x-4 items-center justify-center'>
                  <div className='w-10 h-10 bg-slate-200 rounded-full'></div>
                  <div className='flex flex-col'>
                      <h1 className='text-[16px] text-slate-500 uppercase'> user</h1>
                      <h2 className='text-[12px] text-slate-600'>12-03-2024</h2>
                  </div>
                  
                </div>
             
                <div className='flex flex-row text-[14px] justify-center items-center  space-x-[6px]'>
         
                    <button className='arrow' disabled={currentIndex === 0}  onClick={handlePrev}><IoIosArrowDropleft className='arrow'  /></button>

                    <div className='flex flex-row  font-semibold justify-center text-slate-500 '>{currentIndex+1}<h1 className='mx-1'>/</h1>{edits?.length}</div>
                    
                      <button className='arrow' disabled={currentIndex + 1 === edits?.length} onClick={handleNext}><IoIosArrowDropright className='arrow' /></button>

                </div>
           </div>
    
          {edits?.length > 0 && (
            <div className='mt-4'>
              <RichEditor content={content} setContent={setContent}/>
            </div>
          )}
        </div>
    </div>
    
  );
};

export default Edit;
