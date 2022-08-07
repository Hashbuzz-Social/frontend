import React from "react";
import Theme from "./theme/Theme";


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main } from "./screens/Main";
import { CreateTwitterCard } from "./screens/CreateTwitterCard";
import { OnBoarding } from "./screens/OnBoarding";
import { AdminPanel } from "./screens/AdminPanel";
import { Template } from "./screens/Template";
import { Invoice } from "./screens/Invoice";
import { ProtectedRoute } from "./APIConfig/AuthGuard";
import { ToastContainer } from 'react-toastify';

const App =() => {

  return (
    <>
      <Router>
        <Theme>
          <Routes>
            <Route path="/" exact element={<ProtectedRoute><Main /></ProtectedRoute>} />
            <Route path="/dashboard" exact element={<ProtectedRoute><CreateTwitterCard /></ProtectedRoute>} />
            <Route path="/campaign" exact element={<ProtectedRoute><Template /></ProtectedRoute>} />
            <Route path="/invoice" exact element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
            <Route path="/onboarding" exact element={<ProtectedRoute><OnBoarding /></ProtectedRoute>} />
            <Route path="/admin" exact element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          </Routes>
        </Theme>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
