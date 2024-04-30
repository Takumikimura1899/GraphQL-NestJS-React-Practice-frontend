import './App.css';
import { GuestRoute, PrivateRoute } from './AuthRoute';
import { Main } from './components/Main';
import { NotFound } from './components/NotFound';
import { SignUp } from './components/SignUp';
import { SignIn } from './components/Signin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signin' element={<GuestRoute children={<SignIn />} />} />
        <Route path='/signup' element={<GuestRoute children={<SignUp />} />} />
        <Route path='/' element={<PrivateRoute children={<Main />} />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
