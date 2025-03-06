import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Header from "./components/Header";
import TableGenerate from "./components/TableGenerate";
import StrukModalGenerate from "./components/StrukModalGenerate";
import SearchBar from "./components/Search";
import DateRangeFilter from "./components/DateRangeFilter"; // Import DateRangeFilter component
import PriceRangeFilter from "./components/PriceRangeFilter"; // Import PriceRangeFilter component
import Swal from "sweetalert2";
import { getHistory, deleteHistory } from "../../config/api"; // Import getHistory and deleteHistory functions
import { useAuth } from "../../Auth/AuthContext"; // Import useAuth
import { Banknote, Calendar } from "lucide-react";

function GenerateLaporan() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const printRef = useRef();
  const [showButton, setShowButton] = useState(true);
  const [reportData, setReportData] = useState([]);
  const { token, name } = useAuth(); // Get the token from useAuth
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filterColumn, setFilterColumn] = useState("semuanya"); // State for selected filter column
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date
  const [priceRange, setPriceRange] = useState({ min: "", max: "" }); // State for price range
  const [priceFilterType, setPriceFilterType] = useState("harga_awal"); // State for price filter type
  const [showDateRangePopup, setShowDateRangePopup] = useState(false); // State for showing date range popup
  const [showPriceRangePopup, setShowPriceRangePopup] = useState(false); // State for showing price range popup

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory(token); // Pass the token to getHistory
        if (response.status === 201 && response.data.status === "success") {
          const { data } = response.data;
          setReportData(data.history);
        } else {
          throw new Error("Failed to fetch history data");
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mendapatkan data history.",
        });
      }
    };

    fetchHistory();
  }, [token]); // Add token as a dependency

  const handleCetakClick = (row) => {
    setSelectedRow(row);
    if (row.nominal && row.nominal > 0) {
      setIsModalOpen(true);
    } else {
      Swal.fire({
        icon: "info",
        title: "Belum ada penawaran",
        text: "Belum ada penawaran pada lelang ini.",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    }
  };

  const handleDeleteReport = async (index, id_history) => {
    try {
      const response = await deleteHistory(id_history, token); // Call deleteHistory API
      if (response.status === 200) {
        const updatedReportData = [...reportData];
        updatedReportData.splice(index, 1);
        setReportData(updatedReportData);
        Swal.fire("Dihapus!", "Data telah dihapus.", "success");
      } else {
        throw new Error("Failed to delete history");
      }
    } catch (error) {
      console.error("Failed to delete history:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal menghapus data history.",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const generatePDF = async () => {
    setShowButton(false);
    await new Promise((resolve) => setTimeout(resolve, 100));

    const canvas = await html2canvas(printRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("struk_pembayaran.pdf");

    setShowButton(true);
    setIsModalOpen(false);
  };

  // Filter report data based on search query, filter column, date range, and price range
  const filteredReportData = reportData.filter((row) => {
    const matchesSearchQuery = filterColumn === "semuanya"
      ? Object.values(row).some(value => value.toString().toLowerCase().includes(searchQuery.toLowerCase()))
      : row[filterColumn]?.toString().toLowerCase().includes(searchQuery.toLowerCase());

    const rowDate = new Date(row.tanggal);
    const matchesDateRange = (!startDate || rowDate >= new Date(startDate)) && (!endDate || rowDate <= new Date(endDate));

    const matchesPriceRange = (!priceRange.min || row[priceFilterType] >= Number(priceRange.min)) &&
      (!priceRange.max || row[priceFilterType] <= Number(priceRange.max));

    return matchesSearchQuery && matchesDateRange && matchesPriceRange;
  });

  return (
    <>
    <section className="">
        <div className="">
        
        <Header title="Laporan" name={name} />
        <div className="grid gap-2 w-full bg-white p-5 my-2 shadow-sm rounded-sm ">
        <div className="grid grid-cols-12 gap-2 w-full pt-2">
          <div className="order-1 md:order-2 col-span-12 sm:col-span-7 md:col-span-6 lg:col-span-5 xl:col-span-5">
            <SearchBar onSearch={setSearchQuery} /> {/* Implement SearchBar */}
          </div>
          
          <div className="order-3 col-span-12 sm:col-span-3 md:col-span-2 lg:col-span-2">
          <select
            onChange={(e) => setFilterColumn(e.target.value)}
            className="w-full p-2 border-none text-[#4365D1] bg-[#EBF2FC]"
            value={filterColumn}
          >
            <option className="bg-white text-gray-600" value="semuanya">Semuanya</option>
            <option  className="bg-white text-gray-600" value="nama_lengkap">Username</option>
          
            <option className="bg-white text-gray-600" value="nama_barang">Nama Barang</option>
            <option className="bg-white text-gray-600" value="harga_awal">Harga Awal</option>
            <option className="bg-white text-gray-600" value="nominal">Nominal</option>
            <option className="bg-white text-gray-600" value="telp">Telepon</option>
          </select>
          </div>
             
          <div className="order-4 col-span-12 sm:col-span-6 md:col-span-4 2xl:col-span-3 flex justify-start items-start gap-2">
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

<div className="scrollable-content pt-2">
  
  <div className="">
    
  <TableGenerate
        handleCetakClick={handleCetakClick}
        reportData={filteredReportData}
        handleDeleteReport={handleDeleteReport}
      />
  </div>

</div>
      

     
      </section> 

      <StrukModalGenerate
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        generatePDF={generatePDF}
        selectedRow={selectedRow}
        showButton={showButton}
        printRef={printRef}
      />
    </>
  );
}

export default GenerateLaporan;