import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import routes from "tempo-routes";
import Member from "./pages/member";
import Equipment from "./pages/equipment";
import Room from "./pages/room";
import TrainingPackage from "./pages/training-package";
import Analystic from "./pages/analystic";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/members" element={<Member />} />
          <Route path="/equipments" element={<Equipment />} />
          <Route path="/rooms" element={<Room />} />
          <Route path="/training-packages" element={<TrainingPackage />} />
          <Route path="/analytics" element={<Analystic />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
