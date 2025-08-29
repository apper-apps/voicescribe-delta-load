import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/Layout";
import Upload from "@/components/pages/Upload";
import Monitor from "@/components/pages/Monitor";
import Speakers from "@/components/pages/Speakers";
import ActiveJobs from "@/components/pages/ActiveJobs";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Upload />} />
            <Route path="monitor" element={<Monitor />} />
            <Route path="speakers" element={<Speakers />} />
            <Route path="jobs" element={<ActiveJobs />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="toast-custom"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;