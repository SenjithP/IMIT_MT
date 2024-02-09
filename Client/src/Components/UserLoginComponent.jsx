import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { setUserCredentials } from "../Slices/authenticationSlice";
import { useUserLoginMutation } from "../Slices/authenticationApiSlice";

const UserLoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userLogin] = useUserLoginMutation();

  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { userEmail, userPassword } = formData;

    try {
      const response = await userLogin({ userEmail, userPassword }).unwrap();
      dispatch(setUserCredentials({ ...response }));
      navigate("/userHome");
    } catch (error) {
      if (error.data && error.data.error) {
        toast.error(error.data.error);
      } else {
        toast.error("An error occurred");
      }
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="">
        <input
          type="email"
          placeholder="Enter Your Email"
          name="userEmail"
          value={formData.userEmail}
          onChange={handleInputChange}
          className="my-2 w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-orange-700 text-[16px] leading-7 text-black placeholder:text-gray rounded-md cursor-pointer mb-3 md:mb-0"
        />
      </div>

      {/* Password input */}
      <div className="">
        <input
          type="password"
          placeholder="Enter Your Password"
          name="userPassword"
          value={formData.userPassword}
          onChange={handleInputChange}
          className="my-2 w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-orange-700 text-[16px] leading-7 text-black placeholder:text-gray rounded-md cursor-pointer mb-3 md:mb-0"
        />
      </div>

      {/* Submit button */}
      <div className="mt-5">
        <button
          type="submit"
          className="w-full bg-orange-700 hover:bg-orange-600 text-white text-lg leading-7 rounded-lg px-4 py-3"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default UserLoginForm;
