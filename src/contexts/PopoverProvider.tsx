// PopoverContext.tsx
import {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
  MutableRefObject,
} from "react";

/* -------- context tipleri -------- */
interface Ctx {
  /** Açık (aktif) pop-over’ın benzersiz anahtarı – yoksa null */
  openId: string | null;
  /** openId’yi günceller (null ⇒ tüm pop-over’lar kapalı) */
  setOpenId: (id: string | null) => void;
  /** O pop-over’ı tetikleyen DOM elemanına erişmek isteyenler için ref */
  triggerRef: MutableRefObject<HTMLElement | null>;
}

/* -------- context oluştur -------- */
const PopoverContext = createContext<Ctx | null>(null);

/* -------- custom hook -------- */
export const usePopover = () => {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("usePopover must be inside PopoverProvider");
  return ctx;
};

/* -------- provider -------- */
export const PopoverProvider = ({ children }: { children: ReactNode }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  /** Aktif pop-over’ı açan element burada tutulur (gerekiyorsa) */
  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <PopoverContext.Provider value={{ openId, setOpenId, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
};
