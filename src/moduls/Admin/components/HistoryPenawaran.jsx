import Swal from 'sweetalert2';
import { useLelang } from "../components/AdminContext"; // Sesuaikan dengan path yang benar

const HistoryPenawaran = ({ historyData = [], closePopup, addHighestBidToReport, isAdmin, handleDeleteBid, currentUser }) => {
  const { handlePostHistory } = useLelang();

  const handleSelectHighestBid = async () => {
    if (historyData.length > 0) {
      const highestBid = historyData.reduce((prev, current) => (prev.nominal > current.nominal) ? prev : current);
      
      try {
        // Post the highest bid to /history
        await handlePostHistory(highestBid.id_penawaran);
        
        // Add highest bid to report
        addHighestBidToReport(highestBid.id_penawaran);
        Swal.fire(
          'Berhasil!',
          'Penawaran tertinggi telah dipilih.',
          'success'
        );
      } catch (error) {
        console.error("Error saat memilih penawaran tertinggi:", error);
        Swal.fire(
          'Gagal!',
          'Terjadi kesalahan saat memilih penawaran tertinggi.',
          'error'
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 max-w-md w-full mx-auto">
        <button onClick={closePopup} className="absolute top-2 right-2 text-gray-600 text-4xl">
          &times;
        </button>
        <h2 className="text-center text-2xl font-bold mb-4">History Penawaran</h2>
        <div className="space-y-4">
          {historyData.length === 0 ? (
            <p className="text-center">Belum ada penawaran.</p>
          ) : (
            historyData.map((penawaran, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm">
                <div>
                  <p className="text-lg font-semibold">{penawaran.nama_lengkap}</p>
                  <p className="text-sm text-gray-600">Rp{penawaran.nominal.toLocaleString()}</p>
                </div>
                {!isAdmin && penawaran.username === currentUser && (
                  <button
                    onClick={() => handleDeleteBid(penawaran.id_penawaran)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
                )}
              </div>
            ))
          )}
        </div>
        {isAdmin && historyData.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleSelectHighestBid}
              className="bg-blue-main text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Pilih Penawaran Tertinggi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPenawaran;