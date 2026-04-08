import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ContrasteContextType {
  altoContraste: boolean;
  setAltoContraste: (value: boolean) => void;
}

const ContrasteContext = createContext<ContrasteContextType>({
  altoContraste: false,
  setAltoContraste: () => {},
});

export function ContrasteProvider({ children }: { children: React.ReactNode }) {
  const [altoContraste, setAltoContrasteState] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const saved = await AsyncStorage.getItem("seniorease-config");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.altoContraste !== undefined) {
            setAltoContrasteState(parsed.altoContraste);
          }
        }
      } catch {}
    }
    load();
  }, []);

  async function setAltoContraste(value: boolean) {
    setAltoContrasteState(value);
    try {
      const saved = await AsyncStorage.getItem("seniorease-config");
      const parsed = saved ? JSON.parse(saved) : {};
      parsed.altoContraste = value;
      await AsyncStorage.setItem("seniorease-config", JSON.stringify(parsed));
    } catch {}
  }

  return (
    <ContrasteContext.Provider value={{ altoContraste, setAltoContraste }}>
      {children}
    </ContrasteContext.Provider>
  );
}

export function useContraste() {
  return useContext(ContrasteContext);
}
