import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

export const logout = createAsyncThunk(
  "users/logout",
  async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/logout`);
      const msg = response.data.msg
      console.log(msg)
      return { msg }
    }
    catch (err) { }
  })
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData) => { 
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/registerUser`, {
        name: userData.name,
        email: userData.email,
        password: userData.password
      })
      const user = response.data.user;
      const msg = response.data.msg;
      console.log(msg);
      return {user,msg}

    }
    catch (error) { 
      const msg = error.message;
      return { msg }
    }

  } 
)
export const login = createAsyncThunk(
  "users/login",
  async (userData,{rejectWithValue}) => {
    try {
      console.log(process.env.REACT_APP_API_URL)
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          email: userData.email,
          password: userData.password,
        }
      );
      const user = response.data.user;
      const msg = response.data.msg;
      return { user, msg };
    } catch (error) {
      //const msg = 'Invalid credentials';
      const msg = error.response.data.msg;
      return rejectWithValue({ msg });
    }
  }
);


export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile", // Action type string for Redux
  async (userData) => {
    try {
      // Log the user data being sent for debugging purposes
      // console.log(userData);

      // Send a PUT request to the server to update the user profile
      const response = await axios.put(
        `http://localhost:3001/updateUserProfile/${userData.email}`, // API endpoint for updating user profile
        {
          // Request payload with user data to be updated
          email: userData.email,
          name: userData.name,
          password: userData.password,
          profilePic: userData.profilePic,
        },
        {
          headers: {  //headers is necessary when uploading files with form-data in a request.
            "Content-Type": "multipart/form-data", 
          },
        }
      );
        // Extract the updated user data from the server response
        const user = response.data.user;
  
        // Return the updated user data, which will be used by Redux to update the state
        return user;
      } catch (error) {
        // Log any errors that occur during the request
        console.log(error);
      }
    }
  );  


const initialState = {
  user:null,
  msg: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  isLogin:false,
}
export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: 
    (builder) => {
      builder
        .addCase(registerUser.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.isSuccess = true;
          state.user = action.payload.user;
          state.msg = action.payload.msg;

        })
        .addCase(registerUser.rejected, (state) => {
          state.isError = true;
          state.msg = "Unexpected error is occured";
        })
        .addCase(login.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.isLogin = true;
          state.user = action.payload.user;
          state.msg = action.payload.msg;
        })
        .addCase(login.rejected, (state,action) => {
           state.isError = true;
           state.isLogin = false;
           state.user = null;
           state.msg = action.payload.msg;
        })
        .addCase(logout.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(logout.fulfilled, (state, action) => {
          state.isLogin = false;
          state.user = null;
          state.msg = action.payload.msg;          
        })
        .addCase(logout.rejected, (state) => {
           state.isError = true
        })

        .addCase(updateUserProfile.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateUserProfile.fulfilled, (state, action) => {
          state.user = action.payload;
          state.isLoading = false;
        })
        .addCase(updateUserProfile.rejected, (state) => {
          state.isLoading = false;
          state.isError = true;
        })
    


    }
  
  

}) 
export default userSlice.reducer;