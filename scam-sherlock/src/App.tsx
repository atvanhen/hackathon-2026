
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Scanner from './pages/Scanner';
import Wiretap from './pages/Wiretap';
import TrainingDossier from './pages/TrainingDossier';
import Dispatcher from './pages/Dispatcher';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Scanner />} />
          <Route path="wiretap" element={<Wiretap />} />
          <Route path="training" element={<TrainingDossier />} />
          <Route path="dispatch" element={<Dispatcher />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
