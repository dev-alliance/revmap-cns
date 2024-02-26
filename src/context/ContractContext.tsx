import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface Overview {
  name: string;
  vendor: string;
  currency: string;
  value: number;
  category: string;
  tags: string[];
  branch: string;
  team: string;
  contractType: string;
  status: string;
}

interface Lifecycle {
  startDate: string; // Using string for simplicity, conversion to Date can be handled when needed
  endDate: string;
  noticePeriodDate: string;
  renewalOwners: string[];
}

interface ContractStatus {
  status: string;
  expire: string;
}

interface Contract {
  overview: Overview;
  lifecycle: Lifecycle;
}

interface ContractContextProps {
  contract: Contract | null;
  setContract: Dispatch<SetStateAction<Contract | null>>;
  contractStatus: ContractStatus;
  setContractStatus: Dispatch<SetStateAction<ContractStatus>>;
  updateContractOverview: (overview: Overview) => void;
}

export const ContractContext = createContext<ContractContextProps>({
  contract: null,
  setContract: () => {},
  contractStatus: { status: "", expire: "" },
  setContractStatus: () => {},
  updateContractOverview: () => {},
});

export const ContractProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [contractStatus, setContractStatus] = useState<ContractStatus>({
    status: "",
    expire: "",
  });

  const updateContractOverview = (overview: Overview) => {
    if (contract) {
      setContract({
        ...contract,
        overview,
      });
      // Optionally update to local storage or backend
    }
  };

  useEffect(() => {
    const storedContractData = localStorage.getItem("contract");
    if (storedContractData) {
      setContract(JSON.parse(storedContractData));
    }

    const storedContractStatus = localStorage.getItem("contractStatus");
    if (storedContractStatus) {
      setContractStatus(JSON.parse(storedContractStatus));
    }
  }, []);

  return (
    <ContractContext.Provider
      value={{
        contract,
        setContract,
        contractStatus,
        setContractStatus,
        updateContractOverview,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
