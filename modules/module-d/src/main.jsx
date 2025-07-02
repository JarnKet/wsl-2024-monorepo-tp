import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

// Third Party
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import RootLayout from "./components/RootLayout.jsx";
import CarparksPage from "./pages/CarparksPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import WeatherPage from "./pages/WeatherPage.jsx";
import SettingPage from "./pages/SettingPage.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <CarparksPage />,
        },
        {
          path: "/events",
          element: <EventsPage />,
        },
        {
          path: "/weather",
          element: <WeatherPage />,
        },
        {
          path: "/setting",
          element: <SettingPage />,
        },
      ],
    },
  ],
  {
    basename: "/16_module_d/",
  }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
