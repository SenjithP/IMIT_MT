import logo from "../assets/images/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import { useUserLogoutMutation } from "../Slices/authenticationApiSlice";
import { userLogout } from "../Slices/authenticationSlice";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const Header = ({ onSearch }) => {
  const { userInfo } = useSelector((state) => state.authentication);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userLogoutApiCall] = useUserLogoutMutation();

  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  const logoutHandler = async () => {
    try {
      if (userInfo) {
        await userLogoutApiCall().unwrap();
        dispatch(userLogout());
        toast.success("Logout Successful");
        navigate("/userLogin");
      }
    } catch (error) {
      toast.error(error.data.message);
      console.log(error);
    }
  };
  
  let navLinks;
  if (!userInfo) {
    navLinks = [
      { path: "/userRegistration", display: "Register" },
      { path: "/userLogin", display: "Login" },
    ];
  } else {
    navLinks = [
      {
        path: "/userHome",
        display: userInfo.name,
      },
      {
        display: "Logout",
      },
    ];
  }

  const headerRef = useRef(null);
  const menuRef = useRef(null);

  const handleStickyHeader = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    });
  };

  useEffect(() => {
    handleStickyHeader();
    return () => window.removeEventListener("scroll", handleStickyHeader);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <header className=" flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between md:mr-[90px]">
          {/* ==========logo==========*/}
          <div>
            <NavLink to={"/"}>
              <img
                className="w-[67px] mt-[26px] ml-[90px]"
                src={logo}
                alt="logo"
              />
            </NavLink>
          </div>

          {/* ==========menu==========*/}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-4">
              {userInfo && (
                <div
                  className="flex items-center bg-gray-200 rounded-full p-2"
                  onClick={stopPropagation}
                >
                  <input
                    type="text"
                    placeholder="Search With Description..."
                    className="bg-gray-200 outline-none"
                    onChange={handleChange}
                  />
                  <CiSearch
                    onClick={stopPropagation}
                    className="cursor-pointer"
                  />
                </div>
              )}

              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className="text-white text-[16px] leading-7 font-[600] bg-[#E7AD99] hover:bg-[#f09a7d] py-2 px-16 rounded-full flex"
                    activeClassName="isActive"
                  >
                    {userInfo ? (
                      <div className="relative flex">
                        {link.display && (
                          <button
                            className="relative flex items-center"
                            onClick={() => {
                              if (link.display.startsWith("Logout")) {
                                logoutHandler();
                              }
                            }}
                          >
                            {!link.display.startsWith("Logout") && (
                              <img
                                className="absolute right-[100px] bottom-[-8px] h-11 w-11 rounded-full"
                                src={userInfo.profilePhoto}
                                alt="profileImage"
                              />
                            )}

                            <span className="w-[80px]">{link.display}</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      link.display
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ==========toggle==========*/}
          <span className="md:hidden" onClick={toggleMenu}>
            <BiMenu className="w-6 h-6 cursor-pointer" />
          </span>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
export default Header;
