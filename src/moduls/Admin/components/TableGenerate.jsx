import { Trash } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

const TableGenerate = ({ handleCetakClick, reportData, handleDeleteReport }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(reportData.length / rowsPerPage);

  const confirmDelete = (index, id_history) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda tidak akan bisa mengembalikan data ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteReport(index, id_history);
      }
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedRows = reportData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <section className='w-full grid grid-cols-1'>
      <div className="container pl-0" style={{ overflowX: 'auto' }}>
        <table className="w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">Username</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">Tanggal</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-center">Status</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">Nama Barang</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">Harga Awal</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">Nominal</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">Telepon</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-right">Aksi</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {selectedRows.map((row, index) => (
              row && (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-200">{row.nama_lengkap}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{new Date(row.tanggal).toLocaleDateString()}</td>
                  <td className={`py-2 px-4 border-b border-gray-200`}>
                    <div className={`py-0 px-2 text-center rounded-2xl ${row.status === 'dibuka' ? 'text-[#00A74F] bg-[#E4F8EC]' : 'text-[#FD0005] bg-[#FFE3E3]'}`}>
                      {row.status}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">{row.nama_barang}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{row.harga_awal.toLocaleString()}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{row.nominal.toLocaleString()}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{row.telp}</td>
                  <td className="py-2 px-4 border-b border-gray-200 pr-0 m-0">
                    <button
                      className="bg-[#FF4E4E] hover:bg-[#FF6363] text-white py-1 px-2 rounded ml-2"
                      onClick={() => confirmDelete(index, row.id_history)}
                    >
                      <Trash className='w-5 h-5 text-white inline' />
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 pr-0 ml-0">
                    <button
                      className="bg-blue-main text-white py-1 px-2 rounded"
                      onClick={() => handleCetakClick(row)}
                    >
                      Cetak
                    </button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination mt-1 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
          <button
            key={pageNumber}
            className={`py-1 px-3 mx-1 ${currentPage === pageNumber ? 'bg-[#718ADE] text-white' : 'bg-gray-200'}`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </section>
  );
};

export default TableGenerate;