
import React, { useState, useEffect } from 'react';
import { useDispatch} from 'react-redux';
import { useAppSelector } from '../../redux/useAppSelector';
import { setShowModal } from '../../redux/gistEditSlice';
import { useParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { CREATE_GIST, CREATE_VERSION, CREATE_EDIT } from './../../services/graphql/queriesMutations';
import RichEditor from './../dashboard/RichEditor';






type FormValues = {
  title: string;
  point: string;
  body: string;
};





const EditModal: React.FC = () => {
  const dispatch = useDispatch()
  const showModal = useAppSelector((state) => state.gistEdit.showModal);
  const version_data = useAppSelector((state) => state.gistEdit.versionData);;
  const edit_data = useAppSelector((state) => state.gistEdit.editData);;
  const gist_id = useAppSelector((state) => state.gistEdit.gistId);
  

  const {id: replyParentId} = useParams();

  const { register, handleSubmit,reset, formState: { errors } } = useForm<FormValues>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [content, setContent] = useState<string | undefined>(edit_data)

  const [createGist] = useMutation(CREATE_GIST);
  const [createVersion] = useMutation(CREATE_VERSION);
  const [createEdit] = useMutation(CREATE_EDIT);


  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    //---------- if showModal is 'reply' then create wholepost ----------
     if(showModal=='reply')
     {
      try {
        // Step 1: Create a Gist and get its ID
        const gistResponse = await createGist({
          variables: {
            gist: {
              title: formData.title,
              userId: 1,
              createdAt: new Date().toISOString(),
              parentId: gist_id
            }
          }
        });

        const new_gist_id: number = gistResponse.data.addGist.id;

        // Step 2: Use the Gist ID to create a Version and get its ID
        if(new_gist_id){
          const  versionResponse = await createVersion({
            variables: {
              version: {
                gistId: new_gist_id,
                point: formData.point,
                userId: 1,
                createdAt: new Date().toISOString()
              }
            }
          });
          
          const new_version_id = versionResponse.data.addVersion.id
          if(new_version_id){
            const editResponse = await createEdit({
              variables: {
                edit: {
                  versionId: new_version_id,
                  body: content,
                  userId: 1,
                  createdAt: new Date().toISOString()
      
                }
              }
            });

            if (editResponse.data) {
              setSuccessMessage('Gist created successfully!');
            }
          }
        }
        else{
          console.log("Gist not created, something went wrong.")
        }
      
      } catch (e) {
        console.error('Error creating Gist, Version, or Edit', e);
      }
     }
      
   //---------- if showModal is 'reply' then create wholepost ----------
   if(showModal=='version')
    {
     try {       
         const  versionResponse = await createVersion({
           variables: {
             version: {
               gistId: gist_id,
               point: formData.point,
               userId: 1,
               createdAt: new Date().toISOString()
             }
           }
         });
         
         const new_version_id = versionResponse.data.addVersion.id
         if(new_version_id){
           const editResponse = await createEdit({
             variables: {
               edit: {
                 versionId: new_version_id,
                 body: content,
                 userId: 1,
                 createdAt: new Date().toISOString()
     
               }
             }
           });

           if (editResponse.data) {
             setSuccessMessage('Version created successfully!');
           }
         }
      
     
     } catch (e) {
       console.error('Error creating Gist, Version, or Edit', e);
     }
    }
  };


  useEffect(() => {
    if (successMessage) {
    // reset()
      const timer = setTimeout(() => {
        setSuccessMessage(null); 
      }, 4000); 

      return () => clearTimeout(timer); 
    }
  }, [successMessage]);



  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
    {/* Modal Background */}
    <div className="fixed w-full inset-0 bg-gray-800 opacity-50"></div>
        <div className="flex flex-col z-10 bg-slate-400 px-10 justify-center items-center w-90%">
          <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='w-full flex flex-col'>
              <label className='form-label'>{showModal}</label>
              <input
                className="form-input"
                type="text"
                {...register('title', { required: 'title is required' })}
              />
              {errors.title && <span className='error-msg'>{errors.title.message}</span>}
            </div>

            <div  className='w-full flex flex-col'>
              <label className='form-label'>Point</label>
              <textarea
                className="form-input"
                value={version_data}
                rows={3}
                {...register('point', { required: 'Point is required' })}
              />
              {errors.point && <span className='error-msg'>{errors.point.message}</span>}
            </div>

            {/* <div  className='w-full flex flex-col'>
              <label className='form-label'>Body</label>
              <textarea
                className="form-input"
                rows={7}
                {...register('body', { required: 'body is required' })}
              />
              {errors.body && <span className='error-msg'>{errors.body.message}</span>}
            </div> */}

            <RichEditor content={content} setContent={setContent}/>

            <div className='flex w-full flex-row'>
            <button className="form-button" type="submit">Create Gist</button>
            <button onClick={()=>dispatch(setShowModal('hidden'))}>cancel</button>
            </div>

         

            <div className='flex flex-row w-full justify-center'>
            <span className='success-msg '><span className='success-msg'>{successMessage}</span></span>
            </div>
            
          </form>
        </div>
    </div>
  
  );
};

export default EditModal;
