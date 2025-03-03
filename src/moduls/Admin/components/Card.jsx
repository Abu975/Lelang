/* eslint-disable react/jsx-no-undef */
import { useState } from "react";
import { Trash2, Pencil, History, Banknote, Gavel, XCircle } from "lucide-react"; // Tambahkan ikon History
import DropdownStatusLelang from "./DropdownStatusLelang.jsx";
import { https } from "../../../config/url.js";


const Card = ({
  onDelete,
  onEdit,
  onLelang,
  onBatal,
  onUpdateStatus,
  onHistory,
  handleLoginDulu,
  showMainButtons,
  isMasyarakatPage,
  title,
  description,
  price,
  date,
  imageUrl,
  isLoggedin,
  onTawar,
  onEditBid,
  status,
  highestBid,
  hideHighBid,
  hideStatus,
  hasBid,
  isLelang,
}) => {
  const handleStatusChange = (status) => {
    onUpdateStatus(status);
  };

  // State for controlling 'see more' text
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-[#EAF0FC] border-2 border-transparent hover:border-[#4365D1] flex flex-col rounded-lg overflow-visible w-full max-w-sm mx-auto duration-300 group">
      {/* Container Gambar */}
      <div className="relative rounded-t-lg overflow-hidden group">
        <div className="p-4 pb-1 bg-white">
          <div className="overflow-hidden rounded-md ">
            <img
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              src={`${https}/file/${imageUrl}`}
              alt={title}
            />
          </div>
        </div>
        <h3 className="absolute bottom-0 left-4 bg-white px-2 pl-0 py-1 text-xl font-bold text-gray-900">
          Rp{price ? price.toLocaleString() : "Harga tidak tersedia"}
        </h3>
        
      </div>

      {/* Content Section */}
      <div className="p-4 pt-0 bg-white min-h-[238px] group flex flex-col justify-between relative">
      {!hideStatus && (
          <span
            className={`absolute top-1  right-[15px] px-3 py-1 text-sm font-semibold rounded-full  ${
              status === "dibuka" ? "text-[#00A74F] bg-[#E4F8EC]" : "text-[#FD0005] bg-[#FFE3E3]"
            }`}
          >
            {status === "dibuka" ? "Dibuka" : "Ditutup"}
          </span>
        )}
        {isLelang && (
          <span
            className="absolute top-1 right-[15px] px-3 py-1 text-sm font-semibold rounded-full text-[#00A74F] bg-[#E4F8EC]"
          >
            Dilelang
          </span>
        )}
        <div>
        <h3 className="text-lg font-semibold text-[#718ADE]">{title}</h3>
        <p className="text-sm text-gray-500">
          {date ? new Date(date).toLocaleString() : "Tanggal tidak tersedia"}
        </p>
        {/* Description with Expandable Logic */}
        <p className="text-gray-700 text-sm break-words">
          {isExpanded ? description : description.length > 80 ? `${description.slice(0, 80)}...` : description}
          {description.length > 80 && (
            <button
              onClick={toggleDescription}
              className="text-[#718ADE] ml-1 focus:outline-none"
            >
              {isExpanded ? "Lihat Lebih Sedikit" : "Lihat Selengkapnya"}
            </button>
          )}
        </p>
        </div>
        
        {/* High Bid Section */}
        <div>

        
        {highestBid ? (
          <div className="bg-gray-100 p-2 rounded-sm">
          <p className="text-sm text-gray-600">
            Penawaran Tertinggi: <br></br>
            {highestBid.username}
            {" "}
            <span className="font-semibold">
              Rp{highestBid.nominal.toLocaleString()}
            </span>{" "}
            
          </p>
          </div>
        ) : !hideHighBid && (
          <div className="bg-gray-100 p-2 rounded-sm">
          <p className="text-sm italic text-gray-500">Belum ada penawaran</p>
          </div>
        )}
       

        {/* Button Section */}
        <div className="mt-4 flex flex-wrap justify-between items-center lg:flex-nowrap">
          {showMainButtons ? (
            <div className="flex flex-wrap gap-2 w-full lg:flex-nowrap">
              {isLelang ? (
                <button
                  onClick={onBatal}
                  className="flex-1 px-1 py-1 pl-0 text-xs text-[#FF6363] hover:text-white font-medium border-2 border-[#FD9292]   bg-[#FFE3E3] rounded-lg hover:bg-[#FF6363] hover:border-[#FF6363] focus:ring-none focus:outline-none focus:ring-none transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <XCircle className="w-4 h-4 inline"/> <br/> Batal Lelang </button>
              ) : (
                <button
                  onClick={onLelang}
                  className="flex-1 px-1 py-1 pl-0 text-xs font-medium text-[#718ADE] hover:text-[#f4f4f4] border-2 border-[#718ADE]   bg-[#EAF0FC] rounded-lg hover:bg-[#718ADE] hover:border-[#718ADE] focus:ring-none focus:outline-none focus:ring-none transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <Gavel className="w-4 h-4 inline" /> <br></br> Lelang
                </button>
              )}
              <button
                onClick={onEdit}
                className="flex-1 px-1 pl-0 py-1 text-xs font-medium text-[#718ADE] hover:text-[#f4f4f4] border-2 border-[#718ADE]  bg-[#EAF0FC] rounded-lg hover:bg-[#718ADE] hover:border-[#718ADE] focus:ring-none focus:outline-none focus:ring-none transition duration-300 ease-in-out transform hover:scale-105"
              >
                <Pencil className="w-4 h-4 inline" /> <br></br> Edit
              </button>
              <button
                onClick={onDelete}
                className="flex-1 px-1 pl-0 py-1 text-xs font-medium text-[#718ADE] hover:text-[#f4f4f4] border-2 border-[#718ADE]  bg-[#EAF0FC] rounded-lg hover:bg-[#718ADE] hover:border-[#718ADE] focus:ring-none focus:outline-none focus:ring-none transition duration-300 ease-in-out transform hover:scale-105"
              >
                <Trash2 className="w-4 h-4 inline" /> <br></br> Hapus
              </button>
            </div>
          ) : isMasyarakatPage ? (
            <div className="flex flex-wrap gap-2 w-full lg:flex-nowrap">
              <button
                onClick={
                  isLoggedin
                    ? hasBid
                      ? onEditBid
                      : onTawar
                    : handleLoginDulu
                }
                className={`flex-1 px-2  pl-1 py-2 text-xs font-medium rounded-lg focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 ${
                  hasBid
                    ? "text-[#FF6363] hover:text-[#f4f4f4] border-2 border-[#FD9292]   bg-[#FFE3E3] rounded-lg hover:bg-[#FF6363] hover:border-[#FF6363] focus:ring-none"
                    : "text-[#718ADE] hover:text-[#f4f4f4] border-2 border-[#718ADE]   bg-[#EAF0FC] rounded-lg hover:bg-[#718ADE] hover:border-[#718ADE] focus:ring-none"
                }`}
              >
                {hasBid ? <><Pencil className="w-3 h-3 inline"/> Ubah Penawaran</> :  <><Banknote className="w-5 h-5 inline"/>  Tawar Harga</>}
              </button>
              <button
                onClick={onHistory}
                className="flex-1 px-1 pl-0 py-1 text-xs font-medium text-[#718ADE] hover:text-[#f4f4f4] border-2 border-[#718ADE]   bg-[#EAF0FC] rounded-lg hover:bg-[#718ADE] hover:border-[#718ADE] focus:ring-none focus:outline-none focus:ring-none transition duration-300 ease-in-out transform hover:scale-105"
              ><History className="w-4 h-4 inline" />  Histori
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 w-full lg:flex-nowrap">
              <DropdownStatusLelang
                onStatusChange={handleStatusChange}
                currentStatus={status}
              />
              <button
                onClick={onBatal}
                className="flex-1 px-1 pl-0 py-1 text-xs font-medium text-[#718ADE] hover:text-[#f4f4f4] border-2 border-[#718ADE]   bg-[#EAF0FC] rounded-lg hover:bg-[#718ADE] hover:border-[#718ADE] focus:ring-none focus:outline-none focus:ring-none transition duration-300 ease-in-out transform hover:scale-105"
              >
                <Trash2 className="w-4 h-4 inline" /> <br></br> Hapus
              </button>
              <button
                onClick={onHistory}
                className="flex-1 px-1 pl-0 py-1 text-xs font-medium text-[#718ADE] hover:text-[#f4f4f4] border-2 border-[#718ADE]   bg-[#EAF0FC] rounded-lg hover:bg-[#718ADE] hover:border-[#718ADE] focus:ring-none focus:outline-none focus:ring-none transition duration-300 ease-in-out transform hover:scale-105"
              ><History className="w-4 h-4 inline" /> <br></br> Histori
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Card;