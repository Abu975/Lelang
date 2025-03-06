import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleRegister } from "../config/api";
import Swal from "sweetalert2";
import EyeIcon from "./components/EyeIconPw";

const Registrasi = () => {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [username, setUsername] = useState("");
  const [telp, setTelp] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (telp.length > 15) {
      Swal.fire({
        icon: 'error',
        title: 'Nomor Telepon tidak valid',
        text: 'Nomor Telepon tidak boleh lebih dari 15 karakter',
      });
      return;
    }
  
    const userData = {
      nama_lengkap: namaLengkap,
      username: username,
      password: password,
      telp: telp,
    };
  
    try {
      const response = await handleRegister(userData);
      if (response.status !== 201) {
        if (response.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Registration failed',
            text: response.message,
          });
        } else {
          throw new Error('Registration failed');
        }
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Registration successful!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          navigate('/login'); // Navigate to login page after successful registration
        });
      }
    } catch (error) {
      console.error('Registration error:', error); // Debugging
      Swal.fire({
        icon: 'error',
        title: 'Registration failed',
        text: error.message,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <>
      <section className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center text-blue-main">Sign Up</h2>
          <p className="text-center text-gray-600 mb-6">Jadilah Bagian dari Kami!</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Nama Lengkap</label>
              <input 
                type="text" 
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg" 
                placeholder="Masukkan Nama Lengkap" 
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg" 
                placeholder="Masukkan Username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">No. Telephone</label>
              <input 
                type="text" 
                value={telp}
                onChange={(e) => setTelp(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg" 
                placeholder="Masukkan Nomor Hp"
                required
              />
            </div>
            <div className="mb-6 relative">
              <label className="block text-gray-700">Password</label>
              <input 
                type={isPasswordVisible ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg" 
                placeholder="Masukkan Password"
                required
              />
              <EyeIcon isVisible={isPasswordVisible} onClick={togglePasswordVisibility} />
            </div>
            <button type="submit" className="w-full bg-blue-main text-white py-2.5 rounded-lg font-medium">
              Sign Up
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Sudah punya akun? <Link to="/login" className=" font-bold hover:underline">Login</Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default Registrasi;