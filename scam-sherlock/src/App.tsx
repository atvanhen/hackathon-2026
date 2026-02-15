
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Scanner from './pages/Scanner';
import Wiretap from './pages/Wiretap';
import TrainingDossier from './pages/TrainingDossier';
import Dispatcher from './pages/Dispatcher';
import Analytics from './pages/Analytics';
import AgentProfile from './pages/AgentProfile';

import ThreatLedger from './pages/ThreatLedger';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Scanner />} />
          <Route path="map" element={<ThreatLedger />} />
          <Route path="wiretap" element={<Wiretap />} />
          <Route path="training" element={<TrainingDossier />} />
          <Route path="dispatch" element={<Dispatcher />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<AgentProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
