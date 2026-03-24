import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<div className="p-8"><h1 className="text-2xl font-bold">Retail Platform — Back Office</h1><p className="mt-2 text-gray-600">Phase 1 — Foundation</p></div>} />
    </Routes>
  );
}

export default App;
