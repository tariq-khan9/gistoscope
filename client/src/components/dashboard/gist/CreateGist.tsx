
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { CREATE_GIST, CREATE_VERSION, CREATE_EDIT } from '../../../services/graphql/queriesMutations';
import RichEditor from './../RichEditor';






type FormValues = {
  title: string;
  point: string;
  body: string;
};

const CreateGist: React.FC = () => {

  const {id: replyParentId} = useParams();

  const { register, handleSubmit,reset, formState: { errors } } = useForm<FormValues>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [content, setContent] = useState<string>()

  const [createGist] = useMutation(CREATE_GIST);
  const [createVersion] = useMutation(CREATE_VERSION);
  const [createEdit] = useMutation(CREATE_EDIT);


  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    try {
      // Step 1: Create a Gist and get its ID
      const gistResponse = await createGist({
        variables: {
          gist: {
            title: formData.title,
            userId: 1,
            createdAt: new Date().toISOString(),
             parentId: replyParentId? parseInt(replyParentId) : null
          }
        }
      });

      const gistId: number = gistResponse.data.addGist.id;

      // Step 2: Use the Gist ID to create a Version and get its ID
      if(gistId){
        const  versionResponse = await createVersion({
          variables: {
            version: {
              gistId: gistId,
              point: formData.point,
               userId: 1,
              createdAt: new Date().toISOString()
            }
          }
        });
        
        const versionId = versionResponse.data.addVersion.id
        if(versionId){
          const editResponse = await createEdit({
            variables: {
              edit: {
                versionId: versionId,
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
    <div className='flex w-full justify-center items-center px-20'>
        <div className="flex flex-col justify-center items-center w-full">
           <h2 className="form-heading">Create Gist</h2>
             <button onClick={()=>console.log(FormData, content)}>show</button>
          <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='w-full flex flex-col'>
              <label className='form-label'>Title</label>
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

            <button className="form-button" type="submit">Create Gist</button>

            <div className='flex flex-row w-full justify-center'>
            <span className='success-msg '><span className='success-msg'>{successMessage}</span></span>
            </div>
            
          </form>
        </div>
    </div>
  
  );
};

export default CreateGist;
