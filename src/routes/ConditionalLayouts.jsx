import { Routes, Route, Navigate } from "react-router-dom";
import DasboardAdmin from "../moduls/Admin/DasboardAdmin";
import PendataanBarang from "../moduls/Admin/pendataanBarang";
import GenerateLaporan from "../moduls/Admin/GenerateLaporan";
import Lelang from "../moduls/Admin/Lelang";
import DasboardMasyarakat from "../moduls/Masyarakat/DasboardMasyarakat";
import Login from "../Auth/Login";
import LoginAdmin from "../Auth/LoginAdmin";
import Registrasi from "../Auth/Registrasi";
import FormPendataan from "../moduls/Admin/components/FormPendataan";
import SideBar from "../layouts/SideBar";
import AuthProvider, { useAuth } from "../Auth/AuthContext";
import MainLayoutsMasyarakatMember from "../moduls/Masyarakat/DasboardMasyarakatMember";
import { LelangProvider } from "../moduls/Admin/components/AdminContext" // Sesuaikan dengan path yang benar

const ConditionalLayout = () => {
  const { authority, isLoggedin } = useAuth();

  return (
    <Routes>
      {/* Jika belum login */}
      {!isLoggedin ? (
        <>
          <Route path="/user" element={<LelangProvider><DasboardMasyarakat /></LelangProvider>} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<LoginAdmin />} />
          <Route path="/registrasi" element={<Registrasi />} />
          <Route path="*" element={<Navigate to="/user" />} />
        </>
      ) : (
        <>
          {/* Jika login sebagai Admin */}
          {authority === "Admin" ? (
            <Route path="/" element={<SideBar />}>
              <Route path="/dasboard-admin" index element={<AuthProvider><DasboardAdmin /></AuthProvider>} />
              <Route path="pendataan-barang" element={<LelangProvider><PendataanBarang /></LelangProvider>} />
              <Route path="pendataan-barang/form-pendataan" element={<LelangProvider><FormPendataan /></LelangProvider>} />
              <Route path="generate-laporan" element={<GenerateLaporan />} />
              <Route path="buka-tutup-lelang" element={<LelangProvider><Lelang /></LelangProvider>} />
              <Route path="*" element={<Navigate to="/dasboard-admin" />} />
            </Route>
          ) : (
            // Jika login sebagai Masyarakat Member
            <Route>
              <Route path="/dasboard-masyarakat-member" element={<LelangProvider><MainLayoutsMasyarakatMember /></LelangProvider>} />
              <Route path="*" element={<Navigate to="/dasboard-masyarakat-member" />} />
            </Route>
          )}
        </>
      )}
    </Routes>
  );
};

export default ConditionalLayout;




{/* 
 const location = useLocation();

const isLogin = location.pathname.startsWith('/login') ||
location.pathname.startsWith('/registrasi') ||
location.pathname.startsWith('/admin-registrasi') ||
location.pathname.startsWith('/admin') 

const isAdminRoute = location.pathname.startsWith('/dasboard-admin') || 
location.pathname.startsWith('/pendataan-barang') || 
location.pathname.startsWith('/form-pendataan') ||  
location.pathname.startsWith('/dasboard-admin') || 
location.pathname.startsWith('/pendataan-barang') || 
location.pathname.startsWith('/generate-laporan') || 
location.pathname.startsWith('/buka-tutup-lelang')

const isMasyarakatRoute = location.pathname.startsWith('/dasboard-masyarakat') ||  
location.pathname.startsWith('/dasboard-masyarakat') 

return (
        <Routes>
            <Route path="/" index element={<DasboardMasyarakat />} />
        
        {isLogin && (
            <Route>
                <Route path="/login" element={<Login />} />
                <Route path='/admin' element={<LoginAdmin />} />
                {/* <Route path='/petugas' element={<LoginPetugas />} /> */}


    //             <Route path='/admin-registrasi' element={<RegistrasiAdmin />} />
    //             <Route path='/registrasi' element={<Registrasi />} />
    //         </Route>
    //     )}
        
    //     {isAdminRoute && (
    //         <Route
    //             path="/"
    //             element={<SideBar />}
    //         >
    //             <Route path="dasboard-admin" element={<DasboardAdmin />} />
    //             <Route path="pendataan-barang" element={<PendataanBarang />} />
    //             <Route path="pendataan-barang/form-pendataan" element={<FormPendataan/>}/>
    //             <Route path="generate-laporan" element={<GenerateLaporan />} />
    //             <Route path="buka-tutup-lelang" element={<Lelang />} />
    //         </Route>
    //     )}

    //     {isMasyarakatRoute && (          
    //             <Route path="dasboard-masyarakat-member" element={<DasboardMasyarakatMember />} />
    //     )}
    
    // </Routes> */}