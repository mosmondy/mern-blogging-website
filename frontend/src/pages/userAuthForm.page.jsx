import React, { useContext } from 'react';
import { useRef } from 'react';
import InputBox from '../components/input.component';
import googleIcon from '../imgs/google.png';
import { Link, Navigate } from 'react-router-dom';
import AnimationWrapper from '../common/page-animation';
import { storeInSession } from '../common/session';

// create ui alerts
import { Toaster, toast } from 'react-hot-toast';
// import axios to enable you make requests to the server
import axios from 'axios';
import { UserContext } from '../App';
import { authWithGoogle } from '../common/firebase';

const UserAuthForm = ({ type }) => {
  // we use react hook useref to select or reference the form
  //! const authForm = useRef();

  //  access the global UserContext in app jsx using useContext
  // to gain acess to userAuth
  // get the access token from the user auth
  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  console.log(access_token);

  // define function that sends data to the backend
  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        // console.log(data);
        storeInSession('user', JSON.stringify(data));
        // console.log(sessionStorage);
        // set the user auth once user is logged in
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
        console.log(response);
      });
  };

  const handleSubmit = (e) => {
    // prevent page from reloading when form is submitted
    e.preventDefault();

    // check the type, remember we pass the type
    let serverRoute = type == 'sign-in' ? '/signin' : '/signup';

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    let form = new FormData(formElement);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { fullname, email, password } = formData;

    // form validation front end

    // on sign in we do not have fullname hence
    if (fullname) {
      if (fullname.length < 4) {
        return toast.error('Full name must be more than three letters long.');
      }
    }

    //   validate email
    if (!email.length) {
      return toast.error('Enter your email please');
    }
    //   check email pattern: reg ex
    if (!emailRegex.test(email)) {
      return toast.error('email is invalid');
    }
    //   check password
    if (!passwordRegex.test(password)) {
      return toast.error(
        'Password should be 6 to 20 characters long with numeric, 1 lowercase and 1 uppercase letters'
      );
    }

    // create function to send data to backend
    // if there is no invalidation the function is called
    userAuthThroughServer(serverRoute, formData);
  };

  // const handleGoogleAuth = (e) => {
  //   e.preventDefault();

  //   authWithGoogle()
  //     .then((user) => {
  //       // console.log(user);
  //       let serverRoute = '/google-auth';

  //       let formData = {
  //         access_token: user.access_token,
  //       };

  //       userAuthThroughServer(serverRoute, formData);
  //     })
  //     .catch((err) => {
  //       toast.error('trouble loggin in through google: from azarea');
  //       return console.log(err);
  //     });
  // };

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then(({ access_token }) => {
        let serverRoute = '/google-auth';

        let formData = {
          access_token: access_token, // Correctly send the ID token
        };

        userAuthThroughServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error('Trouble logging in through Google: from Azarea');
        console.log(err);
      });
  };

  return (
    // if the user is logged in navigate them somewhere else by checking if we have the access token
    access_token ? (
      <Navigate to='/' />
    ) : (
      <AnimationWrapper keyValue={type}>
        <section className='h-cover flex items-center justify-center '>
          <Toaster />
          <form id='formElement' action='' className='w-[80%] max-w=[400px] '>
            <h1 className='text-4xl font-nytCheltenham capitalize text-center mb-24'>
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
            <button
              className='btn-dark center font-nytCheltenham  mt-14 rounded-lg'
              type='submit'
              onClick={handleSubmit}
            >
              {type.replace('-', ' ')}
            </button>

            <div className='relative w-full items-center flex gap-2 my-10 opacity-10 uppercase text-black font-bold'>
              <hr className='w-1/2 border-black' />
              <p>or</p>
              <hr className='w-1/2 border-black' />
            </div>
            <button
              className='btn-dark font-nytCheltenham flex items-center justify-center gap-4 w-[90%] center rounded-lg'
              onClick={handleGoogleAuth}
            >
              <img src={googleIcon} alt='google icon' className='w-5' />
              continue with google
            </button>
            {type == 'sign-in' ? (
              <p className='mt-6 font-nytCheltenham text-dark-grey text-xl text-center'>
                Don't have an account?
                <Link
                  to='/signup'
                  className='underline text-black text-xl ml-1'
                >
                  Join us today
                </Link>
              </p>
            ) : (
              <p className='mt-6 text-dark-grey font-nytCheltenham text-xl text-center'>
                Already a member?
                <Link
                  to='/signin'
                  className='underline text-black text-xl ml-1'
                >
                  Sign in here.
                </Link>
              </p>
            )}
          </form>
        </section>
      </AnimationWrapper>
    )
  );
};

export default UserAuthForm;
