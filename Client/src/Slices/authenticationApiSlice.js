import { apiSlice } from "./apiSlice";
const USERS_URL = "/api/authentication";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userRegistration: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/userRegistration`,
        method: "POST",
        body: data,
      }),
    }),
    userLogin:builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/userLogin`,
        method: "POST",
        body: data,
      }),
    }),
    userLogout:builder.mutation({
      query:()=>({ 
          url:`${USERS_URL}/userLogout`,
          method:"POST",
      })
  }),
  }),
});

export const { useUserRegistrationMutation,useUserLoginMutation,useUserLogoutMutation } = usersApiSlice;
