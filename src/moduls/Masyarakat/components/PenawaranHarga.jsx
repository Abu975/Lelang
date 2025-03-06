import Swal from 'sweetalert2';

const PenawaranHarga = ({ bidPrice, setBidPrice, closeBidPopup, submitBid, lelangStatus, isEdit, hargaAwal, getHighestBid, selectedLelangId }) => {
  const handleBidChange = (e) => {
    setBidPrice(e.target.value);
  };

  const handleSubmit = async () => {
    const highestBid = getHighestBid(selectedLelangId);

    if (parseFloat(bidPrice) <= highestBid.nominal) {
      Swal.fire('Penawaran Gagal', `Penawaran harus lebih tinggi dari penawaran tertinggi saat ini Rp${highestBid.nominal.toLocaleString()}`, 'error');
      return;
    }

    if (parseFloat(bidPrice) < hargaAwal) {
      Swal.fire('Penawaran Gagal', 'Penawaran harus lebih tinggi dari harga awal', 'error');
      return;
    }

    try {
      await submitBid();
      setBidPrice("");
      Swal.fire('Penawaran Berhasil', `Penawaran Anda sebesar Rp${parseFloat(bidPrice).toLocaleString()} telah berhasil dikirim`, 'success').then(() => {
        window.location.reload(); // Refresh the browser
      });
    } catch (error) {
      Swal.fire('Penawaran Gagal', 'Terjadi kesalahan saat mengirim penawaran', error);
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-white border border-gray-200 z-50 rounded-lg w-80 shadow-lg">
      <button
        onClick={closeBidPopup}
        className="absolute top-2 right-2 text-xl font-bold cursor-pointer"
      >
        &times;
      </button>
      <h3 className="text-center mb-4 font-semibold text-lg">{isEdit ? 'Edit Penawaran' : 'Tawar Harga'}</h3>
      {lelangStatus === "ditutup" ? (
        <p className="text-center text-red-500">Maaf, sesi lelang sudah berakhir.</p>
      ) : (
        <>
          <input
            type="text"
            value={bidPrice}
            onChange={handleBidChange}
            className="w-full px-4 py-2 border rounded-lg mb-4"
            placeholder="Masukkan harga tawaran"
          />
          <div className="flex justify-end">
            <button
              onClick={closeBidPopup}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-main text-white px-4 py-2 rounded-lg"
            >
              {isEdit ? 'Update' : 'Submit'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PenawaranHarga;