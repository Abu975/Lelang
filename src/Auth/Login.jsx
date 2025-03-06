import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import EyeIcon from "./components/EyeIconPw";

const Login = () => {
  const { doLogin, changeAuthority } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Username dan Password tidak boleh kosong!");
      return;
    }

    const loginSuccess = await doLogin(username, password);

    if (loginSuccess) {
      changeAuthority("User");
      navigate("/dasboard-masyarakat-member"); // Arahkan ke dashboard masyarakat member setelah login berhasil
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <>
      <section className="flex justify-center items-center min-h-screen bg-gray-100 m-2">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center text-blue-main">Login</h2>
          <p className="text-center text-gray-600 mb-6">Selamat Datang di Pelelangan Kami!</p>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}            
                type="text" 
                className="w-full px-3 py-2 border rounded-lg" 
                placeholder="Masukkan Username" 
              />
            </div>
            <div className="mb-6 relative">
              <label className="block text-gray-700">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={isPasswordVisible ? "text" : "password"}
                className="w-full px-3 py-2 border rounded-lg" 
                placeholder="Masukkan Password"
              />
              <EyeIcon isVisible={isPasswordVisible} onClick={togglePasswordVisibility} />
            </div>

            <button onClick={handleClick} type="submit" className="w-full bg-blue-main text-white py-2.5 rounded-lg font-medium">
              Login
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Belum punya akun? <Link to="/registrasi" className=" font-bold hover:underline">Sign Up</Link>
          </p>
        </div>
      </section>
    </>
  );
}

export default Login;