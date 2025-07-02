import React from "react";

// Third Party
import { Link, useLocation } from "react-router-dom";

// Constants
import { NAVIGATION_MENUS } from "../constants/index";

const NavigationBar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  console.log("Location:", location);

  return (
    <footer>
      <nav>
        <ul>
          {NAVIGATION_MENUS.map((item) => (
            <li key={item.href}>
              <Link
                className={pathname === item.href ? "active" : ""}
                to={item.href}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
};

export default NavigationBar;
