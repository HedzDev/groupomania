import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './containers/Login';
import Signup from './containers/Signup';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
