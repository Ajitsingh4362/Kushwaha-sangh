import { createContext, useContext, useState } from 'react'

const DonateModalContext = createContext({ open: false, openModal: () => {}, closeModal: () => {} })

export function DonateModalProvider({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <DonateModalContext.Provider
      value={{ open, openModal: () => setOpen(true), closeModal: () => setOpen(false) }}
    >
      {children}
    </DonateModalContext.Provider>
  )
}

export function useDonateModal() {
  return useContext(DonateModalContext)
}
