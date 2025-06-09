import "./App.css";
import AllRoutes from "./AllRoutes";
import Sidebar from "./Components/Admin/SideBar/Sidebar";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  const hideLayoutRoutes = [
    "/login",
    "/404",
    "/forgot-password",
    "/otp",
    "/reset-password",
    "/pdf-email",
    "/pdf-verification",
    "/pdf-view"
  ];

  const isHidden = hideLayoutRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      {isHidden ? (
        <AllRoutes />
      ) : (
        <div className="d-flex w-100">
          <Sidebar />
          <div className="content">
            <div className="header"></div>
            <div className="content-part">
              <AllRoutes />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
