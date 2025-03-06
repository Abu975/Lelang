/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Auth/AuthContext"; // Sesuaikan dengan path yang benar
import { getUser } from "../../../config/api";
import { useLelang } from "./AdminContext";
import { FileOutput, LogOut } from "lucide-react";

const Logout = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { doLogout, role, name } = useAuth();
  const { users } = useLelang()
  const navigate = useNavigate();

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    doLogout();
    if (role === "Admin") {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <div className="flex items-center">
        <div className="flex items-center ms-3 ml-auto">
          <div>
            <button
              type="button"
              id="logoutButton" // Tambahkan id ini
              className="flex justify-center items-center text-sm rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-white-500"
              aria-expanded={isUserMenuOpen}
              onClick={toggleUserMenu}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-10 h-10 rounded-full"
                src="profile-user.png"
                alt="user photo"
              />
            </button>
          </div>

        <div className="flex flex-col">


          {isUserMenuOpen && (
            <div className="relative mt-5">
              <div
                className="absolute right-0 z-60 my-6 text-base list-none bg-[#DADCF5] divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-white dark:divide-white w-25 items-center text-center"
                id="dropdown-user"
              >
          

                <ul className="py-1">
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full py-2 text-center font-semibold text-sm text-[#4365D1] hover:bg-gray-100"
                    >
                     <LogOut className="w-4 h-4 inline text-[#4365D1]"/> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
            
          
        </div>

        </div>
      </div>
    </>
  );
};

export default Logout;
