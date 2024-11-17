import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import Profile from './Components/Profile/Profile'
import Login from './Components/Authentication/Login/Login'
import ForgotPassword from './Components/Authentication/ForgotPassword/ForgotPassword';
import Friends from './Components/Mainpage/Friends/Friends';
import FriendsCard from './Components/Mainpage/Friends/FriendsCard';
import Layout from './Components/Mainpage/Layout';
import Post from './Components/Mainpage/MiddlePannel/PostContainer/Post';
import ProfilePhotos from './Components/Profile/ProfilePhotos';
import SavedPost from './Components/Mainpage/LeftSidePannel/SavedPost';
import Videos from './Components/Mainpage/MiddlePannel/Videos/Videos';
import  PrivaateRoute from './Components/Others/PrivaateRoute'
function App() {
  return (
    <div className="App">
      <ToastContainer/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/forgot_password' element={<ForgotPassword/>} />
          <Route element={<PrivaateRoute/>}>
          <Route path='/profile/:userId' element={<Profile/>} />
          <Route path='/friends' element={<Friends/>} />
          <Route path='/dashboard' element={<Layout/>} />
          <Route path='/profile/:userpost' element={<Post/>} />
          <Route path='/photos/:userId' element={<ProfilePhotos/>} />
          <Route path='/savepost/:userId' element={<SavedPost/>} />
          <Route path='/videos' element={<Videos/>} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
