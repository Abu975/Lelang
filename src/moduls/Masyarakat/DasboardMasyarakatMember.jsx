import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Card from "../Admin/components/Card";
import SearchBar from "../Admin/components/Search";
import HeaderMasyarakat from "./components/HeaderMasyarakat";
import HistoryPenawaran from "../Admin/components/HistoryPenawaran";
import PenawaranHarga from "./components/PenawaranHarga";
import { useAuth } from '../../Auth/AuthContext';
import { useLelang } from "../Admin/components/AdminContext"; // Sesuaikan dengan path yang benar
import DateRangeFilter from '../Admin/components/DateRangeFilter'; // Import DateRangeFilter component
import PriceRangeFilter from '../Admin/components/PriceRangeFilter'; // Import PriceRangeFilter component
import { Calendar, Banknote } from 'lucide-react'; // Import icons from lucide-react

const MainLayoutsMasyarakatMember = () => {
  const { name, isLoggedin } = useAuth();
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [showBidPopup, setShowBidPopup] = useState(false);
  const [bidPrice, setBidPrice] = useState("");
  const { dataLelang, handleGetLelang, handleAddPenawaran, handleGetPenawaran, handleEditPenawaran, penawaran, handleDeletePenawaran } = useLelang();
  const [selectedLelangStatus, setSelectedLelangStatus] = useState("");
  const [selectedLelangId, setSelectedLelangId] = useState(null);
  const [selectedHargaAwal, setSelectedHargaAwal] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editPenawaranId, setEditPenawaranId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date
  const [priceRange, setPriceRange] = useState({ min: "", max: "" }); // State for price range
  const [priceFilterType, setPriceFilterType] = useState("harga_awal"); // State for price filter type
  const [statusFilter, setStatusFilter] = useState("semua"); // State for status filter
  const [showDateRangePopup, setShowDateRangePopup] = useState(false); // State for showing date range popup
  const [showPriceRangePopup, setShowPriceRangePopup] = useState(false); // State for showing price range popup
  const [bidFilter, setBidFilter] = useState("semua"); // State for bid filter

  useEffect(() => {
    handleGetLelang();
    handleGetPenawaran();
  }, []);

  const handleClick = () => {
    const phoneNumber = '+62895422847674'; // Ganti dengan nomor WhatsApp yang dituju
    const message = 'Halo Kak, Saya mau lelang.'; // Ganti dengan pesan default yang diinginkan
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleHistory = (idLelang) => {
    const historyData = penawaran.filter(p => p.id_lelang === idLelang);
    setSelectedHistory(historyData);
    setShowHistoryPopup(true);
  };

  const closeHistoryPopup = () => {
    setShowHistoryPopup(false);
  };

  const handleDeleteBid = async (id_penawaran) => {
    await handleDeletePenawaran(id_penawaran, name);
    handleGetPenawaran(); // Refresh penawaran after deletion
  };

  const handleBid = (id, status, hargaAwal) => {
    setSelectedLelangId(id);
    setSelectedLelangStatus(status);
    setSelectedHargaAwal(hargaAwal);
    setIsEdit(false);
    setShowBidPopup(true);
  };

  const handleEditBid = (id, status, penawaranId, nominal, hargaAwal) => {
    setSelectedLelangId(id);
    setSelectedLelangStatus(status);
    setSelectedHargaAwal(hargaAwal);
    setIsEdit(true);
    setEditPenawaranId(penawaranId);
    setBidPrice(nominal);
    setShowBidPopup(true);
  };

  const closeBidPopup = () => {
    setShowBidPopup(false);
    setBidPrice("");
    setEditPenawaranId(null);
  };

  const submitBid = async () => {
    const highestBid = getHighestBid(selectedLelangId);

    if (parseFloat(bidPrice) <= highestBid.nominal) {
      Swal.fire('Penawaran Gagal', `Penawaran harus lebih tinggi dari penawaran tertinggi saat ini (Rp${highestBid.nominal.toLocaleString()})`, 'error');
      return;
    }

    if (parseFloat(bidPrice) < selectedHargaAwal) {
      Swal.fire('Penawaran Gagal', 'Penawaran harus lebih tinggi dari harga awal', 'error');
      return;
    }

    try {
      if (isEdit) {
        await handleEditPenawaran(selectedLelangId, editPenawaranId, bidPrice, name);
      } else {
        await handleAddPenawaran(selectedLelangId, bidPrice);
      }
      setShowBidPopup(false);
      setBidPrice("");
      Swal.fire('Penawaran Berhasil', `Penawaran Anda sebesar Rp${parseFloat(bidPrice).toLocaleString()} telah berhasil dikirim`, 'success').then(() => {
        window.location.reload(); // Refresh the browser
      });
    } catch (error) {
      console.error("Failed to submit bid:", error);
      Swal.fire('Penawaran Gagal', 'Terjadi kesalahan saat mengirim penawaran', 'error');
    }
  };

  const getHighestBid = (idLelang) => {
    const bids = penawaran.filter(p => p.id_lelang === idLelang);
    if (bids.length === 0) return { nominal: 0 };
    return bids.reduce((prev, current) => (prev.nominal > current.nominal) ? prev : current);
  };

  const hasUserBid = (idLelang) => {
    return penawaran.some(p => p.id_lelang === idLelang && p.username === name);
  };

  const getUserBid = (idLelang) => {
    return penawaran.find(p => p.id_lelang === idLelang && p.username === name);
  };

  // Filter lelang data based on search query, date range, price range, status filter, and bid filter
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

    const matchesBidFilter = bidFilter === "semua" || (bidFilter === "sudah" && hasUserBid(lelang.id_lelang)) || (bidFilter === "belum" && !hasUserBid(lelang.id_lelang));

    return matchesSearchQuery && matchesDateRange && matchesPriceRange && matchesStatusFilter && matchesBidFilter;
  });

  return (
    <>
      <div className="flex fixed w-full bg-white">
        <div className="grid grid-cols-12 w-full gap-1  p-2 items-center max-w-[900px] mx-auto">
          <div className='col-span-8 sm:col-span-10'>
            <SearchBar onSearch={setSearchQuery} /> {/* Implement SearchBar */}
          </div>
          <div className='col-span-4 sm:col-span-2'>
            <HeaderMasyarakat name={name} />
          </div>
        </div>
      </div>

      <section className="pt-16 max-w-[900px] mx-auto ">
        <div className="grid grid-cols-12 mt-2 gap-1 bg-white p-5">
          <select
            className="col-span-12 sm:col-span-4 border-0 text-dark-100 w-full p-2 border-none text-[#4365D1] bg-[#EBF2FC] rounded-lg"
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
          >
            <option value="semua">Buka & Tutup</option>
            <option value="dibuka">Buka</option>
            <option value="ditutup">Tutup</option>
          </select>
          <select
            className="col-span-12 sm:col-span-4 border-0 text-dark-100 w-full p-2 border-none text-[#4365D1] bg-[#EBF2FC] rounded-lg"
            onChange={(e) => setBidFilter(e.target.value)}
            value={bidFilter}
          >
            <option value="semua">Semua Penawaran</option>
            <option value="sudah">Sudah Menawar</option>
            <option value="belum">Belum Menawar</option>
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
          <div className='scrollable-content h-[100vh] pb-[500px] mt-2'>
            <div className="bg-[#6E82B9] text-white p-4 mx-2 flex justify-between items-center mb-2 rounded-lg shadow-md ">
              <div className="flex items-center">
                <div>
                  <h1 className="text-xl font-bold">Hallo, Selamat Datang!</h1>
                  <p>Mau lelang? hubungi kami sekarang</p>
                </div>
              </div>
              <button
                className="bg-[#EBF2FC] text-[#4365D1] p-2 rounded-lg shadow-md"
                onClick={handleClick}
              >
                Hubungi
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
              {filteredLelang.map((lelang) => {
                const userBid = getUserBid(lelang.id_lelang);
                return (
                  <Card
                    key={lelang.id_lelang}
                    isMasyarakatPage={true}
                    onHistory={() => handleHistory(lelang.id_lelang)}
                    onTawar={() => handleBid(lelang.id_lelang, lelang.status, lelang.harga_awal)}
                    onEditBid={() => handleEditBid(lelang.id_lelang, lelang.status, userBid?.id_penawaran, userBid?.nominal, lelang.harga_awal)}
                    isLoggedin={isLoggedin}
                    title={lelang.nama_barang}
                    description={lelang.deskripsi_barang}
                    date={lelang.tanggal}
                    price={lelang.harga_awal}
                    imageUrl={lelang.foto}
                    status={lelang.status}
                    highestBid={getHighestBid(lelang.id_lelang)}
                    hasBid={hasUserBid(lelang.id_lelang)}
                  />
                );
              })}
            </div>
          </div>
        )}
        {showHistoryPopup && (
          <HistoryPenawaran
            historyData={selectedHistory}
            closePopup={closeHistoryPopup}
            isAdmin={false}
            handleDeleteBid={handleDeleteBid}
            currentUser={name}
          />
        )}
        {showBidPopup && (
          <PenawaranHarga
            bidPrice={bidPrice}
            setBidPrice={setBidPrice}
            closeBidPopup={closeBidPopup}
            submitBid={submitBid}
            lelangStatus={selectedLelangStatus}
            isEdit={isEdit}
            hargaAwal={selectedHargaAwal}
            getHighestBid={getHighestBid}
            selectedLelangId={selectedLelangId}
          />
        )}
      </section>
    </>
  );
};

export default MainLayoutsMasyarakatMember;