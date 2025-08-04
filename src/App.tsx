import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/home';
import SwapPage from './pages/swap';
import FaucetPage from './pages/faucet';
import TestnetTasks from './pages/testnet-tasks'; // Added import for TestnetTasks
import './app.css';

const engine = new Styletron();

const App: React.FC = () => {
  return (
    <StyletronProvider value={engine}>
      <Theme>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/swap" element={<SwapPage />} />
            <Route path="/faucet" element={<FaucetPage />} />
            <Route path="/testnet-tasks" element={<TestnetTasks />} /> {/* Added route for TestnetTasks */}
          </Routes>
          <Footer />
        </Router>
      </Theme>
    </StyletronProvider>
  );
};

export default App;