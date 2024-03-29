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

  showCompanySelect: any | null;
  setShowCompanySelect: Dispatch<SetStateAction<any>>;
  showConditionalSelect: any | null;
  setShowConditionalSelect: Dispatch<SetStateAction<any>>;
  showSignatories: any | null;
  setShowSignatories: Dispatch<SetStateAction<any>>;
  selectedApproval: any | null;
  setSelectedApproval: Dispatch<SetStateAction<any>>;
  approvers: any | null;
  setApprovers: Dispatch<SetStateAction<any>>;
  selectedUserApproval: any | null;
  setSelectedUserApproval: Dispatch<SetStateAction<any>>;
  userApproval: any | null;
  setUserApproval: Dispatch<SetStateAction<any>>;
  selectedConditionalApproval: any | null;
  setSelectedConditionalApproval: Dispatch<SetStateAction<any>>;
  userConditionalApproval: any | null;
  setUserConditionalApproval: Dispatch<SetStateAction<any>>;
  conditions: any | null;
  setConditions: Dispatch<SetStateAction<any>>;
  selectedFeild: any | null;
  setSeletedFeild: Dispatch<SetStateAction<any>>;
  type: any | null;
  setType: Dispatch<SetStateAction<any>>;
  viewUser: any | null;
  setViewUser: Dispatch<SetStateAction<any>>;
  collaborater: any | null;
  setCollaborater: Dispatch<SetStateAction<any>>;
  showButtons: any | null;
  setShowButtons: Dispatch<SetStateAction<any>>;
  activeSection: any | null;
  setActiveSection: Dispatch<SetStateAction<any>>;
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
  showCompanySelect: {},
  setShowCompanySelect: () => {},
  showConditionalSelect: {},
  setShowConditionalSelect: () => {},
  showSignatories: {},
  setShowSignatories: () => {},
  selectedApproval: {},
  setSelectedApproval: () => {},
  approvers: {},
  setApprovers: () => {},
  selectedUserApproval: {},
  setSelectedUserApproval: () => {},
  userApproval: {},
  setUserApproval: () => {},
  selectedConditionalApproval: {},
  setSelectedConditionalApproval: () => {},
  userConditionalApproval: {},
  setUserConditionalApproval: () => {},
  conditions: [],
  setConditions: () => {},
  selectedFeild: [],
  setSeletedFeild: () => {},
  type: {},
  setType: () => {},
  viewUser: {},
  setViewUser: () => {},
  collaborater: {},
  setCollaborater: () => {},
  showButtons: {},
  setShowButtons: () => {},
  activeSection: {},
  setActiveSection: () => {},
});

export const ContractProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [signatories, setSignatories] = useState<string[]>([]);
  const [collaborater, setCollaborater] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState("");
  const [showButtons, setShowButtons] = useState(true);
  const [openDocoment, setOpenDocoment] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>("overview");
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const [showCompanySelect, setShowCompanySelect] = useState(false);
  const [showConditionalSelect, setShowConditionalSelect] = useState(false);
  const [showSignatories, setShowSignatories] = useState<any>("");
  const [selectedApproval, setSelectedApproval] = useState("");
  const [approvers, setApprovers] = useState<any[]>([]);
  const [selectedUserApproval, setSelectedUserApproval] = useState("");
  const [userApproval, setUserApproval] = useState<any[]>([]);
  const [selectedFeild, setSeletedFeild] = useState("");
  const [type, setType] = useState("");
  const [viewUser, setViewUser] = useState(false);
  const [conditions, setConditions] = useState([
    {
      comparisonOperator: "",
      value: "",
      userSelection: "",
      userDisplayName: "",
    },
  ]);
  const [selectedConditionalApproval, setSelectedConditionalApproval] =
    useState("");
  const [userConditionalApproval, setUserConditionalApproval] = useState<any[]>(
    []
  );
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
    const storedshowConditionalSelect =
      localStorage.getItem("ConditionalSelect");
    if (storedshowConditionalSelect) {
      setShowConditionalSelect(JSON.parse(storedshowConditionalSelect));
    }
    const storedsetShowCompanySelect = localStorage.getItem("CompanySelect");
    if (storedsetShowCompanySelect) {
      setShowCompanySelect(JSON.parse(storedsetShowCompanySelect));
    }
    const storedsetShowsignatori = localStorage.getItem("showSignatories");
    if (storedsetShowsignatori) {
      setShowSignatories(JSON.parse(storedsetShowsignatori));
    }
    const storedsetselectedApproval = localStorage.getItem("selectedApproval");

    if (storedsetselectedApproval) {
      setSelectedApproval(JSON.parse(storedsetselectedApproval));
    }
    const storedsetApprovers = localStorage.getItem("approvers");
    if (storedsetApprovers) {
      setApprovers(JSON.parse(storedsetApprovers));
    }
    const storedselectedUserApproval = localStorage.getItem("selecteApprover");
    if (storedselectedUserApproval) {
      setSelectedApproval(JSON.parse(storedselectedUserApproval));
    }
    const storedviewUser = localStorage.getItem("viewUser");
    if (storedviewUser) {
      setViewUser(JSON.parse(storedviewUser));
    }
    const storeduserApproval = localStorage.getItem("userApproval");
    if (storeduserApproval) {
      setUserApproval(JSON.parse(storeduserApproval));
    }
    const storeduserconditions = localStorage.getItem("conditions");
    if (storeduserconditions) {
      setConditions(JSON.parse(storeduserconditions));
    }
    const storeduserselectedConditionalApproval = localStorage.getItem(
      "selectedConditionalApproval"
    );
    if (storeduserselectedConditionalApproval) {
      setSelectedConditionalApproval(
        JSON.parse(storeduserselectedConditionalApproval)
      );
    }
    const storeduserConditionalApproval = localStorage.getItem(
      "userConitioanalApproval"
    );
    if (storeduserConditionalApproval) {
      setUserConditionalApproval(JSON.parse(storeduserConditionalApproval));
    }
    const storedselectedFeild = localStorage.getItem("selectedFeild");
    if (storedselectedFeild) {
      setSeletedFeild(JSON.parse(storedselectedFeild));
    }
    const storedtype = localStorage.getItem("type");
    if (storedtype) {
      setSeletedFeild(JSON.parse(storedtype));
    }
    const storedapproval = localStorage.getItem("approval");
    if (storedapproval) {
      setUserApproval(JSON.parse(storedapproval));
    }
    const storedShowbutton = localStorage.getItem("showButtons");
    if (storedShowbutton) {
      setShowButtons(JSON.parse(storedShowbutton));
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
        setShowCompanySelect,
        showCompanySelect,
        setShowConditionalSelect,
        showConditionalSelect,
        setShowSignatories,
        showSignatories,
        setSelectedApproval,
        selectedApproval,
        approvers,
        setApprovers,
        setSelectedUserApproval,
        selectedUserApproval,
        setUserApproval,
        userApproval,
        setSelectedConditionalApproval,
        selectedConditionalApproval,
        setUserConditionalApproval,
        userConditionalApproval,
        conditions,
        setConditions,
        selectedFeild,
        setSeletedFeild,
        setType,
        type,
        viewUser,
        setViewUser,
        collaborater,
        setCollaborater,
        showButtons,
        setShowButtons,
        setActiveSection,
        activeSection,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
