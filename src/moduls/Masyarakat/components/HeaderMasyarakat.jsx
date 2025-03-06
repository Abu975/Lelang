import Logout from "../../Admin/components/Logout";

const HeaderMasyarakat = ({name}) => {
  const handleLogout = () => {
    // Fungsi ini akan memanggil komponen Logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
      logoutButton.click();
    }
  }
  return (
    <div className="order-2 col-span-5 sm:col-span-3 lg:order-2 flex justify-end items-center w-full">
    <div
      className="flex text-center justify-end items-center p-2 py-1 rounded-lg  hover:bg-gray-200 cursor-pointer w-full pr-0"
      onClick={handleLogout}
    >
      <p className="text-xl text-gray-900 pr-2">{name}</p>
      <Logout />
    </div>
  </div>
  );
};

export default HeaderMasyarakat;
