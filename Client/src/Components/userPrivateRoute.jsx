import React from "react";
import { Navigate } from "react-router-dom";
import {useSelector} from 'react-redux'
import PropTypes from "prop-types";

function UserPrivateRoute({ children }) {

  const { userInfo } = useSelector( (state) => state.authentication );
  return userInfo ? <>{children}</> : <Navigate to="/userLogin" />;
}
UserPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default UserPrivateRoute;