import React, { useState } from "react";
import TableUser from "../components/table/TableUser";
import useMod from "../hooks/useMod";
import CreateUserMod from "../mods/CreateUserMod";
import UpdateUserMod from "../mods/UpdateUserMod";

const UsersPage = () => {
  const { modals, handleOpenModal, handleCloseModal } = useMod();
  const [users, setUsers] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    // Toggle refreshData to trigger a re-fetch in TableUser
    setRefreshData((prev) => !prev);
    handleCloseModal("createUser");
  };

  const handleEditUser = (user) => {
    setSelectedItem(user);
    handleOpenModal("updateUser");
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    // Toggle refreshData to trigger a re-fetch in TableUser
    setRefreshData((prev) => !prev);
    handleCloseModal("updateUser");
  };

  const handleDeleteUser = (userId) => {
    // Remove user from local state if needed
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    // Toggle refreshData to trigger a re-fetch in TableUser
    setRefreshData((prev) => !prev);
  };

  return (
    <div className="w-full h-fit min-h-screen bg-gray-100 p-6 flex flex-col gap-6">
      <p className="text-2xl font-bold">Management Users</p>
      <div className="w-full h-full bg-white rounded-3xl shadow-lg p-5 flex flex-col gap-5">
        <div className="w-full flex items-center justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded-full cursor-pointer"
            onClick={() => handleOpenModal("createUser")}
          >
            Tambah User
          </button>
        </div>
        <div className="w-full h-full">
          <TableUser
            data={users}
            refreshData={refreshData}
            onDeleteUser={handleDeleteUser}
            onEditUser={handleEditUser}
          />
        </div>
      </div>

      {modals.createUser && (
        <CreateUserMod
          onClose={() => handleCloseModal("createUser")}
          onCreated={handleAddUser}
        />
      )}

      {modals.updateUser && selectedItem && (
        <UpdateUserMod
          onClose={() => handleCloseModal("updateUser")}
          onUpdated={handleUpdateUser}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default UsersPage;
