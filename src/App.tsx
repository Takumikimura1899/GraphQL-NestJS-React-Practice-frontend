import './App.css';
import { Main } from './components/Main';
import { NotFound } from './components/NotFound';
import { SignUp } from './components/SignUp';
import { SignIn } from './components/Signin';

function App() {
  return (
    <>
      <SignIn />
      <SignUp />
      <Main />
      <NotFound />
    </>
  );
}

export default App;
