import { useState } from "react";

const useMod = () => {
  const [modals, setModals] = useState({
    createUser: false,
    updateUser: false,
    createDevice: false,
    updateDevice: false,
    createSubDevice: false,
  });
  const [selectdItem, setSelectedItem] = useState(null);

  const handleOpenModal = (type, item = null) => {
    setModals((prev) => ({ ...prev, [type]: true }));
    setSelectedItem(item);
  };

  const handleCloseModal = (type) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedItem(null);
  };

  return {
    modals,
    selectdItem,
    handleOpenModal,
    handleCloseModal,
  };
};

export default useMod;
