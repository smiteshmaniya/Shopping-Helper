import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { MainRoute } from './Routes/MainRoute'
function App() {
  return (
    <>
      <BrowserRouter>
        <MainRoute />
      </BrowserRouter>
    </>
  );
}

export default App;
