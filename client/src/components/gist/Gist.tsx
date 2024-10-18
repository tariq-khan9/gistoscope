
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GistType } from '../../services/types';
import { IoIosArrowDropleft, IoIosArrowDropright} from "react-icons/io";
import Version from './Version';
import BoxWithShadows from '../others/BoxWithShadow';
import EditModal from '../others/EditModal';



type GistProps = {
  gists: GistType[];  // Define the expected type for the gists prop
};

const Gist: React.FC<GistProps> = ({ gists }) => {
   const navigate = useNavigate();
   const [showModal, setShowModal] = useState<string>('hidden')
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [showChild, setShowChild] = useState(false)

  const handlePostClick = () => {
   // navigate(`/reply/${gists[currentIndex].id}`);

  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gists?.length); 
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % gists?.length); 
  };
 
  

  if (!gists || gists.length === 0) {
    return <div>No Gists available.</div>;
  }
   
  return (
    <div className='flex w-full flex-col mt-10'>
       <BoxWithShadows visible={gists.length>1} boxBorder='border-amber-500' colorShades={['bg-amber-300', 'bg-amber-200', 'bg-amber-100']}>
           <div className='w-full p-4 flex flex-row justify-between px-10 rounded-lg'>
                {gists?.length > 0 && (
                  <div className='r'>
                    <button onClick={()=>setShowModal('show')}>show</button>
                    <h1 className='text-[18px] uppercase'>{gists[currentIndex]?.title}</h1>
                  </div>
                )}

              <div className='post-arrow-buttons flex flex-row items-center justify-center space-x-2'>
                {
                  gists[currentIndex].gists.length>0 && (
                    <button className={`border border-gray-600 hover:bg-sky-800 hover:text-white rounded-full px-[20px] h-6 text-[12px]`} onClick={()=>setShowChild(!showChild)}>{showChild? 'Hide Reply' : 'Show Reply'}</button>
                  )
                }
                 
                    <button onClick={()=>handlePostClick()} className='border border-gray-600 hover:bg-sky-800 hover:text-white rounded-full px-6 h-6 text-[12px]'>Post</button>
                    
                  <div className='flex flex-row text-[14px]  justify-center  space-x-[6px]'>
                      
                      <button className='arrow' disabled={currentIndex === 0}  onClick={handlePrev}><IoIosArrowDropleft className='arrow'  /></button>

                      <div className='flex flex-row  font-semibold text-slate-500 justify-center '>{currentIndex+1}<h1 className='mx-1 '>/</h1>{gists?.length}</div>
                      

                        <button className='arrow' disabled={currentIndex + 1 === gists?.length} onClick={handleNext}><IoIosArrowDropright className='arrow' /></button>

                        
                  
                  </div>
              </div>
  

          </div>
      </BoxWithShadows>


      <BoxWithShadows visible={gists[currentIndex].versions.length>1} boxBorder='border-amber-300' colorShades={['bg-amber-200', 'bg-amber-100', 'bg-amber-50']}>
           
          {gists[currentIndex].versions && <Version  versions={gists[currentIndex].versions}/>}  
         
      </BoxWithShadows>

      <div className={`${showChild? 'flex w-full' : 'hidden'}`}>
          {gists[currentIndex].gists && gists[currentIndex].gists.length > 0 && (

            // <div className={`flex flex-row w-full justify-between `}>
            // <button onClick={()=>setShowChild(!showChild)} className={`${showChild? 'flex': 'hidden'} mt-8 mb-8 border-l-[2px] hover:border-amber-300 border-amber-200`} aria-label="Hide Replies"/>
            // <div className={`${showChild? ' w-full ml-4 mt-8': 'hidden'} `}>
            //   {gists[currentIndex].gists.map((child) => (
            //     <Gist key={child.id} gists={[child]} />
            //   ))}
            // </div>
            // </div>
      
            
            <Gist gists={gists[currentIndex].gists}/>
          
          )}
      </div>
      {showModal!='hidden' && (
        <EditModal 
          showModal={showModal}
        />
      )}

    </div>
    
  );
};

export default Gist;
