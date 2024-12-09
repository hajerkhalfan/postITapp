import "./App.css";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Home from "./Components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row } from "reactstrap"; //import the Reactstrap Components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./Components/Profile";
import Register from "./Components/Register";
import Login from "./Components/Login";
import { useSelector } from "react-redux";


const App = () => {
  const { user } = useSelector((state) => state.users);
 
  return (
    <Container fluid>
      <Router>
        <Row>
          {user ? <Header /> : null}
        </Row>
        <Row className="main">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
          </Routes>
        </Row>
        <Row>{user ? <Footer /> : null}</Row>
      </Router>
    </Container>
  );
};

export default App;
