/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import SearchBar from "./components/Search";
import Header from "./components/Header";
import Card from "./components/Card";
import HistoryPenawaran from "./components/HistoryPenawaran";
import DateRangeFilter from './components/DateRangeFilter'; // Import DateRangeFilter component
import PriceRangeFilter from './components/PriceRangeFilter'; // Import PriceRangeFilter component
import { useLelang } from "../Admin/components/AdminContext"; // Sesuaikan dengan path yang benar
import Swal from 'sweetalert2';
import { useAuth } from '../../Auth/AuthContext';
import { Banknote, Calendar } from 'lucide-react';

// Import CSS for loading animation


const Lelang = () => {
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const { name } = useAuth();
  const [selectedHistory, setSelectedHistory] = useState([]);
  const { dataLelang, handleGetLelang, handleDeleteLelang, handleUpdateLelangStatus, penawaran, handleGetPenawaran, handleGetHighestBid } = useLelang();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [statusFilter, setStatusFilter] = useState("semua"); // State for status filter
  const [sortOption, setSortOption] = useState(""); // State for sort option
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date
  const [priceRange, setPriceRange] = useState({ min: "", max: "" }); // State for price range
  const [priceFilterType, setPriceFilterType] = useState("harga_awal"); // State for price filter type
  const [showDateRangePopup, setShowDateRangePopup] = useState(false); // State for showing date range popup
  const [showPriceRangePopup, setShowPriceRangePopup] = useState(false); // State for showing price range popup


  useEffect(() => {
    handleGetLelang();
    handleGetPenawaran();
  }, []);

  const handleUpdateStatus = async (id_lelang, id_barang, status) => {
    await handleUpdateLelangStatus({ id_lelang, id_barang, status });
  };

  const handleBatal = async (id_lelang) => {
    const result = await Swal.fire({
      title: 'Apakah kamu yakin?',
      text: "Anda tidak akan dapat mengembalikan ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      await handleDeleteLelang(id_lelang);
      Swal.fire(
        'Terhapus!',
        'Lelang telah dibatalkan.',
        'success'
      );
      handleGetLelang(); // Refresh lelang data after deleting
    }
  };

  const handleHistory = (idLelang) => {
    const historyData = penawaran.filter(p => p.id_lelang === idLelang);
    setSelectedHistory(historyData);
    setShowHistoryPopup(true);
  };

  const closeHistoryPopup = () => {
    setShowHistoryPopup(false);
  };

  const getHighestBid = (idLelang) => {
    const bids = penawaran.filter(p => p.id_lelang === idLelang);
    if (bids.length === 0) return { nominal: 0 };
    return bids.reduce((prev, current) => (prev.nominal > current.nominal) ? prev : current);
  };

  const addHighestBidToReport = async (id_penawaran) => {
    const highestBid = await handleGetHighestBid(id_penawaran);
    if (highestBid && highestBid.dataPenawaran && highestBid.dataPenawaran.length > 0) {
      const reportData = JSON.parse(localStorage.getItem('reportData')) || [];
      reportData.push(highestBid.dataPenawaran[0]);
      localStorage.setItem('reportData', JSON.stringify(reportData));

      const lelang = dataLelang.find(l => l.id_lelang === highestBid.dataPenawaran[0].id_lelang);
      if (lelang && lelang.status === "dibuka") {
        await handleUpdateLelangStatus({ id_lelang: lelang.id_lelang, id_barang: lelang.id_barang, status: "ditutup" });
      }
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Tidak ada penawaran tertinggi',
        text: 'Penawaran tertinggi tidak ditemukan untuk lelang ini.',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
        }
      });
    }
    closeHistoryPopup();
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

  // Sort lelang data based on sort option
  const sortedLelang = filteredLelang.sort((a, b) => {
    let highestBidA, highestBidB;
    switch (sortOption) {
      case "harga_awal_tertinggi":
        return b.harga_awal - a.harga_awal;
      case "harga_awal_terendah":
        return a.harga_awal - b.harga_awal;
      case "penawaran_tertinggi":
        highestBidA = getHighestBid(a.id_lelang);
        highestBidB = getHighestBid(b.id_lelang);
        return (highestBidB.nominal ? highestBidB.nominal : 0) - (highestBidA.nominal ? highestBidA.nominal : 0);
      case "penawaran_terendah":
        highestBidA = getHighestBid(a.id_lelang);
        highestBidB = getHighestBid(b.id_lelang);
        return (highestBidA.nominal ? highestBidA.nominal : 0) - (highestBidB.nominal ? highestBidB.nominal : 0);
      default:
        return 0;
    }
  });

  return (
    <>
<section className="">
        <div className="">

        <Header title="Lelang" name={name} />
        <div className="grid gap-2 w-full bg-white p-5 my-2 shadow-sm rounded-sm ">
        <div className="grid grid-cols-12 gap-2 w-full pt-2">
          <div className="order-1 md:order-2 col-span-12 sm:col-span-9 md:col-span-9 lg:col-span-4 xl:col-span-4">
            <SearchBar onSearch={setSearchQuery} /> {/* Implement SearchBar */}
          </div>

          <div className="order-2 col-span-6 sm:col-span-3 md:col-span-3 lg:col-span-2">
          <select
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border-none text-[#4365D1] bg-[#EAF0FC]"
            value={statusFilter}
          >
            <option className='bg-white text-gray-600' value="semua">Status</option>
            <option className='bg-white text-gray-600' value="dibuka">Buka</option>
            <option className='bg-white text-gray-600' value="ditutup">Tutup</option>
          </select>
          </div>

          <div className="order-3 col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3">
          <select
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full p-2 border-none text-[#4365D1] bg-[#EBF2FC]"
            value={sortOption}
          >
            <option className='bg-white text-gray-600' value="">Urutkan Harga</option>
            <option className='bg-white text-gray-600' value="harga_awal_tertinggi">Harga Tertinggi</option>
            <option className='bg-white text-gray-600' value="harga_awal_terendah">Harga Terendah</option>
            <option className='bg-white text-gray-600' value="penawaran_tertinggi">Penawaran Tertinggi</option>
            <option className='bg-white text-gray-600' value="penawaran_terendah">Penawaran Terendah</option>
          </select>
          </div>
             
          <div className="order-4 col-span-12 sm:col-span-6 md:col-span-8 lg:col-span-3 flex justify-start items-start gap-2">
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
          </div>
        </div>
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

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-2 h-[100vh] pb-[350px] scrollable-content pt-2">

          {Array.isArray(sortedLelang) && sortedLelang.map((lelang) => (
            <Card
              key={lelang.id_lelang}
              onUpdateStatus={(status) => handleUpdateStatus(lelang.id_lelang, lelang.id_barang, status)}
              onBatal={() => handleBatal(lelang.id_lelang)}
              onHistory={() => handleHistory(lelang.id_lelang)}
              showMainButtons={false}
              title={lelang.nama_barang}
              description={lelang.deskripsi_barang}
              date={lelang.tanggal}
              price={lelang.harga_awal}
              imageUrl={lelang.foto}
              status={lelang.status}
              highestBid={getHighestBid(lelang.id_lelang)}
            />
          ))}
       
      </div>
      </section>

      {showHistoryPopup && (
        <HistoryPenawaran
          historyData={selectedHistory}
          closePopup={closeHistoryPopup}
          addHighestBidToReport={addHighestBidToReport}
          isAdmin={true}
        />
      )}
    </>
  );
};

export default Lelang;