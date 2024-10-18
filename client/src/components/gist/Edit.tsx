
import parse from 'html-react-parser'
import React, { useState, useEffect } from 'react';
import { CREATE_VERSION,CREATE_EDIT, GET_ALL_GISTS } from '../../services/graphql/queriesMutations';
import { useMutation } from '@apollo/client';
import { EditType } from '../../services/types';
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io';
import RichEditor from '../dashboard/RichEditor';

type EditProps = {
  edits: EditType[];  
  versionIndex: number;
  gistId: number;
  versionData: string;
};

const Edit: React.FC<EditProps> = ({ edits, versionIndex, gistId, versionData }) => {

  const [createNewVersion] =  useMutation(CREATE_VERSION)

  const [createEdit] =  useMutation(CREATE_EDIT, {
    refetchQueries: [{ query: GET_ALL_GISTS }]
  })

  const [content, setContent] = useState<string>()
  const [currentIndex, setCurrentIndex] = useState(0); 

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % edits?.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % edits?.length); 
  };

  const handleCreateVersionEdit = async()=>{
   
      try{
        const {data}= await createNewVersion({
          variables: {
            version: {
              gistId: gistId,
              point: versionData,
               userId: 1
            }
          }
          

        })
     
             
        // setTimeout(() => {
        //   setCurrentIndex(versions.length);
        // }, 100);
        

       if(data.addVersion.id){
        await createEdit({
          variables: {
            edit: {
              versionId: data.addVersion.id, // Use the new version ID here
              userId: 1,
              body: "sample", // You can replace this with actual content
            },
          },
        });
       }
      }catch(e){
          console.log("new version not created.", e)
         
      }
    
  }

  useEffect(()=>{
    setCurrentIndex(0)
    setContent(edits[currentIndex]?.body)
    // dispatch(setVersionData(versionData))
    // dispatch(setEditData(edits[currentIndex]?.body))
  },[edits])






  
 

  

  return (
    <div>
       <div className='w-full flex flex-col justify-between px-10 py-4 rounded-lg'>

           <div className='user-arrow-btn  flex flex-row w-full  justify-between'>

          
                <div className='flex flex-row space-x-4 items-center justify-center'>
                  <div className='w-10 h-10 bg-slate-200 rounded-full'></div>
                  <div className='flex flex-col'>
                      <h1 className='text-[16px] text-slate-500 uppercase'>user</h1>
                      <h2 className='text-[12px] text-slate-600'>12-03-2024</h2>
                  </div>
                  
                </div>
             
                <div className='flex flex-row text-[14px] justify-center items-center  space-x-[6px]'>

                <button className={`border border-gray-600 hover:bg-sky-800 hover:text-white rounded-full w-24 h-6 text-[12px] mr-2`}>Edit</button>
         
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
