
import React, { useState, useEffect, useRef } from 'react';
import { VersionType } from '../../services/types';
import { useMutation } from '@apollo/client';
import { CREATE_VERSION, GET_ALL_GISTS } from '../../services/graphql/queriesMutations';
import Edit from './Edit';
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import BoxWithShadows from '../BoxWithShadow';
import TextareaWithLimit from '../others/TextareaWithLimit';


type VerionProps = {
  versions: VersionType[];  
};

const Version: React.FC<VerionProps> = ({ versions }) => {
 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [createVersion, setCreateVerion] = useState(false)
  const [newVersionData, setNewVersionData] = useState<string>(versions[currentIndex]?.point)

  const [createNewVersion] =  useMutation(CREATE_VERSION, {
    refetchQueries: [{ query: GET_ALL_GISTS }]
  })

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % versions?.length); 
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % versions?.length); 
  };

  const handleCreateVersion = async()=>{
    setCreateVerion(!createVersion)
    if(createVersion){
      try{
        await createNewVersion({
          variables: {
            version: {
              gistId: versions[currentIndex].gistId,
              point: newVersionData,
               userId: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
        }).then(()=>{
          setCurrentIndex(versions.length-1)
        });
      }catch(e){
          console.log("new version not created.", e)
      }
    }
  }

  useEffect(() => {
    if (!createVersion) {
      setNewVersionData(versions[currentIndex]?.point);
    }
  }, [versions, currentIndex, createVersion]);

  if (!versions || versions.length === 0) {
    return <div>No Versions available.</div>;
  }

  return (
    <div className='flex flex-col space-y-4 p-4 rounded-lg'>
      <button onClick={()=>console.log(newVersionData, createVersion)}>show</button>
        <div className='w-full h-32 p-2 flex flex-row justify-start px-4 space-x-4'>

           <div className='user-arrow-btn  flex flex-col justify-start space-y-8 border-r border-amber-400 pr-4'>
                <div className='flex flex-row space-x-4 items-center'>
                  <div className='w-10 h-10 bg-gray-100 rounded-full'></div>
                  <div className='flex flex-col'>
                      <h1 className='text-[16px] text-slate-700 uppercase'> user Khan</h1>
                      <h2 className='text-[12px] text-slate-600'>12-03-2024</h2>
                  </div>
                  
                </div>
             
                <div className='flex flex-row text-[14px]'>
                     <button className={`border border-gray-600 hover:bg-sky-800 hover:text-white rounded-full w-24 h-6 text-[12px] mr-2`} onClick={()=>handleCreateVersion()}>{!createVersion? 'Edit Version' : 'Save Version'}</button>

                    <button className='arrow' disabled={currentIndex === 0}  onClick={handlePrev}><IoIosArrowDropleft className='arrow'  /></button>

                    <div className='flex flex-row mx-[2px] font-semibold justify-center text-slate-500 '>{currentIndex+1}<h1 className='mx-[4px]'>/</h1>{versions?.length}</div>

                    <button className='arrow' disabled={currentIndex + 1 === versions?.length} onClick={handleNext}><IoIosArrowDropright className='arrow' /></button>

                </div>
           </div>
    
            {versions?.length > 0 && (
              <div className='text-[14px] w-full '>
                {
                  createVersion? 
                  // <textarea className=' w-full h-full outline-none border-none focus:ring-0 focus:outline-none' value={newVersionData} onChange={(e)=>setNewVersionData(e.target.value)} /> 
                  <TextareaWithLimit maxChars={300} text={newVersionData} setText={setNewVersionData}/>
                  
                  :
                  <h1 className='text-slate-800 text-[16px]'>{newVersionData}</h1>
                }
                
              </div>
            )}
        </div>

        <BoxWithShadows boxBorder='border-slate-300' colorShades={['bg-white', 'bg-slate-100', 'bg-slate-50']}>
          {versions[currentIndex].edits && <Edit edits={versions[currentIndex].edits}/>}
      </BoxWithShadows>
    </div>
    
  );
};

export default Version;
