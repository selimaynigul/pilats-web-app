// PopoverContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface Ctx {
  openId: number | null;
  setOpenId: (id: number | null) => void;
}

const PopoverContext = createContext<Ctx | null>(null);

export const usePopover = () => {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("usePopover must be inside PopoverProvider");
  return ctx;
};

export const PopoverProvider = ({ children }: { children: ReactNode }) => {
  const [openId, setOpenId] = useState<number | null>(null);
  return (
    <PopoverContext.Provider value={{ openId, setOpenId }}>
      {children}
    </PopoverContext.Provider>
  );
};
