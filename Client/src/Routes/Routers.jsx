import { Routes, Route } from "react-router-dom";
import UserRegisterPage from "../Pages/UserRegisterPage.jsx";
import UserLoginPage from "../Pages/UserLoginPage";
import UserHomePage from "../Pages/UserHomePage";
import UserPrivateRoute from "../Components/userPrivateRoute.jsx";
import NoMatch from "../Pages/NoMatch.jsx";

const Routers = () => {
  return (
    <Routes>
      <Route path="*" element={<NoMatch />} />
      <Route path="/" element={<UserRegisterPage />} />
      <Route path="/userRegistration" element={<UserRegisterPage />} />
      <Route path="/userLogin" element={<UserLoginPage />} />
      <Route path="/userHome" element={<UserPrivateRoute><UserHomePage /></UserPrivateRoute>} />    

    </Routes>
  );
};

export default Routers;
