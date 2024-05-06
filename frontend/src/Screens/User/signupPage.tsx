import { useState,FormEvent, useEffect} from "react";
import { Link ,useNavigate} from "react-router-dom";
import {  useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from "react-redux"
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { setCredentials } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import axios from 'axios'
import { signup } from "../../api/user";
import validator from 'validator';


interface Errors{
  name?:string;
  email?:string;
  phone?:string,
  password?:string;
  confirmPassword?:string;
}

// const G_PASSWORD=import.meta.env.REACT_APP_G

function signupPage() {

  const [name,setName]=useState<string>('')
  const [email,setEmail]=useState<string>('')
  const [phone,setPhone]=useState<string>('')
  const [password,setPassword]=useState<string>('')
  const [confirmPassword,setConfirmPassword]=useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors,setErrors]=useState<Errors>({})

  const navigate=useNavigate()
  const dispatch=useDispatch()

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const validateForm=()=>{
    const newErrors: Errors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim() || !validator.isEmail(email)) {
      newErrors.email = 'Valid email is required';
    }

    if(!phone.trim()){
      newErrors.phone="Phone is required";
    }else if(phone.length<10){
      newErrors.phone="Phone number must contain 10 numbers"
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must contain at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }


  const submitHandler=async(e:FormEvent<HTMLFormElement>): Promise<void> =>{
    try {
      e.preventDefault();
      const isValid=validateForm();

      if(isValid){
        const userData = {
          email:email,
          name: name,
          phone:phone,
          password:password,
        };
  
        const response=await signup(userData)
  
        if(response){
          
          toast.success(response.data.message)
          navigate('/Otp')
        }
      }
      
    } catch (error) {
      
    }


  }

// useEffect(()=>{
//   if(user){
//     axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
//       headers: {
//           Authorization: `Bearer ${user.access_token}`,
//           Accept: 'application/json'
//       }
//   }).then((res) => {
//     setProfile(res.data);
// }).catch((err) => console.log(err))
//   }
// },[user])

 const Glogin = useGoogleLogin({
  onSuccess: async (response) => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`
      );

      console.log(res.data);

      const data = {
        name: res.data.name,
        email: res.data.email,
        password:"qwerty123",
        isGoogle: true
      };

      const response2 = await signup(data);
      console.log(response2)
      if (response2) {
        localStorage.setItem('token', response2.data.token)
        dispatch(setCredentials(response2.data.data))
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  },

});

  return (
   <>
    <div className="flex flex-row w-full">
      <div className="hidden sm:block w-2/5 bg-white">
        <div
          className=" h-full  bg-customColor "
          style={{ clipPath: "polygon(0 0, 55% 0, 45% 100%, 0% 100%)" }}
        >
          <img className="h-48 ml-12" src="/public/logo/cut and PASTE.png" alt="" />
        </div>
      </div>
      <div className="min-h-screen  sm:bg-white bg-customColor flex flex-col justify-center items-center md:items-start py-12 sm:px-6 lg:px-8 w-full sm:w-3/5 font-sans">
        <h1 className="hidden sm:block md:overflow-x-hidden ml-1" style={{fontSize:"30px",fontWeight:"bold"}}>Create account</h1>
        <h1 className="hidden sm:block md:overflow-x-hidden ml-1">Please create an account with your details</h1>
        <h1 className="sm:hidden mr-28" style={{fontSize:"25px",fontWeight:"bold"}}>Create account</h1>
        <div className="mt-8  sm:w-full sm:max-w-md">
          <div className="bg-white py-8  px-4  rounded-lg  sm:rounded-lg sm:px-10" style={{"boxShadow": "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
            <form className="space-y-6 " onSubmit={submitHandler}>
            
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    placeholder="Please enter your full name"
                    className="bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors && <p className="text-red-500">{errors.name}</p>}
                </div>
                
                 <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="Please enter your email"
                    className="bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors && <p className="text-red-500">{errors.email}</p>}
                </div>

              
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="mobile"
                    value={phone}
                    onChange={(e)=>setPhone(e.target.value)}
                    placeholder="Please enter your mobile"
                    className=" bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors && <p className="text-red-500">{errors.phone}</p>}
                </div>

                <div className="mt-1 relative">
        <input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Please enter your Password"
          className="bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={handlePasswordVisibility}
            className="focus:outline-none"
          >
            {showPassword ? (
              <IoEyeOffSharp />
            ) : (
              <IoEyeSharp />
            )}
          </button>
        </div>
        {errors && <p className="text-red-500">{errors.password}</p>}
      </div>

              
      <div className="mt-1 relative">
        <input
          id="cpassword"
          name="cpassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Please confirm your password"
          className="bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={handleConfirmPasswordVisibility}
            className="focus:outline-none"
          >
            {showConfirmPassword ? (
             <IoEyeOffSharp />
            ) : (
              <IoEyeSharp />
            )}
          </button>
        </div>
        {errors && <p className="text-red-500">{errors.confirmPassword}</p>}
      </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a
                    href="#"
                    className=" font-normal text-black hover:text-indigo-500"
                  >
                   Already have an account?
                  </a>
                  <Link className="ml-1 text-blue-700" to="/login">Signin</Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-customColor hover:bg-teal-400"
                >
                  Sign up
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 ">
                
              <div onClick={()=>Glogin()}>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="mr-2">Sign in with Google</span>
               
                      <svg className="w-5 h-5"  xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262"><path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/><path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/><path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"/><path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/></svg>
                  </a>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   </>
  )
}

export default signupPage

