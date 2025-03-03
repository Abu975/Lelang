import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SearchBar from "../Admin/components/Search";
import Card from "../Admin/components/Card";
import HistoryPenawaran from "../Admin/components/HistoryPenawaran";
import { useAuth } from "../../Auth/AuthContext"; // Sesuaikan dengan path yang benar
import { useLelang } from "../Admin/components/AdminContext"; // Sesuaikan dengan path yang benar
import DateRangeFilter from '../Admin/components/DateRangeFilter'; // Import DateRangeFilter component
import PriceRangeFilter from '../Admin/components/PriceRangeFilter'; // Import PriceRangeFilter component
import { Banknote, Calendar } from 'lucide-react';

const DasboardMasyarakat = () => {
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const { isLoggedin } = useAuth(); // Mengambil status login
  const { dataLelang, handleGetLelang, handleGetPenawaran, penawaran } = useLelang();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date
  const [priceRange, setPriceRange] = useState({ min: "", max: "" }); // State for price range
  const [priceFilterType, setPriceFilterType] = useState("harga_awal"); // State for price filter type
  const [statusFilter, setStatusFilter] = useState("semua"); // State for status filter
  const [showDateRangePopup, setShowDateRangePopup] = useState(false); // State for showing date range popup
  const [showPriceRangePopup, setShowPriceRangePopup] = useState(false); // State for showing price range popup

  useEffect(() => {
    handleGetLelang();
    handleGetPenawaran();
  }, []);

  const handleHistory = (idLelang) => {
    const historyData = penawaran.filter(p => p.id_lelang === idLelang);
    setSelectedHistory(historyData);
    setShowHistoryPopup(true);
  };

  const closeHistoryPopup = () => {
    setShowHistoryPopup(false);
  };

  const handleLoginDulu = () => {
    if (!isLoggedin) {
      // Tampilkan notifikasi meminta pengguna untuk login terlebih dahulu
      Swal.fire({
        title: "Login Diperlukan",
        text: "Anda harus login terlebih dahulu untuk menawar barang.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          // Arahkan pengguna ke halaman login
          navigate("/login");
        }
      });
    } else {
      // Proses tawar barang jika pengguna sudah login
      console.log("Menawar barang");
    }
  };

  const getHighestBid = (idLelang) => {
    const bids = penawaran.filter(p => p.id_lelang === idLelang);
    if (bids.length === 0) return { nominal: 0 };
    return bids.reduce((prev, current) => (prev.nominal > current.nominal) ? prev : current);
  };

  // Filter lelang data based on search query, date range, price range, and status filter
  const filteredLelang = dataLelang.filter(lelang => {
    const matchesSearchQuery = lelang.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lelang.deskripsi_barang.toLowerCase().includes(searchQuery.toLowerCase());

    const lelangDate = new Date(lelang.tanggal);
    const matchesDateRange = (!startDate || lelangDate >= new Date(startDate)) && (!endDate || lelangDate <= new Date(endDate));

    const highestBid = getHighestBid(lelang.id_lelang);
    const effectivePrice = priceFilterType === 'nominal' ? highestBid.nominal : lelang.harga_awal;
    const matchesPriceRange = (!priceRange.min || effectivePrice >= Number(priceRange.min)) &&
      (!priceRange.max || effectivePrice <= Number(priceRange.max));

    const matchesStatusFilter = statusFilter === "semua" || lelang.status === statusFilter;

    return matchesSearchQuery && matchesDateRange && matchesPriceRange && matchesStatusFilter;
  });

  return (
    <>
    
    <div className='bg-white flex fixed w-full px-2 z-30'>
    <div className="flex justify-center align-middle items-center py-4 gap-1 w-full max-w-[880px] mx-auto">
          <SearchBar onSearch={setSearchQuery} /> {/* Implement SearchBar */}
          {!isLoggedin && (
            <Link to="/login" className="btn btn-primary">
              <div className='bg-blue-main text-white px-5 py-2 rounded-lg'>
                Login
              </div>
            </Link>
          )}
        </div>
    </div>

 


    
      <section className="p-2 pt-16 max-w-[900px] mx-auto ">
        

        <div className="grid grid-cols-12 mt-4 gap-1 bg-white p-5">
        <select
            className="col-span-12 sm:col-span-4 border-0 w-full p-2 border-none text-[#4365D1] bg-[#EBF2FC] rounded-lg"
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
          >
            <option value="semua">Buka & Tutup</option>
            <option value="dibuka">Buka</option>
            <option value="ditutup">Tutup</option>
          </select>
          <button
            className="col-span-6 sm:col-span-2 text-white p-2 bg-[#4365D1] shadow-2xl rounded-lg flex items-center justify-center"
            onClick={() => setShowDateRangePopup(true)}
          >
            <Calendar className="w-5 h-5 mr-2" /> Tanggal
          </button>
          <button
            className="col-span-6 sm:col-span-2 text-white p-2 bg-[#4365D1] shadow-2xl rounded-lg flex items-center justify-center"
            onClick={() => setShowPriceRangePopup(true)}
          >
            <Banknote className="w-5 h-5 mr-2" /> Harga
          </button>
          
        </div>

        {showDateRangePopup && (
          <DateRangeFilter
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            closePopup={() => setShowDateRangePopup(false)}
          />
        )}

        {showPriceRangePopup && (
          <PriceRangeFilter
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            priceFilterType={priceFilterType}
            setPriceFilterType={setPriceFilterType}
            closePopup={() => setShowPriceRangePopup(false)}
          />
        )}

        {Array.isArray(filteredLelang) && filteredLelang.length === 0 ? (
          <p className="text-center">Tidak ada data lelang tersedia.</p>
        ) : (
          <div className=' scrollable-content h-[100vh] pb-[200px] mt-2'>
          
           
          <div className="bg-[#6E82B9] text-white p-4 mx-2 flex justify-between items-center mb-2 rounded-lg shadow-md ">
          <div className="flex items-center">
            <div>
              <h1 className="text-xl font-bold">Hallo, Selamat Datang!</h1>
              <p>Mau lelang? hubungi kami sekarang</p>
            </div>
          </div>
          <button className="bg-[#EBF2FC] text-[#4365D1] font-semibold p-2 rounded-lg shadow-md">Hubungi</button>
        </div>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {filteredLelang.map((lelang) => (
              <Card
                key={lelang.id_lelang}
                isMasyarakatPage={true}
                onHistory={() => handleHistory(lelang.id_lelang)}
                handleLoginDulu={handleLoginDulu} // Gunakan handleLoginDulu di sini
                isLoggedin={isLoggedin} // Tambahkan status login
                onTawar={() => handleLoginDulu()} // Pastikan pengguna diarahkan ke login saat menawar
                title={lelang.nama_barang}
                description={lelang.deskripsi_barang}
                date={lelang.tanggal}
                price={lelang.harga_awal}
                imageUrl={lelang.foto} // URL gambar jika tersedia
                highestBid={getHighestBid(lelang.id_lelang)}
                status={lelang.status}
              />
            ))}
          </div>
          
          
          </div>
        )}
        {showHistoryPopup && (
          <HistoryPenawaran historyData={selectedHistory} closePopup={closeHistoryPopup} />
        )}
        
      </section>
   
    </>
  );
};

export default DasboardMasyarakat;