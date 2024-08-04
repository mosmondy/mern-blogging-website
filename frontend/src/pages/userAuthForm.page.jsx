import React from 'react';
import InputBox from '../components/input.component';
import googleIcon from '../imgs/google.png';
import { Link } from 'react-router-dom';
import AnimationWrapper from '../common/page-animation';

const UserAuthForm = ({ type }) => {
  return (
    <AnimationWrapper keyValue={type}>
      <section className='h-cover flex items-center justify-center '>
        <form action='' className='w-[80%] max-w=[400px]'>
          <h1 className='text-4xl font-poppins capitalize text-center mb-24'>
            {/* check if user is in sign in or sign up */}
            {type == 'sign-in' ? 'welcome back to azarea' : 'join azarea now'}
          </h1>

          {type != 'sign-in' ? (
            <InputBox
              name='fullname'
              type='text'
              placeholder='enter your full name'
              icon='fi-rr-user'
            />
          ) : (
            ''
          )}
          <InputBox
            name='email'
            type='text'
            placeholder='enter your email'
            icon='fi-rr-envelope'
          />
          <InputBox
            name='password'
            type='password'
            placeholder='enter your password'
            icon='fi-rr-key'
          />
          <button className='btn-dark center mt-14 rounded-lg' type='submit'>
            {type.replace('-', ' ')}
          </button>

          <div className='relative w-full items-center flex gap-2 my-10 opacity-10 uppercase text-black font-bold'>
            <hr className='w-1/2 border-black' />
            <p>or</p>
            <hr className='w-1/2 border-black' />
          </div>
          <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center rounded-lg'>
            <img src={googleIcon} alt='google icon' className='w-5' />
            continue with google
          </button>
          {type == 'sign-in' ? (
            <p className='mt-6 text-dark-grey text-xl text-center'>
              Don't have an account?
              <Link to='/signup' className='underline text-black text-xl ml-1'>
                Join us today
              </Link>
            </p>
          ) : (
            <p className='mt-6 text-dark-grey text-xl text-center'>
              Already a member?
              <Link to='/signin' className='underline text-black text-xl ml-1'>
                Sign in here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
 