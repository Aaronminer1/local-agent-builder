import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WorkflowsList from './pages/WorkflowsList';
import Builder from './pages/Builder';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/workflows" replace />} />
        <Route path="/workflows" element={<WorkflowsList />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/builder/:workflowId" element={<Builder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
