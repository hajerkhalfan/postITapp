import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../Features/UserSlice";
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import User from '../Components/User.js';
import { useNavigate } from "react-router-dom";


const Profile = () => {
      //Retrieve the user details from Redux store.
      const user = useSelector((state) => state.users.user);
  
      // Create state variables for user input and assign initial values from the Redux store
      const [userName, setUserName] = useState(user?.name);
      const [pwd, setPwd] = useState(user?.password);
      const [confirmPassword, setConfirmPassword] = useState(user?.password);
      const [email, setEmail] = useState(user?.email );
      const [profilePic, setProfilePic] = useState(user?.profilePic);

      const navigate = useNavigate();
      const dispatch=useDispatch();


      const handleUpdate = (event) => {
        // Prevent the default form submission behavior
        event.preventDefault();
    
        // Prepare the user data object with the current user's email and updated details
        const userData = {
          email: email, // Retrieve email from the Redux store
          name: userName, // Get the updated name from the state variable
          password: pwd, // Get the updated password from the state variable
          profilePic: profilePic,
        };
        console.log(userData);
        // Dispatch the updateUserProfile action to update the user profile in the Redux store
        dispatch(updateUserProfile(userData));
        alert("Profile Updated.");
        // Navigate back to the profile page after the update is completed
        navigate("/profile");
      };
  // Function to handle file input change
  const handleFileChange = (event) => {
    // Use e.target.files[0] to get the file itself
    const uploadFile = event.target.files[0];
    if (!uploadFile) alert("No file uploaded");
    else setProfilePic(event.target.files[0]);
  };


  
  return (
    <Container fluid>
    <h1>Profile</h1>
    <Row>
      <Col md={2}>
        <User />
      </Col>
      <Col md={4}>
          Update Profile
          <Form onSubmit={handleUpdate}> 
            <input type="file" name="profilePic" />
            <div className="appTitle"></div>
            Update Profile
            <FormGroup>
              <Label for="name">Name</Label>
              <Input id="name"
               name="name"
                placeholder="Name..." 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                type="text" />
                
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Email..."
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="Password..."
                value={pwd}
                type="password"
                onChange={(e) => setPwd(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword "
                name="confirmPassword"
                placeholder="Confirm Password..."
                value={confirmPassword}
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Button color="primary" className="button">
                Update Profile
              </Button>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    </Container>


  );
};

export default Profile;
