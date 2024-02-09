import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { RotatingLines } from "react-loader-spinner";
import { useUserRegistrationMutation } from "../Slices/authenticationApiSlice";
import { setUserCredentials } from "../Slices/authenticationSlice";
import { useDispatch } from "react-redux";

const UserRegistrationComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [userRegistration] = useUserRegistrationMutation();
  const allowedExtensions = ["jpg", "jpeg", "png"];

  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    profileImage: null,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      const extension = file.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        toast.error(
          "Invalid file format. Please choose a .jpg, .jpeg, or .png file."
        );
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
      };
    }
  };

  const closeProfileButtonHandler = () => {
    setFormData({ ...formData, profileImage: null });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userRegistration(formData).unwrap();
      dispatch(setUserCredentials({ ...response }));
      navigate("/userHome");
    } catch (error) {
      console.error(error);
      if (error.data && error.data.error) {
        toast.error(error.data.error);
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-l-lg py-5 text-center lg:pl-16">
        <h3 className="text-black text-[24px] leading-9 font-bold mb-1">
          Create Your <span className="text-orange-700">Account</span>
        </h3>

        <form onSubmit={submitHandler}>
          <div>
            <input
              type="text"
              placeholder="Enter Your Name"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              className="my-2 w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-orange-700 text-[16px] leading-7 text-black placeholder:text-gray rounded-md cursor-pointer mb-3 md:mb-0"
            />
          </div>
          <div>
            <input
              type="email"
              value={formData.userEmail}
              onChange={handleInputChange}
              placeholder="Enter Your Email"
              name="userEmail"
              className="my-2 w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-orange-700 text-[16px] leading-7 text-black placeholder:text-gray rounded-md cursor-pointer mb-3 md:mb-0"
            />
          </div>
          <div>
            <input
              type="password"
              value={formData.userPassword}
              onChange={handleInputChange}
              placeholder="Enter Your Password"
              name="userPassword"
              className="my-2 w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-orange-700 text-[16px] leading-7 text-black placeholder:text-gray rounded-md cursor-pointer mb-3 md:mb-0"
            />
          </div>
          <div className=" text-center mt-8">
            <label
              className=" cursor-pointer"
              id="custom-label"
              htmlFor="profileInput"
            >
              Click to Upload Profile Image
            </label>
            <input
              hidden
              type="file"
              id="profileInput"
              onChange={handleProfileImage}
            />
          </div>

          {/* Profile Image Preview */}
          {formData.profileImage && (
            <div className=" flex gap-5 justify-center items-center">
              <IoMdClose onClick={closeProfileButtonHandler} />
              <div className=" flex gap-2 justify-center items-center">
                <p>Selected Image:</p>
                <img
                  src={formData.profileImage}
                  alt="Profile Preview"
                  className=" w-[100px] "
                />
              </div>
            </div>
          )}

          {/* Loader */}
          {isLoading ? (
            <div className="flex justify-center items-center">
              <RotatingLines
                visible={true}
                height="40"
                width="40"
                color="grey"
                strokeWidth="5"
                animationDuration="0.75"
                aria-label="Loading"
                role="alert"
                aria-busy="true"
              />
            </div>
          ) : (
            <div className="mt-5">
              <button
                type="submit"
                className="w-full bg-orange-700 hover:bg-orange-600 text-white text-lg leading-7 rounded-lg px-4 py-3"
              >
                Register
              </button>
            </div>
          )}
        </form>

        <p className="mt-5 text-black text-center">
          Already have an account?{" "}
          <Link className="text-blue-500 font-medium ml-1" to={"/userLogin"}>
            Login
          </Link>
        </p>
      </div>
    </>
  );
};

export default UserRegistrationComponent;
