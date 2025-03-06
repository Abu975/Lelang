import Logout from "./Logout";
  


const Header = ({ title, name }) => {
  const handleLogout = () => {
    // Fungsi ini akan memanggil komponen Logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
      logoutButton.click();
    }
  }
  return (
    <div className="grid grid-cols-12 gap-2 w-full pt-4 pb-2  pr-0">
      <div className="col-span-6 sm:col-span-8">
        <h1 className=" title-text text-gray-600 font-semibold">
          {title}
        </h1>
      </div>
      <div className="order-2 col-span-6 sm:col-span-4 lg:order-2 flex justify-end items-center">
        <div
          className="flex  text-center align-middle items-center bg-white pl-2 py-1 rounded-3xl shadow-sm hover:bg-gray-200 cursor-pointer pr-0"
          onClick={handleLogout}
        >
          <p className="text-xl text-gray-900 pr-2">{name}</p>
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Header;
