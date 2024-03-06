/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyAaaaRecord } from "dns";
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
  contract: any | null;
  setContract: Dispatch<SetStateAction<Contract | null>>;
  contractStatus: ContractStatus;
  setContractStatus: Dispatch<SetStateAction<any>>;
  updateContractOverview: (overview: Overview) => void;
  signatories: any | null;
  setSignatories: Dispatch<SetStateAction<any>>;
  openDocoment: any | null;
  setOpenDocoment: Dispatch<SetStateAction<any>>;
  selectedModule: any | null;
  setSelectedModule: Dispatch<SetStateAction<any>>;
  sidebarExpanded: any | null;
  setSidebarExpanded: Dispatch<SetStateAction<any>>;
}

export const ContractContext = createContext<ContractContextProps>({
  contract: null,
  setContract: () => {},
  contractStatus: { status: "", expire: "" },
  setContractStatus: () => {},
  updateContractOverview: () => {},
  signatories: [],
  setSignatories: () => {},
  openDocoment: [],
  setOpenDocoment: () => {},
  selectedModule: {},
  setSelectedModule: () => {},
  sidebarExpanded: {},
  setSidebarExpanded: () => {},
});

export const ContractProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [signatories, setSignatories] = useState<string[]>([]);
  const [openDocoment, setOpenDocoment] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>("overview");
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const [contractStatus, setContractStatus] = useState<ContractStatus>({
    status: "",
    expire: "",
  });

  const updateContractOverview = (overview: any) => {
    if (contract !== null) {
      // Check if 'contract' is not null
      setContract({
        ...contract,
        overview,
      });
    } else {
      setContract(
        // Initialize with default or empty values for other properties
        overview
      );
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
    const storedContractSignature = localStorage.getItem("contractSignature");
    if (storedContractSignature) {
      setSignatories(JSON.parse(storedContractSignature));
    }
    const storedContractSignatureOpen = localStorage.getItem("openDocoment");
    if (storedContractSignatureOpen) {
      setOpenDocoment(JSON.parse(storedContractSignatureOpen));
    }
    const storedContractselectedModule =
      localStorage.getItem("sidebarExpanded");
    if (storedContractselectedModule) {
      setSidebarExpanded(JSON.parse(storedContractselectedModule));
    }
    const storedContractsidebarExand = localStorage.getItem("sid");
    if (storedContractsidebarExand) {
      setSelectedModule(JSON.parse(storedContractsidebarExand));
    }
  }, []);
  useEffect(() => {
    // Check if 'contract' is not null before storing
    if (contract) {
      localStorage.setItem("contract", JSON.stringify(contract));
    }
  }, [contract]);

  return (
    <ContractContext.Provider
      value={{
        contract,
        setContract,
        contractStatus,
        setContractStatus,
        updateContractOverview,
        signatories,
        setSignatories,
        openDocoment,
        setOpenDocoment,
        selectedModule,
        setSelectedModule,
        sidebarExpanded,
        setSidebarExpanded,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
