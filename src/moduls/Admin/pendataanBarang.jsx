import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Card from "./components/Card";
import SearchBar from "./components/Search";
import Header from "./components/Header";
import FormPendataan from "./components/FormPendataan";
import DateRangeFilter from './components/DateRangeFilter'; // Import DateRangeFilter component
import PriceRangeFilter from './components/PriceRangeFilter'; // Import PriceRangeFilter component
import { useLelang } from "../Admin/components/AdminContext"; // Sesuaikan dengan path yang benar
import { useAuth } from "../../Auth/AuthContext";
import { Banknote, Calendar, Plus } from "lucide-react";

function PendataanBarang() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { name } = useAuth();
  const [selectedItem, setSelectedItem] = useState(null); // Tambahkan state untuk item yang dipilih
  const { barang, dataLelang, handleGetBarang, handleGetLelang, handleEditBarang, handleDeleteBarang, handleAddLelang, handleDeleteLelang } = useLelang();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filterColumn, setFilterColumn] = useState("semuanya"); // State for selected filter column
  const [sortOption, setSortOption] = useState(""); // State for sort option
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date
  const [priceRange, setPriceRange] = useState({ min: "", max: "" }); // State for price range
  const [showDateRangePopup, setShowDateRangePopup] = useState(false); // State for showing date range popup
  const [showPriceRangePopup, setShowPriceRangePopup] = useState(false); // State for showing price range popup
  const [lelangFilter, setLelangFilter] = useState("semua"); // State for lelang filter

  useEffect(() => {
    handleGetBarang();
    handleGetLelang();
  }, []);

  const handleDelete = async (id_barang) => {
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
      await handleDeleteBarang(id_barang);
      Swal.fire(
        'Terhapus!',
        'Data telah dihapus.',
        'success'
      );
      handleGetBarang(); // Refresh barang data after deleting
    }
  };

  const handleEdit = (id_barang) => {
    const item = barang.find((b) => b.id_barang === id_barang);
    setSelectedItem(item); // Set item yang dipilih ke state
    setIsModalOpen(true); // Buka modal form
    handleEditBarang(selectedItem);
  };

  const handleLelang = async (id_barang) => {
    const lelangExists = dataLelang.find(lelang => lelang.id_barang === id_barang);
    if (lelangExists) {
      Swal.fire("Sudah Ada", "Barang ini sudah berada di lelang", "info");
      return;
    }

    const result = await Swal.fire({
      title: 'Apakah kamu yakin?',
      text: "Barang ini akan dilelang!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, lelang!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      const lelangData = {
        id_barang: id_barang,
        status: "dibuka"
      };
      await handleAddLelang(lelangData);
      Swal.fire(
        'Dilelang!',
        'Barang telah dilelang.',
        'success'
      );
      handleGetLelang(); // Refresh lelang data after adding
    }
  };

  const handleBatalLelang = async (id_barang) => {
    const lelang = dataLelang.find(lelang => lelang.id_barang === id_barang);
    if (!lelang) return;

    const result = await Swal.fire({
      title: 'Apakah kamu yakin?',
      text: "Lelang ini akan dibatalkan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, batal!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      await handleDeleteLelang(lelang.id_lelang);
      Swal.fire(
        'Dibatalkan!',
        'Lelang telah dibatalkan.',
        'success'
      );
      handleGetLelang(); // Refresh lelang data after deleting
    }
  };

  const handleModalOpen = () => {
    setSelectedItem(null); // Reset selected item saat menambah barang baru
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Filter barang data based on search query, filter column, date range, price range, and lelang filter
  const filteredBarang = barang.filter(item => {
    const matchesSearchQuery = filterColumn === "semuanya"
      ? Object.values(item).some(value => value.toString().toLowerCase().includes(searchQuery.toLowerCase()))
      : item[filterColumn]?.toString().toLowerCase().includes(searchQuery.toLowerCase());

    const itemDate = new Date(item.tanggal);
    const matchesDateRange = (!startDate || itemDate >= new Date(startDate)) && (!endDate || itemDate <= new Date(endDate));

    const matchesPriceRange = (!priceRange.min || item.harga_awal >= Number(priceRange.min)) &&
      (!priceRange.max || item.harga_awal <= Number(priceRange.max));

    const lelangExists = dataLelang.find(lelang => lelang.id_barang === item.id_barang);
    const matchesLelangFilter = lelangFilter === "semua" || (lelangFilter === "belum" && lelangExists) || (lelangFilter === "sudah" && !lelangExists);

    return matchesSearchQuery && matchesDateRange && matchesPriceRange && matchesLelangFilter;
  });

  // Sort barang data based on sort option
  const sortedBarang = filteredBarang.sort((a, b) => {
    switch (sortOption) {
      case "harga_awal_tertinggi":
        return b.harga_awal - a.harga_awal;
      case "harga_awal_terendah":
        return a.harga_awal - b.harga_awal;
      default:
        return 0;
    }
  });

  return (
    <>
      <section className="">
        <div className="">

      
        <Header title="Barang" name={name} />
        <div className="grid grid-cols-12 gap-2 w-full bg-white p-5 my-2 shadow-sm rounded-sm ">
        <div className="order-2 md:order-1 col-span-4 sm:col-span-3 md:col-span-2 lg:col-span-2 flex justify-start items-start xl:col-span-2">
          
            <button onClick={handleModalOpen} className="bg-blue-main w-full text-amber-50 py-2 px-2 rounded-lg">
            <Plus className="inline h-5 w-5"/> Tambah
            </button>
          </div>
          <div className="order-1 md:order-2 col-span-8 sm:col-span-9 md:col-span-7 lg:col-span-5 xl:col-span-4">
            <SearchBar onSearch={setSearchQuery} /> {/* Implement SearchBar */}
          </div>
          
          <div className="order-5  col-span-6 md:col-span-3 lg:col-span-2">
            <select
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-2 border-none text-[#4365D1] bg-[#EBF2FC] rounded-lg"
              value={sortOption}
            >
              <option className="bg-white text-gray-600" value="">Urutkan Harga</option>
              <option className="bg-white text-gray-600" value="harga_awal_tertinggi">Harga Tertinggi</option>
              <option className="bg-white text-gray-600" value="harga_awal_terendah">Harga Terendah</option>
            </select>
          </div>
          <div className="order-6 col-span-6 md:col-span-3 lg:col-span-2 ">
            <select
              onChange={(e) => setLelangFilter(e.target.value)}
              className="w-full p-2 border-none text-[#4365D1] bg-[#EBF2FC] rounded-lg"
              value={lelangFilter}
            >
              <option className="bg-white text-gray-600" value="semua">Semua Barang</option>
              <option className="bg-white text-gray-600" value="sudah">Belum Dilelang</option>
              <option className="bg-white text-gray-600" value="belum">Sudah Dilelang</option>
            </select>
          </div>
             
          <div className="order-7 col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-3 xl:col-span-2 flex justify-start items-start gap-2">
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
            closePopup={() => setShowPriceRangePopup(false)}
          />
        )}


        <section className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-2 h-[100vh] pb-[350px] scrollable-content pt-2">
        {Array.isArray(sortedBarang) && sortedBarang.map((item) => {
          const lelangExists = dataLelang.find(lelang => lelang.id_barang === item.id_barang);
          return (
            <Card
              key={item.id_barang}
              onDelete={() => handleDelete(item.id_barang)}
              onEdit={() => handleEdit(item.id_barang)}
              onLelang={() => handleLelang(item.id_barang)}
              onBatal={() => handleBatalLelang(item.id_barang)}
              showMainButtons={true} // Menampilkan tombol edit, hapus, tambah
              title={item.nama_barang}
              description={item.deskripsi_barang}
              price={item.harga_awal}
              date={item.tanggal}
              imageUrl={item.foto} // Tambahkan URL gambar jika tersedia
              status={item.status} // Tambahkan status barang
              hideStatus={true} // Jangan tampilkan status di halaman pendataan
              hideHighBid={true} // Jangan tampilkan teks "Belum ada penawaran"
              isLelang={!!lelangExists} // Tambahkan prop isLelang untuk menandai apakah barang sudah dilelang
            />
          );
        })}
      </section>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-md mx-auto relative">
            <button onClick={handleModalClose} className="absolute top-2 right-2 text-gray-600 text-4xl">
              &times;
            </button>
            <FormPendataan handleClose={handleModalClose} selectedItem={selectedItem} />
          </div>
        </div>
      )}
    </>
  );
}

export default PendataanBarang;