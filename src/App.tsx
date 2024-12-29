import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useRoutes } from "react-router-dom";
import Home from "./pages/home";
import routes from "tempo-routes";
import Member from "./pages/member";
import Equipment from "./pages/equipment";
import Room from "./pages/room";
import TrainingPackage from "./pages/training-package";
import Analystic from "./pages/analystic";
import Login from "./pages/login";
import { AuthProvider } from "./services/AuthContext";

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/members" element={<Member />} />
          <Route path="/equipments" element={<Equipment />} />
          <Route path="/rooms" element={<Room />} />
          <Route path="/training-packages" element={<TrainingPackage />} />
          <Route path="/analystics" element={<Analystic />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;
