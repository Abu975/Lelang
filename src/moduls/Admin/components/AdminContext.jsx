import { createContext, useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getBarang, addBarang, editBarang, deleteBarang, getLelang, addLelang, deleteLelang, updateLelangStatus, getUser, addPenawaran, getPenawaran, deletePenawaran, editPenawaran, getHighestBid } from "../../../config/api"; // Sesuaikan dengan path untuk getBarang, addBarang, editBarang, deleteBarang, dan getLelang
import { useCookies } from "react-cookie";
import { useAuth } from "../../../Auth/AuthContext";

const initialLelang = {
  barang: [],
  dataLelang: [],
  penawaran: [],
  handleGetUser: () => { },
  handleGetBarang: () => { },
  handleAddBarang: () => { },
  handleEditBarang: () => { },
  handleDeleteBarang: () => { },
  handleGetLelang: () => { },
  handleAddLelang: () => { },
  handleDeleteLelang: () => { },
  handleUpdateLelangStatus: () => { },
  handleAddPenawaran: () => {},
  handleGetPenawaran: () => {},
  handleDeletePenawaran: () => {},
  handleEditPenawaran: () => {},
  handleGetHighestBid: () => {},
};

const LelangContext = createContext(initialLelang);

const useLelang = () => {
  return useContext(LelangContext);
};

const LelangProvider = ({ children }) => {
  const { token } = useAuth();
  const [barang, setBarang] = useState([]);
  const [penawaran, setPenawaran] = useState([]);
  const [dataLelang, setDataLelang] = useState([]);
  const [isAddingLelang, setIsAddingLelang] = useState(false);
  const [users, setUsers] = useState([]);
  const [handleFetch, setHandleFetch] = useState(false);

  console.log("Data Lelang:", dataLelang);

  const handleGetHighestBid = async (id_penawaran) => {
    try {
      const response = await getHighestBid(id_penawaran, token);
      const { data } = response.data;
      return data;
    } catch (error) {
      console.error("Failed to fetch highest bid:", error);
      return null;
    }
  };

  const handleGetPenawaran = async () => {
    try {
      const response = await getPenawaran(token);
      const { data } = response.data;
      setPenawaran(data.dataPenawaran);
    } catch (error) {
      console.error("Failed to fetch penawaran:", error);
      setPenawaran([]);
    }
  };

  const handleAddPenawaran = async (id, nominal) => {
    try {
      const existingPenawaran = penawaran.find(p => p.id_lelang === id && p.username === name);
      if (existingPenawaran) {
        Swal.fire("Gagal", "Anda sudah memiliki penawaran pada lelang ini. Anda hanya bisa mengedit penawaran Anda.", "error");
        return;
      }

      const response = await addPenawaran(id, token, nominal);
      if (response.status === 201) {
        handleGetPenawaran();
        setHandleFetch(true);
      }
    } catch (error) {
      console.error("Failed to add Penawaran:", error);
    }
  };

  const handleDeletePenawaran = async (id_penawaran, username) => {
    try {
      const penawaranItem = penawaran.find(p => p.id_penawaran === id_penawaran);
      if (penawaranItem && penawaranItem.username === username) {
        const response = await deletePenawaran(id_penawaran, token);
        if (response.status === 200) {
          handleGetPenawaran();
          Swal.fire("Berhasil", "Penawaran berhasil dihapus", "success");
        } else {
          Swal.fire("Gagal", "Gagal menghapus penawaran", "error");
        }
      } else {
        Swal.fire("Gagal", "Anda tidak memiliki izin untuk menghapus penawaran ini", "error");
      }
    } catch (error) {
      console.error("Failed to delete penawaran:", error);
      Swal.fire("Gagal", "Gagal menghapus penawaran", "error");
    }
  };

  const handleEditPenawaran = async (id_lelang, id_penawaran, nominal, username) => {
    try {
      const penawaranItem = penawaran.find(p => p.id_penawaran === id_penawaran);
      if (penawaranItem && penawaranItem.username === username) {
        const response = await editPenawaran(id_lelang, id_penawaran, token, nominal);
        if (response.status === 200) {
          handleGetPenawaran();
          Swal.fire("Berhasil", "Penawaran berhasil diedit", "success");
        } else {
          Swal.fire("Gagal", "Gagal mengedit penawaran", "error");
        }
      } else {
        Swal.fire("Gagal", "Anda tidak memiliki izin untuk mengedit penawaran ini", "error");
      }
    } catch (error) {
      console.error("Failed to edit penawaran:", error);
      Swal.fire("Gagal", "Gagal mengedit penawaran", "error");
    }
  };

  const handleGetUser = async () => {
    try {
      const response = await getUser(token);
      const users = response.data.data.dataUser;
      setUsers(users);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUsers([]);
    }
  };

  const handleGetBarang = async () => {
    try {
      const response = await getBarang(token);
      const { data } = response.data;
      setBarang(data.barang);
    } catch (error) {
      console.error("Failed to fetch barang:", error);
      setBarang([]);
    }
  };

  const handleAddBarang = async (barang) => {
    try {
      const response = await addBarang(barang, token);
      if (response.status === 201) {
        handleGetBarang();
        setHandleFetch(true);
      }
    } catch (error) {
      console.error("Failed to add barang:", error);
    }
  };

  const handleEditBarang = async (id_barang, barang) => {
    try {
      const response = await editBarang(id_barang, barang, token);
      if (response.status === 201) {
        handleGetBarang();
        setHandleFetch(true);
      }
    } catch (error) {
      console.error("Failed to edit barang:", error);
    }
  };

  const handleDeleteBarang = async (id_barang) => {
    try {
      const response = await deleteBarang(id_barang, token);
      if (response.status === 201) {
        handleGetBarang();
      }
    } catch (error) {
      console.error("Failed to delete barang:", error);
    }
  };

  const handleGetLelang = async () => {
    try {
      const responseLelang = await getLelang(token);
      const responseBarang = await getBarang(token);
      const lelangData = responseLelang.data.data.dataLelang;
      const barangData = responseBarang.data.data.barang;

      const combinedData = lelangData.map(lelang => {
        const barang = barangData.find(b => b.id_barang === lelang.id_barang);
        return { ...lelang, ...barang };
      });

      setDataLelang(combinedData);
    } catch (error) {
      console.error("Failed to fetch lelang data:", error);
      setDataLelang([]);
    }
  };

  const handleAddLelang = async (lelang) => {
    if (isAddingLelang) return;
    setIsAddingLelang(true);
    try {
      const response = await addLelang(lelang, token);
      if (response.status === 200 || response.status === 201) {
        await handleGetLelang();
        Swal.fire("Berhasil", "Barang berhasil ditambahkan ke lelang", "success");
      } else {
        Swal.fire("Gagal", "Gagal menambahkan barang ke lelang", "error");
      }
    } catch (error) {
      console.error("Failed to add lelang:", error);
      Swal.fire("Gagal", "Gagal menambahkan barang ke lelang", "error");
    } finally {
      setIsAddingLelang(false);
    }
  };

  const handleDeleteLelang = async (id_lelang) => {
    try {
      const response = await deleteLelang(id_lelang, token);
      if (response.status === 200) {
        await handleGetLelang();
        Swal.fire("Berhasil", "Lelang berhasil dihapus", "success");
        setHandleFetch(true);
      } else {
        Swal.fire("Gagal", "Gagal menghapus lelang", "error");
      }
    } catch (error) {
      console.error("Failed to delete lelang:", error);
      Swal.fire("Gagal", "Gagal menghapus lelang", "error");
    }
  };

  const handleUpdateLelangStatus = async (data) => {
    try {
      const response = await updateLelangStatus(data, token);
      if (response.status === 200 || response.status === 201) {
        await handleGetLelang();
        setHandleFetch(true);
        Swal.fire("Berhasil", "Status lelang berhasil diperbarui", "success");
      } else {
        Swal.fire("Gagal", "Gagal memperbarui status lelang", "error");
      }
    } catch (error) {
      console.error("Failed to update lelang status:", error);
      Swal.fire("Gagal", "Gagal memperbarui status lelang", "error");
    }
  };

  useEffect(() => {
    if (handleFetch) {
      handleGetBarang();
      handleGetLelang();
      handleGetUser();
      handleGetPenawaran();
      setTimeout(() => {
        setHandleFetch(false);
      }, 300);
    }
  }, [handleFetch, barang]);

  return (
    <LelangContext.Provider value={{ barang, dataLelang, users, penawaran, handleGetHighestBid, handleEditPenawaran, handleDeletePenawaran, handleAddPenawaran, handleGetPenawaran, handleGetBarang, handleAddBarang, handleEditBarang, handleDeleteBarang, handleGetLelang, handleAddLelang, handleDeleteLelang, handleUpdateLelangStatus }}>
      {children}
    </LelangContext.Provider>
  );
};

export { LelangProvider, useLelang };
export default LelangProvider;