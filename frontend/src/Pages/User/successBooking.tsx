import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import animation from "../../assets/successPage.json"

const SuccessBooking: React.FC = () => {

  const location = useLocation();
  const bookingId = location.state;

  return (
    <div className="flex items-start justify-center min-h-screen bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-center bg-slate-100 p-10 rounded-md md:h-[420px] md:mt-20">
        <div className="md:mr-8 mb-8 md:mb-0">
          <div className="w-96 h-96">
          <Lottie animationData={animation} loop={true} />
          </div>
        
        </div>
        <div className="rounded-lg  p-8 max-w-md text-center">
          <div className="flex gap-2 ">
            <h2 className="text-3xl font-bold mb-4 text-[#4AAE88]">
              Booking Successful 
            </h2>
            <img
              className="h-8"
              src="/public/logo/checkout/success-svgrepo-com.svg"
              alt=""
            />
          </div>
          <p className="text-gray-600 mb-8 text-lg font-semibold bg-[#D7EBE9] py-3 mx-au rounded-md px-2">
            Booking ID:{bookingId}
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-[#0F689D] hover:bg-blue-900 text-white text-base font-semi-bold py-2 px-5 rounded-full"
            >
              <Link to="/myBookings">My Bookings</Link>
            </button>
            <button
              //   onClick={onGoToHomepage}
              className=" text-black font-semibold py-2 px-4 rounded-full underline decoration-black underline-offset-4"
            >
              <Link to="/"> Go back to home</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessBooking;