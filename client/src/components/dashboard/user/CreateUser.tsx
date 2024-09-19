
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($user: AddUserInput!) {
    addUser(user: $user) {
      id
      name
      username
    }
  }
`;

type FormValues = {
  name: string;
  username: string;
  password: string;
};

const CreateUser: React.FC = () => {

  const { register, handleSubmit,reset, formState: { errors } } = useForm<FormValues>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [createUser, { loading, error }] = useMutation(CREATE_USER);

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    try {
      const {data} = await createUser({
        variables: {
          user: {
            name: formData.name,
            username: formData.username,
            password: formData.password
          }
        }
      });
      if(data){
        setSuccessMessage('User created successfully!');
      }

    } catch (e) {
      console.error("Error creating user", e);
    }
  };

  useEffect(() => {
    if (successMessage) {
      reset()
      const timer = setTimeout(() => {
        setSuccessMessage(null); 
      }, 4000); 

      return () => clearTimeout(timer); 
    }
  }, [successMessage]);

  if(loading) return <h1>loading...</h1>
  if(error) return <h1>something went wrong</h1>

  return (
    <div className='flex w-full justify-center items-center p-20'>
        <div className="flex flex-col justify-center items-center w-full">
           <h2 className="form-heading">Create User</h2>
    
          <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='w-full flex flex-col'>
              <label className='form-label'>Name</label>
              <input
                className="form-input"
                type="text"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <span className='error-msg'>{errors.name.message}</span>}
            </div>

            <div  className='w-full flex flex-col'>
              <label className='form-label'>Username</label>
              <input
                className="form-input"
                type="text"
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && <span className='error-msg'>{errors.username.message}</span>}
            </div>

            <div  className='w-full flex flex-col'>
              <label className='form-label'>Password</label>
              <input
                className="form-input"
                type="password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <span className='error-msg'>{errors.password.message}</span>}
            </div>

            <button className="form-button" type="submit">Create User</button>

            <div className='flex flex-row w-full justify-center'>
            <span className='success-msg '><span className='success-msg'>{successMessage}</span></span>
            </div>
            
          </form>
        </div>
    </div>
  
  );
};

export default CreateUser;
