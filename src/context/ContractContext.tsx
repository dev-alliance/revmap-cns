/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface ContractContextProps {
  contract: any | null;
  loginContext: (userData: User) => void;
  logout: () => void;
  contractStatus: any | null;
  setContractStatus: (code: any | null) => void;
  setTwoFA: (abc: any | null) => void;
  twoFA: any | null;
}

export const ContractContext = createContext<ContractContextProps>({
  contract: null,
  loginContext: () => {},
  logout: () => {},
  contractStatus: null,
  setContractStatus: () => {},
  setTwoFA: () => {},
  twoFA: null,
});

interface ContractProviderProps {
  children: ReactNode;
}

export const ContractProvider: React.FC<ContractProviderProps> = ({
  children,
}) => {
  const [contract, setContract] = useState<string | null>(null);
  const [contractStatus, setContractStatus] = useState<any>({
    status: "",
    expire: "",
  });
  const [twoFA, setTwoFA] = useState<string | null>(null);
  // Load user data from localStorage when component mounts

  useEffect(() => {
    const storeContractData = localStorage.getItem("contract");
    if (storeContractData) {
      setContract(JSON.parse(storeContractData));
    }
  }, []);

  const loginContext = (userData: any) => {
    setContract(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Save user data to localStorage
  };

  const logout = () => {
    setContract(null);
    localStorage.removeItem("user"); // Clear user data from localStorage
  };

  return (
    <ContractContext.Provider
      value={{
        contract,
        contractStatus,
        setContractStatus,
        loginContext,
        logout,
        setTwoFA,
        twoFA,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
