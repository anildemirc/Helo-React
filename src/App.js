import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import NavBar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import User from './components/User/User';
import Auth from './components/Auth/Auth';
import Follower from './components/Following/Follower';
import Following from './components/Following/Following';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar></NavBar>
        <Routes>
          <Route exact path='/' element={<Home/>}></Route>
          <Route exact path='/users/:userId' element={<User/>}></Route>
          <Route exact path='/auth' element= {localStorage.getItem("currentUser") !=null ? <Navigate  to="/"/> :<Auth/>}></Route>
          <Route exact path='/following/:userId' element={<Following/>}></Route>
          <Route exact path='/followers/:userId' element={<Follower/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
