
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_GIST, CREATE_VERSION, CREATE_EDIT, GET_ALL_GISTS } from './../../services/graphql/queriesMutations';
import RichEditor from './../dashboard/RichEditor';


type FormValues = {
  title: string;
  point: string;
  body: string;
};

type Data = {
  gist_id: number;
  gist_title:string;
  version_id: number;
  version_data: string;
  edit_data: string;
}


type Props = {
  showModal: string;
  setShowModal: (value: string)=> void;
  data: Data;
}

const EditModal: React.FC<Props> = ({showModal, setShowModal, data}) => {

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: showModal === 'reply' ? '' : data.gist_title, 
      point: showModal === 'edit' ? data.version_data : '' 
    }
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editValidationError, setEditValidationError] = useState(false)
  const [content, setContent] = useState<string>(data.edit_data)

  const [createGist] = useMutation(CREATE_GIST);
  const [createVersion] = useMutation(CREATE_VERSION);
  const [createEdit] = useMutation(CREATE_EDIT);

  const { refetch } = useQuery(GET_ALL_GISTS, {
    fetchPolicy: "network-only", // Ensure fresh data
    notifyOnNetworkStatusChange: true,
  });


  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    console.log('Content:', content);
    if (content.length<15) {
      setEditValidationError(true)
      return; // Prevent further execution
    }
  
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
              parentId: data.gist_id
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
      
   //---------- if showModal is 'version' then create version and edit ----------
    if(showModal=='version')
      {
      try {       
          const  versionResponse = await createVersion({
            variables: {
              version: {
                gistId: data.gist_id,
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
        console.error('Error creating  Version', e);
      }
      }

     //---------- if showModal is 'edit' then create edit only ----------
      if(showModal=='edit')
        {
        try {       
            
              const editResponse = await createEdit({
                variables: {
                  edit: {
                    versionId: data.version_id,
                    body: content,
                    userId: 1,
                    createdAt: new Date().toISOString()
        
                  }
                }
              });

              if (editResponse.data) {
                console.log(editResponse.data)
                setSuccessMessage('Edit created successfully!');
              }
            
          
        
        } catch (e) {
          console.error('Error creating  Edit', e);
        }
        }

    await refetch();

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
    <div className="fixed w-full inset-0 bg-black opacity-50"></div>
        <div className="flex flex-col z-10 bg-slate-200 rounded-lg px-10 justify-center items-center w-90%">
          <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='w-full flex flex-col'>
              <label className='form-label'>Title</label>
              {
                showModal=='reply'?
                <div>
                    <input
                    className="form-input"
                    type="text"
                    {...register('title', { required: 'title is required' })}
                    />
                    <div className='flex w-full justify-end pr-4 h-2'>
                    {errors.title && <span className='error-msg'>{errors.title.message}</span>}
                    </div>
                </div>
                :
                <h1>{data.gist_title}</h1>
              }
            </div>

            <div  className='w-full flex flex-col space-y-0'>
              <label className='form-label'>Point</label>
              {
                showModal=='edit'?
                <h1>{data.version_data}</h1>
                :
                <div>
                  <textarea
                  className="form-input m-0 p-0"
                  rows={3}
                  {...register('point', { required: 'Point is required' })}
                  />
                  <div className='flex w-full justify-end pr-4 h-2'>
                      {errors.point && <span className='error-msg mt-0'>{errors.point.message}</span>}
                  </div>
                   </div>
         
              }
              
           
            </div>

            <div className=' max-h-60 rounded-md overflow-y-auto'>
              <label className='form-label'>Edit</label>
              <RichEditor content={showModal=='reply'? '' : content} setContent={setContent}/>
            </div>  
            <div className='flex w-full justify-end pr-4 mt-1 h-3'>
              {(editValidationError && content.length<20) && <span className='error-msg'>Please provide edit content</span>}
            </div>    

            <div className='flex w-full flex-row'>
                <button className="form-button" type="submit"> 
                  {showModal === 'reply' ? 'Create Gist' 
                    : showModal === 'version' ? 'Create Version' 
                    : 'Create Edit'}
                </button>
                <button className='form-button-cancel ml-4' onClick={()=>setShowModal('hidden')} >Cancel</button>
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
