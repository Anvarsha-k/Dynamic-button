import { createContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ConfigPage from './pages/ConfigPage';
import OutputPage from './pages/OutputPage';
import './App.css';

export const WorkflowContext = createContext();

function App() {
  const [workflow, setWorkflow] = useState({
    buttonLabel: '',
    actions: []
  });

  useEffect(() => {
    const savedWorkflow = localStorage.getItem('buttonWorkflow');
    if (savedWorkflow) {
      setWorkflow(JSON.parse(savedWorkflow));
    }
  }, []);

  const saveWorkflow = (newWorkflow) => {
    setWorkflow(newWorkflow);
    localStorage.setItem('buttonWorkflow', JSON.stringify(newWorkflow));
  };

  return (
    <WorkflowContext.Provider value={{ workflow, saveWorkflow }}>
      <BrowserRouter>
        <div className="app-container">
          <header>
            <h1>Dynamic Button Workflow</h1>
            <nav>
              <Link to="/" className="nav-link">Config</Link>
              <Link to="/output" className="nav-link">Output</Link>
            </nav>
          </header>

          <main>
            <Routes>
              <Route path="/" element={<ConfigPage />} />
              <Route path="/output" element={<OutputPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </WorkflowContext.Provider>
  );
}

export default App;