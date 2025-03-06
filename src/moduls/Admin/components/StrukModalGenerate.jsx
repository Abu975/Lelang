const StrukModalGenerate = ({ isModalOpen, handleCloseModal, generatePDF, selectedRow, showButton, printRef }) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 max-w-md mx-auto">
        <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-600 text-4xl">
          &times;
        </button>
        <div ref={printRef} className="max-w-md mx-auto p-6 border border-gray-200 rounded-md">
          <div className="flex justify-center">
          <img className="w-10 h-10" src="/LogoStruk.png" alt="" />
          <h2 className="text-center text-2xl font-bold mb-4">Struk Pembayaran</h2>
          </div>
          
          <div className="border-t border-dotted border-black w-full my-4"></div>

          <div className="mb-4">
            <p><strong>Nama:</strong> {selectedRow.nama_lengkap}</p>
            <p><strong>Nomor Telepon:</strong> {selectedRow.telp}</p>
            <p><strong>Tanggal:</strong> {new Date(selectedRow.tanggal).toLocaleDateString()}</p>

            <div className="border-t border-dotted border-black w-full my-4"></div>
          <div></div>
            <p><strong>Nama Barang:</strong> {selectedRow.nama_barang}</p>
            <p><strong>Harga Awal:</strong> Rp{selectedRow.harga_awal.toLocaleString()}</p>
            <p><strong>Penawaran:</strong> Rp{selectedRow.nominal.toLocaleString()}</p>

            
          </div>
          <div className="border-t border-dotted border-black w-full my-4"></div>
          <div>
            <p className="font-bold">Total yang harus dibayar :</p>
            <p><strong></strong> Rp{selectedRow.nominal.toLocaleString()}</p>
          </div>
          <div className="border-t border-dotted border-black w-full my-4"></div>
          <div className="mb-4">
            <p className="text-center">Terima kasih telah berpartisipasi dalam pelelangan ini.</p>
          </div>
          {showButton && (
            <div className="flex items-center justify-between mt-6">
              <button
                className="bg-blue-main hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={generatePDF}
              >
                Generate PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrukModalGenerate;