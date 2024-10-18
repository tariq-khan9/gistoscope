
import React, { useState, useEffect, useRef } from 'react';
import { setShowModal } from '../../redux/gistEditSlice';
import { VersionType } from '../../services/types';
import { useMutation } from '@apollo/client';
import { CREATE_VERSION,CREATE_EDIT, GET_ALL_GISTS } from '../../services/graphql/queriesMutations';
import Edit from './Edit';
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import BoxWithShadows from '../others/BoxWithShadow';
import TextareaWithLimit from '../others/TextareaWithLimit';



type VerionProps = {
  versions: VersionType[]; 
};

const Version: React.FC<VerionProps> = ({ versions }) => {
  
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [error, setError] = useState(false)
  const [newVersionData, setNewVersionData] = useState<string>(versions[currentIndex]?.point)

  //const [createNewVersion] =  useMutation(CREATE_VERSION)

  // const [createEdit] =  useMutation(CREATE_EDIT, {
  //   refetchQueries: [{ query: GET_ALL_GISTS }]
  // })

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % versions?.length); 
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % versions?.length); 
  };

  const handleCreateVersion = ()=>{

  


  }

  // const handleCreateVersion = async()=>{
  //   setCreateVerion(!createVersion)
  //   if(createVersion){
  //     try{
  //       const {data}= await createNewVersion({
  //         variables: {
  //           version: {
  //             gistId: versions[currentIndex].gistId,
  //             point: newVersionData,
  //              userId: 1
  //           }
  //         }
          

  //       })
     
             
  //       // setTimeout(() => {
  //       //   setCurrentIndex(versions.length);
  //       // }, 100);
        

  //      if(data.addVersion.id){
  //       await createEdit({
  //         variables: {
  //           edit: {
  //             versionId: data.addVersion.id, // Use the new version ID here
  //             userId: 1,
  //             body: "sample", // You can replace this with actual content
  //           },
  //         },
  //       });
  //      }
     

  //      if(data){
  //       setTimeout(() => {
  //      setCurrentIndex(versions.length);
  //    }, 500);
  //    }
         
    
  //     }catch(e){
  //         console.log("new version not created.", e)
  //         setError(true)
  //     }
  //   }
  // }

  // const handleCreateVersion = async () => {
  //   setCreateVerion(!createVersion);
  //   if (createVersion) {
  //     try {
  //       // Step 1: Create the new version
  //       const {data} = await createNewVersion({
  //         variables: {
  //           version: {
  //             gistId: versions[currentIndex].gistId,
  //             point: newVersionData,
  //             userId: 1
  //           },
  //         },
  //       });
  
  //      // const newVersionId = version.data.id; // Get the new version's ID
  //       console.log("version id ", data.addVersion.id)
  //       // Step 2: Create an edit associated with the new version
  //       // await createEdit({
  //       //   variables: {
  //       //     edit: {
  //       //       versionId: data.addVersion.id, // Use the new version ID here
  //       //       userId: 1,
  //       //       body: 'Initial version edit', // You can replace this with actual content
  //       //     },
  //       //   },
  //       // });
  
  //       // Update the index after the new version and edit are created
  //       setTimeout(() => {
  //         setCurrentIndex(versions.length);
  //       }, 100);
  //     } catch (e) {
  //       console.log("new version or edit not created.", e);
  //       setError(true);
  //     }
  //   }
  // };
  

  

  // useEffect(() => {
  //   if (!createVersion) {
  //     setNewVersionData(versions[currentIndex]?.point);
  //   }
  // }, [versions, currentIndex, createVersion]);

  if (!versions || versions.length === 0) {
    return <div>No Versions available.</div>;
  }

  if(error) {return <h1>something went wrong</h1>}

  return (
    <div className='flex flex-col space-y-4 p-4 rounded-lg'>
        <div className='w-full h-32 p-2 flex flex-row justify-start px-4 space-x-4'>

           <div className='user-arrow-btn  flex flex-col justify-start space-y-8 border-r border-amber-400 pr-4'>
                <div className='flex flex-row space-x-4 items-center'>
                  <div className='w-10 h-10 bg-gray-100 rounded-full'></div>
                  <div className='flex flex-col'>
                      <h1 className='text-[16px] text-slate-700 uppercase'>user</h1>
                      <h2 className='text-[12px] text-slate-600'>12-03-2024</h2>
                  </div>
                  
                </div>
             
                <div className='flex flex-row text-[14px]'>
                     <button onClick={handleCreateVersion} className={`border border-gray-600 hover:bg-sky-800 hover:text-white rounded-full w-24 h-6 text-[12px] mr-2`} >Edit Version</button>

                    <button className='arrow' disabled={currentIndex === 0}  onClick={handlePrev}><IoIosArrowDropleft className='arrow'  /></button>

                    <div className='flex flex-row mx-[2px] font-semibold justify-center text-slate-500 '>{currentIndex+1}<h1 className='mx-[4px]'>/</h1>{versions?.length}</div>

                    <button className='arrow' disabled={currentIndex + 1 === versions?.length} onClick={handleNext}><IoIosArrowDropright className='arrow' /></button>

                </div>
           </div>
    
            {versions?.length > 0 && (
              <div className='text-[14px] w-full '>
{/*              
                  <TextareaWithLimit maxChars={300} text={newVersionData} setText={setNewVersionData}/> */}
                  
                  
                  <h1 className='text-slate-800 text-[16px]'>{newVersionData}</h1>
                
                
              </div>
            )}
        </div>

        <BoxWithShadows visible={versions[currentIndex].edits.length>1} boxBorder='border-slate-300' colorShades={['bg-white', 'bg-slate-100', 'bg-slate-50']}>
          {versions[currentIndex].edits && 
          <Edit 
            edits={versions[currentIndex].edits}
            versionIndex={currentIndex}
            gistId={versions[currentIndex].gistId}
            versionData={newVersionData}
          />}
      </BoxWithShadows>
    </div>
    
  );
};

export default Version;
