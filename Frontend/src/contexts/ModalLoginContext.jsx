import { createContext, useContext, useState } from "react";

// Tạo Context
const ModalLoginContext = createContext();

export function ModalLoginProvider({ children }) {
  // State quản lý: 'none' | 'login' | 'register'
  const [activeModal, setActiveModal] = useState('none');

  // Các hàm tiện ích
  const openLogin = () => setActiveModal('login');
  const openRegister = () => setActiveModal('register');
  const closeModal = () => setActiveModal('none');

  return (
    <ModalLoginContext.Provider value={{ 
      activeModal, 
      openLogin, 
      openRegister, 
      closeModal 
    }}>
      {children}
    </ModalLoginContext.Provider>
  );
}

// Hook để sử dụng ở các component khác
export const useModalLogin = () => useContext(ModalLoginContext);