import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserLoginForm from "../Components/UserLoginComponent";
import Login_Cover_Image from "../assets/Images/login_image.jpg"
import Header from "../Components/Header";
const UserLoginPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.authentication);

  useEffect(() => {
    if (userInfo) {
      navigate("/userHome");
    }
  }, [navigate, userInfo]);

  return (
    <>
      <Header />

      <section className="px-5 xl:px-0">
        <div className="max-w-[1170px] mx-auto ">
          <div className="rounded-lg m-10 md:p-10 md:shadow-md grid grid-cols-1 lg:grid-cols-2 ">
            <div className="  lg:block rounded-l-lg">
              <figure className="rounded-l-lg">
                <img
                  src={Login_Cover_Image}
                  alt="register"
                  className="rounded-lg  w-full"
                />
              </figure>
            </div>

            <div className="rounded-l-lg py-5 text-center lg:pl-16">
              <h3 className="text-black text-[24px] leading-9 font-bold mb-1">
                Login <span className="text-orange-700">Now</span>
              </h3>

              <UserLoginForm />

              <p className="mt-5 text-black text-center">
                Don't have an account?{" "}
                <Link
                  className="text-blue-500 font-medium ml-1"
                  to={"/userRegistration"}
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserLoginPage;
