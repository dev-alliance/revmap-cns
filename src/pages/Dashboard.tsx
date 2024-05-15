/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Badge,
  ListItemIcon,
  useMediaQuery,
  Collapse,
  useTheme,
  MenuItem,
  Menu,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import logo from "../assets/logo.jpg";
import home from "../assets/fi-rs-home.svg";
import template from "../assets/temlate.svg";
import reports from "../assets/reports.png";
import docoment from "../assets/document.svg";
import folder from "../assets/fi-rs-folder.svg";
import setting from "../assets/fi-rs-settings.png";
import billing from "../assets/billing.png";
import compony from "../assets/comony-profile.svg";
import userIcon from "../assets/user.png";
import configration from "../assets/configration.svg";
import approval from "../assets/approval_icon.png";
import categories from "../assets/categories.png";
import customfeild from "../assets/customfeild.png";
import clause from "../assets/clause.png";
import roles from "../assets/Roles.png";
import teamsIcon from "../assets/teams.png";
import tagsIcon from "../assets/tags.png";
import logoutIcon from "../assets/logout_icon.png";
import PersonIcon from "@mui/icons-material/Person";

// Import your page components
import HomePage from "@/pages/dasboard/Dashboard";
import TeamsList from "@/pages/dasboard/teams/TeamsLiat";
import SubPage1 from "@/pages/LoginPage";
import CreateBranch from "@/pages/dasboard/branch/CreateBranch";
import BranchList from "@/pages/dasboard/branch/BranchList";
import CreateTeam from "@/pages/dasboard/teams/CreateTeam";
import UpdateBranch from "@/pages/dasboard/branch/UpdateBranch";
import UpdateTeam from "@/pages/dasboard/teams/UpdateTeam";
import UserList from "@/pages/dasboard/users/UserList";
import CreateUser from "@/pages/dasboard/users/CreateUser";
import ResetPassword from "@/pages/ResetPassword";
import LoginHistory from "@/pages/dasboard/users/LoginHistory";
import UpdateUser from "@/pages/dasboard/users/UpdateUser";
import UserDetail from "@/pages/dasboard/users/UserDetail";
import UserEdit from "@/pages/dasboard/profile/UserEdit";
import { useAuth } from "@/hooks/useAuth";
import Setting from "@/pages/dasboard/profile/Setting";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GroupsIcon from "@mui/icons-material/Groups";
import CategoryList from "@/pages/dasboard/category/CategoryList";
import CreateCategory from "@/pages/dasboard/category/CreateCategory";
import UpdateCategory from "@/pages/dasboard/category/UpdateCategoey";
import CreateTags from "@/pages/dasboard/tags/CreateTags";
import TagList from "@/pages/dasboard/tags/TagList";
import UpdateTags from "@/pages/dasboard/tags/UpdateTags";
import ClausesList from "@/pages/dasboard/clauses/ClausesList";
import UpdateClauses from "@/pages/dasboard/clauses/UpdateClauses";
import CreateClauses from "@/pages/dasboard/clauses/CreateClauses";
import FolderLIst from "@/pages/dasboard/folders/FolderList";
import Upload from "@/pages/dasboard/folders/Upload";
import ComponyList from "@/pages/dasboard/compony/ComponyList";
import UpdateCompony from "@/pages/dasboard/compony/UpdateCompony";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TaskIcon from "@mui/icons-material/Task";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import BusinessIcon from "@mui/icons-material/Business";
import TemplateList from "@/pages/dasboard/templates/TemplateList";
import CreateTemplate from "@/pages/dasboard/templates/CreateTemplate";
import UpdateTemplate from "@/pages/dasboard/templates/UpdateTemplate";
import DescriptionIcon from "@mui/icons-material/Description";
import FieldList from "@/pages/dasboard/customField/FieldList";
import InputIcon from "@mui/icons-material/Input";
import ApprovalList from "@/pages/dasboard/approval/ApprovalList";
import CreateApproval from "@/pages/dasboard/approval/CreateApproval";
import UpdateApproval from "@/pages/dasboard/approval/UpdateApproval";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ContractList from "@/pages/dasboard/contract/ContractList";
import ArticleIcon from "@mui/icons-material/Article";
import CreateContract from "@/pages/dasboard/contract/CreateContract";
import TinyDahsbord from "@/pages/dasboard/contract/sdk/EditorDahsbord";
import CustomTextEditor from "@/pages/dasboard/contract/sdk/CustomTextEditor";
import CardsSubscription from "@/pages/dasboard/billing/CardsSubcription";
import RoleList from "@/pages/dasboard/role_permission/RoleList";
import CreateCustomRole from "@/pages/dasboard/role_permission/CreateCustomRole";
import SystemsRole from "@/pages/dasboard/role_permission/SystemsRole";
import UserDetailSingleUser from "@/pages/dasboard/users/UserDetailSingleUser";
import DetailBranch from "@/pages/dasboard/branch/DetailBranch";
import { useContract } from "@/hooks/useContract";
import { useLocation } from "react-router-dom";
import { ContractContext } from "@/context/ContractContext";
// Usage: <ArticleIcon />

// Usage: <AssignmentIcon />

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { contractStatus, setContractStatus } = useContract();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(true);
  const [leftSideBar, setLeftSideBar] = useState(true);
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);
  const [openSections, setOpenSections] = useState<any>({
    dashboard: false,
    contract: false,
    setting: false,
    configuration: false,
  });
  const { leftsidebarExpanded, setLeftSidebarExpanded } =
    useContext(ContractContext);

  const location = useLocation();
  const drawerWidth = leftsidebarExpanded ? 55 : 240;
  // Split the pathname by '/' and filter out empty strings
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Assuming 'editor-dahsbord' is always after 'dashboard',
  // and you want to get the segment after 'dashboard'
  const editorDashboardSegment =
    pathSegments[pathSegments.indexOf("dashboard") + 1];

  const [selectedModule, setSelectedModule] = useState(null);

  const handleModuleClick = (moduleName: any) => {
    setSelectedModule(moduleName);
  };
  const statuses = ["Draft", "Review", "Signing", "Signed", "Active"];
  const expireDate = [
    "All",
    "Next 30 days",
    "Next 60 days",
    "Next 90 days",
    "Expired",
    "Active",
  ];
  const ExpireColors: any = {
    All: "#155BE5",
    "Next 30 days": "#FFAA04",
    "Next 60 days": "#725FE7",
    "Next 90 days": "#CDAD00",
    Expired: "#BC3D89",

    // Add more status-color mappings as needed
  };
  const statusColors: any = {
    Draft: "#FFAA04",
    Review: "#725FE7",
    Signing: "#CDAD00",
    Signed: "#BC3D89",
    Active: "#3F9748",
    // Add more status-color mappings as needed
  };
  // Properly type the section parameter
  const handleSectionClick = (section: keyof any) => {
    setOpenSections((prevSections: any) => ({
      // Set all sections to false initially
      ...Object.keys(prevSections).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {}
      ),
      // Then set only the clicked section to true
      [section]: !prevSections[section],
    }));
  };
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-account-menu";

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    setLeftSideBar(!leftSideBar);
    setLeftSidebarExpanded((prevState: any) => !prevState);
  };

  const handleStatusClick = (newStatus: any) => {
    setContractStatus({ status: newStatus });
  };
  const handleExpireClick = (expire: string) => {
    setContractStatus({ expire: expire });
  };
  const handleToggleExpire = () => {
    setOpen(!open);
  };
  const drawer = (
    <div>
      <img
        src={logo}
        alt="Logo"
        style={{
          maxWidth: isMobile ? "100px" : "250px",
          marginTop: "1px",
          alignItems: "left",
          marginLeft: "-0.5rem",
        }}
      />

      <Divider />
      <div
        style={{
          display: "flex",
          justifyContent: leftsidebarExpanded ? "flex-start" : "flex-end",
          marginLeft: leftsidebarExpanded ? "0.5rem" : "0rem",
          marginTop: "0rem",
        }}
      >
        <IconButton onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
      </div>
      <List
        onClick={() => {
          handleDrawerToggle(), setLeftSidebarExpanded(false);
        }}
      >
        <ListItemButton
          component={Link}
          to="/dashboard"
          sx={{
            height: "4vh",
            mb: "12px",
            backgroundColor:
              selectedModule === "home" ? "#E4EDF8" : "transparent",
            "&:hover": {
              backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
              "& .MuiListItemText-root": {
                color: "#174B8B", // Color change on hover for text
              },
              "& svg path": {
                fill: "#174B8B", // Color change on hover for SVG
              },
            },
          }}
          onClick={() => handleModuleClick("home")}
        >
          <ListItemIcon>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.6261 8.05678L22.6268 8.05734C23.1886 8.49334 23.5 9.12484 23.5 9.77963V21.8458C23.5 22.271 23.3174 22.6878 22.9774 23.0017C22.6361 23.3168 22.1652 23.5 21.6667 23.5H17.6667C17.1681 23.5 16.6972 23.3168 16.3559 23.0017C16.016 22.6878 15.8333 22.271 15.8333 21.8458V15.6908C15.8333 15.2999 15.6648 14.9339 15.3796 14.6706C15.0958 14.4086 14.7188 14.2676 14.3333 14.2676H9.66667C9.28116 14.2676 8.90419 14.4086 8.62039 14.6706C8.33524 14.9339 8.16667 15.2999 8.16667 15.6908V21.8458C8.16667 22.271 7.98405 22.6878 7.64408 23.0017C7.30276 23.3168 6.83188 23.5 6.33333 23.5H2.33333C2.08728 23.5 1.84444 23.4552 1.619 23.369C1.3936 23.2828 1.19125 23.1574 1.02259 23.0017C0.854012 22.846 0.72262 22.6634 0.633805 22.4655C0.545048 22.2677 0.5 22.0572 0.5 21.8458V9.7784C0.5 9.12505 0.811221 8.49325 1.37365 8.05576L1.37389 8.05558L10.3737 1.04647C10.824 0.696127 11.3998 0.5 12 0.5C12.6001 0.5 13.1759 0.696068 13.6261 1.0463C13.6261 1.04632 13.6261 1.04634 13.6261 1.04636C13.6262 1.0464 13.6262 1.04643 13.6263 1.04647L22.6261 8.05678Z"
                fill={selectedModule === "home" ? "#174B8B" : "white"}
                stroke="white"
              />
            </svg>
          </ListItemIcon>
          <ListItemText
            sx={{
              ml: -1.2,
              color: selectedModule === "home" ? "#155BE5" : "white",
            }}
            primary="Home"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
        {/* <ListItemButton
          component={Link}
          to="/dashboard"
          sx={{
            backgroundColor:
              selectedModule === "home" ? "#E4EDF8" : "transparent",
          }}
          onClick={() => handleModuleClick("home")}
        >
          <ListItemIcon>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.1667 9.33333V9.83333H14.6667H16.1262L12 13.9596L7.87377 9.83333H9.33333H9.83333V9.33333V5.83333H14.1667V9.33333ZM21.3333 16.5H21.8333V16V2.66667V2.16667H21.3333H2.66667H2.16667V2.66667V16V16.5H2.66667H7.52785C7.64069 17.5095 8.0928 18.4568 8.81802 19.182C9.66193 20.0259 10.8065 20.5 12 20.5C13.1935 20.5 14.3381 20.0259 15.182 19.182C15.9072 18.4568 16.3593 17.5095 16.4722 16.5H21.3333ZM2.66667 0.5H21.3333C21.908 0.5 22.4591 0.728273 22.8654 1.1346C23.2717 1.54093 23.5 2.09203 23.5 2.66667V21.3333C23.5 21.908 23.2717 22.4591 22.8654 22.8654C22.4591 23.2717 21.908 23.5 21.3333 23.5H2.66667C2.09203 23.5 1.54093 23.2717 1.1346 22.8654C0.728273 22.4591 0.5 21.908 0.5 21.3333V2.66667C0.5 1.47451 1.46444 0.5 2.66667 0.5Z"
                fill="white"
                stroke="white"
              />
            </svg>
          </ListItemIcon>
          <ListItemText
            sx={{ ml: -1.2, color: "white" }}
            primary="Inbox"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton> */}

        <ListItemButton
          sx={{
            height: "4vh",
            mb: "12px",
            backgroundColor:
              selectedModule === "contract" ? "#E4EDF8" : "transparent",
            "&:hover": {
              backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
              "& .MuiListItemText-root": {
                color: "#174B8B", // Color change on hover for text
              },
              "& svg path": {
                fill: "#174B8B", // Color change on hover for SVG
              },
            },
          }}
          onClick={() => handleModuleClick("contract")}
        >
          <ListItemIcon>
            <Link
              to="/dashboard/contract-list"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.6 7H22.2L15.6 1.5V7ZM7.2 0H16.8L24 6V18C24 18.5304 23.7471 19.0391 23.2971 19.4142C22.847 19.7893 22.2365 20 21.6 20H7.2C5.868 20 4.8 19.1 4.8 18V2C4.8 1.46957 5.05286 0.960859 5.50294 0.585786C5.95303 0.210714 6.56348 0 7.2 0ZM2.4 4V22H21.6V24H2.4C1.76348 24 1.15303 23.7893 0.702944 23.4142C0.252856 23.0391 0 22.5304 0 22V4H2.4Z"
                  fill={selectedModule === "contract" ? "#174B8B" : "white"}
                />
              </svg>
            </Link>
          </ListItemIcon>
          <Link
            to="/dashboard/contract-list"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <ListItemText
              sx={{
                ml: -1.2,
                color: selectedModule === "contract" ? "#174B8B" : "white",
              }}
              primary="Documents"
              primaryTypographyProps={{ variant: "subtitle2" }}
            />
          </Link>
          <IconButton
            sx={{ ml: "2.3rem" }}
            onClick={(event) => {
              event.stopPropagation(); // Stop the click from propagating to the parent elements
              handleSectionClick("contract");
            }}
          ></IconButton>
          {openSections.contract ? (
            <ExpandLess
              onClick={(event) => {
                event.stopPropagation(); // Stop the click from propagating to the parent elements
                handleSectionClick("contract");
              }}
              sx={{
                color: selectedModule === "contract" ? "#174B8B" : "white",
              }}
            />
          ) : (
            <ExpandMore
              onClick={(event) => {
                event.stopPropagation(); // Stop the click from propagating to the parent elements
                handleSectionClick("contract");
              }}
              sx={{
                color: selectedModule === "contract" ? "#174B8B" : "white",
              }}
            />
          )}
        </ListItemButton>

        <Collapse in={openSections.contract} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {statuses?.map((statusItem) => (
              <ListItemButton
                key={statusItem}
                sx={{
                  pl: leftsidebarExpanded ? 0.4 : 7,
                  fontSize: leftsidebarExpanded ? "3px" : "10px",
                }}
                onClick={() => handleStatusClick(statusItem)}
              >
                <div
                  style={{
                    height: leftsidebarExpanded ? "6px" : "10px",
                    width: leftsidebarExpanded ? "6px" : "10px",

                    backgroundColor: statusColors[statusItem],
                    borderRadius: leftsidebarExpanded ? "100%" : "50%",
                    marginRight: leftsidebarExpanded ? "4px" : "10px",
                    alignSelf: "center",
                  }}
                />
                <ListItemText
                  primary={statusItem}
                  sx={{
                    fontSize: leftsidebarExpanded ? "5px" : "10px",
                    color:
                      statusItem === contractStatus.status
                        ? "#1976d2"
                        : "initial",
                  }}
                  primaryTypographyProps={{
                    variant: "subtitle2",
                    fontSize: leftsidebarExpanded ? "12px" : "14px",
                    color: "white",
                  }}
                />
              </ListItemButton>
            ))}
            {/* <ListItemButton
              key="expireItem"
              sx={{
                pl: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onClick={handleToggleExpire}
            >
              <ListItemText
                primary="Expire"
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontSize: "16px",
                }}
              />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton> */}
            {/* <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
            
                {expireDate?.map((expireItem) => (
                  <ListItemButton
                    key={expireItem}
                    sx={{ pl: 8 }}
                    onClick={() => handleExpireClick(expireItem)}
                  >
                    <div
                      style={{
                        height: "10px",
                        width: "10px",
                        backgroundColor: ExpireColors[expireItem],
                        borderRadius: "50%",
                        marginRight: "10px",
                        alignSelf: "center",
                      }}
                    />
                    <ListItemText
                      primary={expireItem}
                      sx={{
                        color:
                          expireItem === contractStatus.expire
                            ? "#1976d2"
                            : "initial",
                      }}
                      primaryTypographyProps={{
                        variant: "subtitle2",
                        fontSize: "14px",
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse> */}
          </List>
        </Collapse>

        <ListItemButton
          component={Link}
          to="/dashboard/template-list"
          sx={{
            height: "4vh",
            mb: "12px",
            backgroundColor:
              selectedModule === "template" ? "#E4EDF8" : "transparent",
            "&:hover": {
              backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
              "& .MuiListItemText-root": {
                color: "#174B8B", // Color change on hover for text
              },
              "& svg path": {
                fill: "#174B8B", // Color change on hover for SVG
              },
            },
          }}
          onClick={() => handleModuleClick("template")}
        >
          <ListItemIcon>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.4 4.8H24V24H14.4V4.8ZM0 2.4H24V0H0V2.4ZM0 7.2H12V4.8H0V7.2ZM8.4 24H12V9.6H8.4V24ZM0 24H6V9.6H0V24Z"
                fill={selectedModule === "template" ? "#174B8B" : "white"}
              />
            </svg>
          </ListItemIcon>
          <ListItemText
            sx={{
              ml: -1.2,
              color: selectedModule === "template" ? "#174B8B" : "white",
              fontWeight: "bold",
            }}
            primary="Templates"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/dashboard/folder-list"
          sx={{
            height: "4vh",
            mb: "12px",
            backgroundColor:
              selectedModule === "folder" ? "#E4EDF8" : "transparent",
            "&:hover": {
              backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
              "& .MuiListItemText-root": {
                color: "#174B8B", // Color change on hover for text
              },
              "& svg path": {
                fill: "#174B8B", // Color change on hover for SVG
              },
            },
          }}
          onClick={() => handleModuleClick("folder")}
        >
          <ListItemIcon>
            <svg
              width="24"
              height="21"
              viewBox="0 0 24 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.8475 2.25H20.25C22.1554 2.25 23.7289 3.67105 23.9684 5.51113L23.992 5.75344L24 6V17.25C24 19.2382 22.4527 20.8651 20.4966 20.992L20.25 21H3.75C1.76177 21 0.134942 19.4527 0.00797653 17.4966L0 17.25V6.75H7.60603L7.83578 6.73825C8.29165 6.69147 8.72263 6.50645 9.07053 6.20816L9.23728 6.04969L12.8475 2.25ZM7.75 0C8.15569 0 8.55227 0.109653 8.89858 0.315243L9.1 0.45L11.0775 1.9335L8.14978 5.01656L8.0586 5.09807C7.96155 5.17151 7.84802 5.22025 7.72793 5.24003L7.60603 5.25H0V3.75C0 1.76177 1.5473 0.134942 3.50344 0.00797653L3.75 0H7.75Z"
                fill={selectedModule === "folder" ? "#174B8B" : "white"}
              />
            </svg>
          </ListItemIcon>
          <ListItemText
            sx={{
              ml: -1.2,
              color: selectedModule === "folder" ? "#174B8B" : "white",
              fontWeight: "bold",
            }}
            primary="Folders"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/dashboard/folder-list"
          sx={{
            height: "4vh",
            mb: "12px",
            backgroundColor:
              selectedModule === "reports" ? "#E4EDF8" : "transparent",
            "&:hover": {
              backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
              "& .MuiListItemText-root": {
                color: "#174B8B", // Color change on hover for text
              },
              "& svg path": {
                fill: "#174B8B", // Color change on hover for SVG
              },
            },
          }}
          onClick={() => handleModuleClick("reports")}
        >
          <ListItemIcon>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 4C0 2.93913 0.421427 1.92172 1.17157 1.17157C1.92172 0.421427 2.93913 0 4 0H20C21.0609 0 22.0783 0.421427 22.8284 1.17157C23.5786 1.92172 24 2.93913 24 4V20C24 21.0609 23.5786 22.0783 22.8284 22.8284C22.0783 23.5786 21.0609 24 20 24H4C2.93913 24 1.92172 23.5786 1.17157 22.8284C0.421427 22.0783 0 21.0609 0 20V4ZM6 14C6.26522 14 6.51957 14.1054 6.70711 14.2929C6.89464 14.4804 7 14.7348 7 15V18C7 18.2652 6.89464 18.5196 6.70711 18.7071C6.51957 18.8946 6.26522 19 6 19C5.73478 19 5.48043 18.8946 5.29289 18.7071C5.10536 18.5196 5 18.2652 5 18V15C5 14.7348 5.10536 14.4804 5.29289 14.2929C5.48043 14.1054 5.73478 14 6 14ZM11 12C11 11.7348 10.8946 11.4804 10.7071 11.2929C10.5196 11.1054 10.2652 11 10 11C9.73478 11 9.48043 11.1054 9.29289 11.2929C9.10536 11.4804 9 11.7348 9 12V18C9 18.2652 9.10536 18.5196 9.29289 18.7071C9.48043 18.8946 9.73478 19 10 19C10.2652 19 10.5196 18.8946 10.7071 18.7071C10.8946 18.5196 11 18.2652 11 18V12ZM14 8C14.2652 8 14.5196 8.10536 14.7071 8.29289C14.8946 8.48043 15 8.73478 15 9V18C15 18.2652 14.8946 18.5196 14.7071 18.7071C14.5196 18.8946 14.2652 19 14 19C13.7348 19 13.4804 18.8946 13.2929 18.7071C13.1054 18.5196 13 18.2652 13 18V9C13 8.73478 13.1054 8.48043 13.2929 8.29289C13.4804 8.10536 13.7348 8 14 8ZM19 6C19 5.73478 18.8946 5.48043 18.7071 5.29289C18.5196 5.10536 18.2652 5 18 5C17.7348 5 17.4804 5.10536 17.2929 5.29289C17.1054 5.48043 17 5.73478 17 6V18C17 18.2652 17.1054 18.5196 17.2929 18.7071C17.4804 18.8946 17.7348 19 18 19C18.2652 19 18.5196 18.8946 18.7071 18.7071C18.8946 18.5196 19 18.2652 19 18V6Z"
                fill={selectedModule === "reports" ? "#174B8B" : "white"}
              />
            </svg>
          </ListItemIcon>
          <ListItemText
            sx={{
              ml: -1.2,
              color: selectedModule === "reports" ? "#174B8B" : "white",
              fontWeight: "bold",
            }}
            primary="Reports"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>

        <ListItemButton
          sx={{
            height: "4vh",
            mb: "12px",
            "&:hover": {
              backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
              "& .MuiListItemText-root": {
                color: "#174B8B", // Color change on hover for text
              },
              "& svg path": {
                fill: "#174B8B", // Color change on hover for SVG
              },
            },
          }}
          onClick={() => handleSectionClick("setting")}
          // component={Link}
          // to="/dashboard/contract-list"
        >
          <ListItemIcon>
            <svg
              width="24"
              height="26"
              viewBox="0 0 24 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.0046 9.71959L12.0061 9.71958C12.3562 9.71851 12.703 9.78701 13.0264 9.9211C13.3497 10.0552 13.6432 10.2522 13.8898 10.5007L13.8903 10.5012C14.3958 11.0091 14.6736 11.6757 14.6736 12.3886C14.6736 13.1011 14.3961 13.7674 13.8912 14.2752C13.3834 14.7801 12.7171 15.0576 12.0046 15.0576C11.2921 15.0576 10.6258 14.7801 10.118 14.2752C9.61312 13.7674 9.3356 13.1011 9.3356 12.3886C9.3356 11.6759 9.61321 11.0096 10.1183 10.5018C10.625 9.99517 11.2908 9.71958 12.0046 9.71959ZM21.3353 14.2253L21.29 14.5031L21.504 14.6859L23.3546 16.2678C23.3548 16.2679 23.3549 16.268 23.355 16.2681C23.4858 16.3811 23.5319 16.5596 23.4776 16.7163L23.4775 16.7166L23.453 16.7873C22.9608 18.1541 22.2354 19.4119 21.2896 20.5292C21.2893 20.5296 21.289 20.53 21.2886 20.5304L21.2396 20.5875L21.2375 20.59C21.1843 20.6529 21.1131 20.6982 21.0335 20.7197L21.1642 21.2024L21.0335 20.7197C20.9541 20.7412 20.87 20.7381 20.7924 20.7107C20.7922 20.7107 20.7921 20.7106 20.7919 20.7106L18.4933 19.8925L18.2271 19.7977L18.0086 19.9769C17.201 20.6391 16.3027 21.1581 15.3291 21.5239L15.0647 21.6232L15.0133 21.901L14.5687 24.3052C14.5687 24.3053 14.5687 24.3053 14.5687 24.3054C14.5536 24.3867 14.5141 24.4615 14.4556 24.5198L14.8084 24.8741L14.4556 24.5198C14.3969 24.5782 14.3219 24.6174 14.2405 24.6321L14.2386 24.6325L14.1647 24.6462C14.1643 24.6462 14.1639 24.6463 14.1635 24.6464C12.7357 24.9032 11.2735 24.9032 9.84562 24.6464C9.84527 24.6463 9.84491 24.6462 9.84456 24.6462L9.77058 24.6325L9.76867 24.6321C9.68727 24.6174 9.61228 24.5782 9.55366 24.5198L9.20079 24.8741L9.55366 24.5198C9.49505 24.4614 9.45558 24.3866 9.44052 24.3052L8.94888 24.3963L9.44051 24.3052L8.99306 21.8895L8.94149 21.6112L8.67627 21.5122C7.71347 21.1528 6.82113 20.6318 6.0181 19.9716L5.79955 19.7919L5.53298 19.8868L3.21849 20.7101C3.21819 20.7103 3.21789 20.7104 3.21759 20.7105C3.13972 20.7376 3.05547 20.7406 2.97587 20.719C2.89595 20.6974 2.82447 20.6521 2.77084 20.589L2.76958 20.5875L2.71979 20.5294C2.71954 20.5291 2.7193 20.5289 2.71905 20.5286C1.77425 19.4179 1.0487 18.155 0.556187 16.7873L0.531714 16.7166L0.531753 16.7166L0.529557 16.7105C0.501511 16.6327 0.497798 16.5483 0.518912 16.4684C0.540026 16.3885 0.584966 16.3169 0.647755 16.2631L2.51688 14.663L2.73132 14.4795L2.68491 14.201C2.60194 13.7032 2.56145 13.187 2.56145 12.669C2.56145 12.1569 2.60189 11.6404 2.68506 11.1361L2.73097 10.8576L2.51631 10.6744L0.643254 9.07581C0.64303 9.07561 0.642805 9.07542 0.642581 9.07523C0.513282 8.96337 0.467176 8.78498 0.524 8.62714L0.524036 8.62715L0.526049 8.62133L0.550579 8.55047C1.04183 7.18383 1.77453 5.91652 2.71379 4.80889C2.71407 4.80856 2.71435 4.80823 2.71463 4.8079L2.76392 4.7504L2.76393 4.75041L2.76601 4.74795C2.81927 4.685 2.89042 4.63975 2.97001 4.61821C3.04953 4.59669 3.1337 4.59985 3.21138 4.62727C3.21145 4.6273 3.21153 4.62732 3.2116 4.62735L5.52732 5.45115L5.79371 5.54592L6.01222 5.36649C6.80968 4.71163 7.70841 4.19093 8.67316 3.82481L8.93616 3.725L8.98739 3.4484L9.43485 1.03271L9.43485 1.03269C9.44992 0.951343 9.48938 0.876503 9.54799 0.818116L9.19513 0.463876L9.548 0.818114C9.60661 0.759728 9.6816 0.720556 9.76301 0.705809L9.76492 0.705457L9.83928 0.691682C9.83962 0.691619 9.83996 0.691557 9.84031 0.691495C11.2535 0.436167 12.7444 0.436168 14.1576 0.6915C14.1579 0.69156 14.1583 0.691621 14.1586 0.691682L14.233 0.705461L14.2349 0.705805C14.3163 0.720556 14.3913 0.759726 14.4499 0.818114L14.8028 0.463876L14.4499 0.818116C14.5085 0.876472 14.5479 0.951263 14.563 1.03256C14.563 1.03261 14.563 1.03265 14.563 1.03269L15.0076 3.43693L15.0591 3.7155L15.3246 3.81449C16.2967 4.17701 17.1947 4.6983 18.0029 5.36105L18.2214 5.54021L18.4876 5.44547L20.7851 4.62778C20.7854 4.62767 20.7856 4.62757 20.7859 4.62747C20.8638 4.60035 20.9481 4.59736 21.0277 4.61891C21.1076 4.64054 21.1791 4.68587 21.2327 4.74894L21.234 4.7504L21.2837 4.80843C21.2839 4.80871 21.2842 4.80899 21.2844 4.80927C22.2252 5.91549 22.9579 7.18287 23.4472 8.55011C23.4475 8.55091 23.4478 8.55171 23.448 8.55251L23.4718 8.62133L23.4718 8.62134L23.474 8.62743C23.502 8.70519 23.5058 8.78964 23.4846 8.86955C23.4635 8.94937 23.4187 9.02089 23.356 9.07462C23.3559 9.07469 23.3559 9.07475 23.3558 9.07481L21.504 10.6576L21.2898 10.8407L21.3354 11.1187C21.4188 11.6272 21.4619 12.1524 21.4619 12.6718C21.4619 13.191 21.4189 13.7134 21.3353 14.2253ZM6.52595 12.3886C6.52595 15.4146 8.97859 17.8673 12.0046 17.8673C15.0306 17.8673 17.4833 15.4146 17.4833 12.3886C17.4833 9.36258 15.0306 6.90993 12.0046 6.90993C8.97859 6.90993 6.52595 9.36258 6.52595 12.3886Z"
                fill="white"
                stroke="white"
              />
            </svg>
          </ListItemIcon>
          <ListItemText
            sx={{
              ml: -1.2,
              color: selectedModule === "Settings" ? "#174B8B" : "white",
              fontWeight: "bold",
            }}
            primary="Settings"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
          {openSections.setting ? (
            <ExpandLess sx={{ color: "white" }} /> // Setting the icon color to white
          ) : (
            <ExpandMore sx={{ color: "white" }} /> // Setting the icon color to white
          )}
        </ListItemButton>

        <Collapse in={openSections.setting} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{
                pl: leftsidebarExpanded ? 2 : 7,
                fontSize: "12px",
                height: "4vh",
                mb: "12px",
                backgroundColor:
                  selectedModule === "billing" ? "#E4EDF8" : "transparent",
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                  "& .MuiListItemText-root": {
                    color: "#174B8B",
                  },
                  "& svg path": {
                    fill: "#174B8B",
                  },
                },
              }}
              onClick={() => handleModuleClick("billing")}
              component={Link}
              to="/dashboard/billing"
            >
              <div style={{ width: "24px", height: "24px" }}>
                {" "}
                {/* Wrapper with fixed size */}
                <svg
                  width="24" // Fixed width
                  height="24" // Fixed height
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.96 21.6C18.48 23.04 17.16 24 15.6 24H3.6C1.56 24 0 22.44 0 20.4V19.2H3.6H14.64C15.12 20.64 16.44 21.6 18 21.6H18.96ZM20.4 0C22.44 0 24 1.56 24 3.6V4.8H21.6V3.6C21.6 2.88 21.12 2.4 20.4 2.4C19.68 2.4 19.2 2.88 19.2 3.6V19.2H18C17.28 19.2 16.8 18.72 16.8 18V16.8H3.6V3.6C3.6 1.56 5.16 0 7.2 0H20.4ZM7.2 4.8V7.2H15.6V4.8H7.2ZM7.2 9.6V12H14.4V9.6H7.2Z"
                    fill={selectedModule === "billing" ? "#174B8B" : "white"}
                  />
                </svg>
              </div>

              <ListItemText
                primary={"Billing"}
                sx={{
                  marginLeft: "0.9rem",
                  fontSize: "12px",
                  color: selectedModule === "billing" ? "#174B8B" : "white",
                }}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontSize: "15px",
                }}
              />
            </ListItemButton>

            <ListItemButton
              sx={{
                pl: leftsidebarExpanded ? 2 : 7,
                fontSize: "12px",
                height: "4vh",
                mb: "12px",
                backgroundColor:
                  selectedModule === "company-profile"
                    ? "#E4EDF8"
                    : "transparent",
                "&:hover": {
                  backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
                  "& .MuiListItemText-root": {
                    color: "#174B8B", // Color change on hover for text
                  },
                  "& svg path": {
                    fill: "#174B8B", // Color change on hover for SVG
                  },
                },
              }}
              onClick={() => handleModuleClick("company-profile")}
              component={Link}
              to="/dashboard/update-compony"
            >
              <div style={{ width: "24px", height: "24px" }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0V24H10.2857V19.3333H13.7143V24H24V0H0ZM3.42857 2.66667H6.85714V5.33333H3.42857V2.66667ZM10.2857 2.66667H13.7143V5.33333H10.2857V2.66667ZM17.1429 2.66667H20.5714V5.33333H17.1429V2.66667ZM3.42857 8H6.85714V10.6667H3.42857V8ZM10.2857 8H13.7143V10.6667H10.2857V8ZM17.1429 8H20.5714V10.6667H17.1429V8ZM3.42857 13.3333H6.85714V16H3.42857V13.3333ZM10.2857 13.3333H13.7143V16H10.2857V13.3333ZM17.1429 13.3333H20.5714V16H17.1429V13.3333ZM3.42857 18.6667H6.85714V21.3333H3.42857V18.6667ZM17.1429 18.6667H20.5714V21.3333H17.1429V18.6667Z"
                    fill={
                      selectedModule === "company-profile" ? "#174B8B" : "white"
                    }
                  />
                </svg>
              </div>
              <ListItemText
                primary={"Company Profile"}
                sx={{
                  marginLeft: "0.9rem",
                  fontSize: "12px",
                  color:
                    selectedModule === "company-profile" ? "#174B8B" : "white",
                }}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontSize: "15px",
                }}
              />
            </ListItemButton>
            <ListItemButton
              sx={{
                pl: leftsidebarExpanded ? 2 : 7,
                fontSize: "12px",
                height: "4vh",
                mb: "12px",
                backgroundColor:
                  selectedModule === "user" ? "#E4EDF8" : "transparent",
                "&:hover": {
                  backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
                  "& .MuiListItemText-root": {
                    color: "#174B8B", // Color change on hover for text
                  },
                  "& svg path": {
                    fill: "#174B8B", // Color change on hover for SVG
                  },
                },
              }}
              onClick={() => handleModuleClick("user")}
              component={Link}
              to="/dashboard/user-list"
            >
              <div style={{ width: "24px", height: "24px" }}>
                <svg
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.9913 11.9998C14.6482 11.9998 15.9913 13.3429 15.9913 14.9997L15.9897 16.4964C16.1954 20.1695 13.3664 22.0012 8.12024 22.0012C2.89098 22.0012 0 20.1934 0 16.5488V14.9997C0 13.3429 1.34312 11.9998 2.99994 11.9998H12.9913ZM20.9924 11.9998C22.6492 11.9998 23.9923 13.3429 23.9923 14.9997L23.9908 16.0528C24.1717 19.3477 21.6719 20.9996 17.1029 20.9996C16.4826 20.9996 15.8996 20.9694 15.355 20.9089C16.4284 19.9177 17.0026 18.5726 17.0007 16.8728L16.9881 16.4405L16.9913 14.9997C16.9913 13.8046 16.4671 12.7319 15.6362 11.999L20.9924 11.9998ZM7.99985 0C10.7617 0 13.0006 2.2389 13.0006 5.00072C13.0006 7.76254 10.7617 10.0014 7.99985 10.0014C5.23803 10.0014 2.99913 7.76254 2.99913 5.00072C2.99913 2.2389 5.23803 0 7.99985 0ZM17.9997 1.99996C20.2088 1.99996 21.9996 3.79079 21.9996 5.99989C21.9996 8.20899 20.2088 9.99981 17.9997 9.99981C15.7906 9.99981 13.9997 8.20899 13.9997 5.99989C13.9997 3.79079 15.7906 1.99996 17.9997 1.99996Z"
                    fill={selectedModule === "user" ? "#174B8B" : "white"}
                  />
                </svg>
              </div>
              <ListItemText
                primary={"Users"}
                sx={{
                  marginLeft: "0.9rem",
                  fontSize: "12px",
                  color: selectedModule === "user" ? "#174B8B" : "white",
                }}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontSize: "15px",
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton
          sx={{
            height: "4vh",
            mb: "12px",

            "&:hover": {
              backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
              "& .MuiListItemText-root": {
                color: "#174B8B", // Color change on hover for text
              },
              "& svg path": {
                fill: "#174B8B", // Color change on hover for SVG
              },
            },
          }}
          onClick={() => handleSectionClick("configuration")}
          // component={Link}
          // to="/dashboard/contract-list"
        >
          <ListItemIcon>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.41677 0C1.07546 0 0 0.981818 0 2.18182V19.6364C0 20.8473 1.07546 21.8182 2.41677 21.8182H9.66708V19.6364H2.41677V2.18182H10.8755V7.63636H16.9174V10.9091H19.3342V6.54545L12.0839 0M16.9174 13.0909C16.7603 13.0909 16.6274 13.1891 16.6032 13.32L16.3736 14.76C16.0111 14.9018 15.6607 15.0764 15.3465 15.2727L13.8481 14.7273C13.7152 14.7273 13.5581 14.7273 13.4735 14.8691L12.2651 16.7564C12.1926 16.8764 12.2168 17.0182 12.3376 17.1055L13.6185 18C13.5943 18.1855 13.5822 18.36 13.5822 18.5455C13.5822 18.7309 13.5943 18.9055 13.6185 19.0909L12.3376 19.9855C12.2289 20.0727 12.1926 20.2145 12.2651 20.3345L13.4735 22.2218C13.546 22.3636 13.7031 22.3636 13.8481 22.3636L15.3465 21.8182C15.6607 22.0145 15.999 22.2 16.3736 22.3309L16.6032 23.7709C16.6274 23.9018 16.7482 24 16.9174 24H19.3342C19.4671 24 19.6 23.9018 19.6242 23.7709L19.8538 22.3309C20.2163 22.1891 20.5425 22.0145 20.8688 21.8182L22.3551 22.3636C22.5122 22.3636 22.6693 22.3636 22.7539 22.2218L23.9623 20.3345C24.0348 20.2145 23.9985 20.0727 23.8898 19.9855L22.5968 19.0909C22.621 18.9055 22.6451 18.7309 22.6451 18.5455C22.6451 18.36 22.6331 18.1855 22.5968 18L23.8777 17.1055C23.9864 17.0182 24.0227 16.8764 23.9502 16.7564L22.7418 14.8691C22.6693 14.7273 22.5122 14.7273 22.3551 14.7273L20.8688 15.2727C20.5425 15.0764 20.2163 14.8909 19.8417 14.76L19.6121 13.32C19.6 13.1891 19.4671 13.0909 19.3342 13.0909M18.1258 16.9091C19.1287 16.9091 19.9384 17.64 19.9384 18.5455C19.9384 19.4509 19.1287 20.1818 18.1258 20.1818C17.1107 20.1818 16.3132 19.4509 16.3132 18.5455C16.3132 17.64 17.1228 16.9091 18.1258 16.9091Z"
                fill="white"
              />
            </svg>
          </ListItemIcon>
          <ListItemText
            sx={{
              ml: -1.2,
              color: selectedModule === "Settings" ? "#174B8B" : "white",
            }}
            primary="Configuration"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
          {openSections.configuration ? (
            <ExpandLess sx={{ color: "white" }} /> // Setting the icon color to white
          ) : (
            <ExpandMore sx={{ color: "white" }} /> // Setting the icon color to white
          )}
        </ListItemButton>

        <Collapse in={openSections.configuration} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{
                pl: leftsidebarExpanded ? 2 : 7,
                fontSize: "12px",
                height: "4vh",
                mb: "12px",
                backgroundColor:
                  selectedModule === "approval" ? "#E4EDF8" : "transparent",
                "&:hover": {
                  backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
                  "& .MuiListItemText-root": {
                    color: "#174B8B", // Color change on hover for text
                  },
                  "& svg path": {
                    fill: "#174B8B", // Color change on hover for SVG
                  },
                },
              }}
              onClick={() => handleModuleClick("approval")}
              component={Link}
              to="/dashboard/approval-list"
            >
              <div style={{ width: "24px", height: "30px" }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.2769 12.3636L24 14.4145L15.9631 24L11.6923 18.9091L13.4154 16.8582L15.9631 19.8836L22.2769 12.3636ZM8.61539 18.9091L12.3077 23.2727H0V20.3636C0 17.1491 4.40615 14.5455 9.84615 14.5455L12.1723 14.7055L8.61539 18.9091ZM9.84615 0C11.1518 0 12.404 0.612985 13.3273 1.70411C14.2506 2.79523 14.7692 4.2751 14.7692 5.81818C14.7692 7.36126 14.2506 8.84114 13.3273 9.93226C12.404 11.0234 11.1518 11.6364 9.84615 11.6364C8.54047 11.6364 7.28827 11.0234 6.36501 9.93226C5.44176 8.84114 4.92308 7.36126 4.92308 5.81818C4.92308 4.2751 5.44176 2.79523 6.36501 1.70411C7.28827 0.612985 8.54047 0 9.84615 0Z"
                    fill={selectedModule === "approval" ? "#174B8B" : "white"}
                  />
                </svg>
              </div>
              <ListItemText
                primary={"Approvals"}
                sx={{
                  marginLeft: "0.9rem",
                  fontSize: "12px",
                  color: selectedModule === "approval" ? "#174B8B" : "white",
                }}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontSize: "15px",
                }}
              />
            </ListItemButton>
            <ListItemButton
              sx={{
                pl: leftsidebarExpanded ? 2 : 7,
                fontSize: "12px",
                height: "4vh",
                mb: "12px",
                backgroundColor:
                  selectedModule === "categories" ? "#E4EDF8" : "transparent",
                "&:hover": {
                  backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
                  "& .MuiListItemText-root": {
                    color: "#174B8B", // Color change on hover for text
                  },
                  "& svg path": {
                    fill: "#174B8B", // Color change on hover for SVG
                  },
                },
              }}
              component={Link}
              to="/dashboard/category-list"
              onClick={() => handleModuleClick("categories")}
            >
              <div style={{ width: "24px", height: "24px" }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0H10.8V10.8H0V0ZM18.6 0C21.6 0 24 2.4 24 5.4C24 8.4 21.6 10.8 18.6 10.8C15.6 10.8 13.2 8.4 13.2 5.4C13.2 2.4 15.6 0 18.6 0ZM5.4 14.4L10.8 24H0L5.4 14.4ZM20.4 18H24V20.4H20.4V24H18V20.4H14.4V18H18V14.4H20.4V18Z"
                    fill={selectedModule === "categories" ? "#174B8B" : "white"}
                  />
                </svg>
              </div>
              <ListItemText
                primary={"Categories"}
                sx={{
                  marginLeft: "0.9rem",
                  fontSize: "12px",
                  color: selectedModule === "categories" ? "#174B8B" : "white",
                }}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontSize: "15px",
                }}
              />
            </ListItemButton>

            <ListItemButton
              sx={{
                pl: leftsidebarExpanded ? 2 : 7,
                fontSize: "12px",
                height: "4vh",
                mb: "12px",
                backgroundColor:
                  selectedModule === "clauses" ? "#E4EDF8" : "transparent",
                "&:hover": {
                  backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
                  "& .MuiListItemText-root": {
                    color: "#174B8B", // Color change on hover for text
                  },
                  "& svg path": {
                    fill: "#174B8B", // Color change on hover for SVG
                  },
                },
              }}
              component={Link}
              to="/dashboard/clauses-list"
              onClick={() => handleModuleClick("clauses")}
            >
              <div style={{ width: "24px", height: "24px" }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.6923 12.6316C20.5538 12.6316 21.3785 12.7958 22.1538 13.0737V7.57895L14.7692 0H2.46154C1.09538 0 0 1.12421 0 2.52632V20.2105C0 21.6126 1.10769 22.7368 2.46154 22.7368H12.7385C12.4677 21.9411 12.3077 21.0947 12.3077 20.2105C12.3077 16.0295 15.6185 12.6316 19.6923 12.6316ZM13.5385 1.89474L20.3077 8.8421H13.5385V1.89474ZM24 18L18.1538 24L14.7692 20.2105L16.1969 18.7453L18.1538 20.7537L22.5723 16.2189L24 18Z"
                    fill={selectedModule === "clauses" ? "#174B8B" : "white"}
                  />
                </svg>
              </div>
              <ListItemText
                primary={"Clauses"}
                sx={{
                  marginLeft: "0.9rem",
                  fontSize: "12px",
                  color: selectedModule === "clauses" ? "#174B8B" : "white",
                }}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontSize: "15px",
                }}
              />
            </ListItemButton>
            <ListItemButton
              sx={{
                pl: leftsidebarExpanded ? 2 : 7,
                fontSize: "12px",
                height: "4vh",
                mb: "12px",
                backgroundColor:
                  selectedModule === "custom-feild" ? "#E4EDF8" : "transparent",
                "&:hover": {
                  backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
                  "& .MuiListItemText-root": {
                    color: "#174B8B", // Color change on hover for text
                  },
                  "& svg path": {
                    fill: "#174B8B", // Color change on hover for SVG
                  },
                },
              }}
              component={Link}
              to="/dashboard/feild-list"
              onClick={() => handleModuleClick("custom-feild")}
            >
              <div style={{ width: "24px", height: "24px" }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6H24V18H18V20.4C18 20.7183 18.1264 21.0235 18.3515 21.2485C18.5765 21.4736 18.8817 21.6 19.2 21.6H21.6V24H18.6C17.94 24 16.8 23.46 16.8 22.8C16.8 23.46 15.66 24 15 24H12V21.6H14.4C14.7183 21.6 15.0235 21.4736 15.2485 21.2485C15.4736 21.0235 15.6 20.7183 15.6 20.4V3.6C15.6 3.28174 15.4736 2.97652 15.2485 2.75147C15.0235 2.52643 14.7183 2.4 14.4 2.4H12V0H15C15.66 0 16.8 0.54 16.8 1.2C16.8 0.54 17.94 0 18.6 0H21.6V2.4H19.2C18.8817 2.4 18.5765 2.52643 18.3515 2.75147C18.1264 2.97652 18 3.28174 18 3.6V6ZM0 6H13.2V8.4H2.4V15.6H13.2V18H0V6ZM21.6 15.6V8.4H18V15.6H21.6Z"
                    fill={
                      selectedModule === "custom-feild" ? "#174B8B" : "white"
                    }
                  />
                </svg>
              </div>
              <ListItemText
                primary={"Custom Fields"}
                sx={{
                  marginLeft: "0.9rem",
                  fontSize: "12px",
                  color:
                    selectedModule === "custom-feild" ? "#174B8B" : "white",
                }}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontSize: "15px",
                }}
              />
            </ListItemButton>
            <ListItemButton
              sx={{
                pl: leftsidebarExpanded ? 2 : 7,
                fontSize: "12px",
                height: "4vh",
                mb: "12px",
                backgroundColor:
                  selectedModule === "roles" ? "#E4EDF8" : "transparent",
                "&:hover": {
                  backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
                  "& .MuiListItemText-root": {
                    color: "#174B8B", // Color change on hover for text
                  },
                  "& svg path": {
                    fill: "#174B8B", // Color change on hover for SVG
                  },
                },
              }}
              component={Link}
              to="/dashboard/role-list"
              onClick={() => handleModuleClick("roles")}
            >
              {" "}
              <div style={{ width: "24px", height: "24px" }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 9V12H9V15H7V12H5.8C5.4 13.8 4.3 15 3 15C1.3 15 0 13.05 0 10.5C0 7.95 1.3 6 3 6C4.3 6 5.4 7.2 5.8 9H11ZM3 9C2.4 9 2 9.6 2 10.5C2 11.4 2.4 12 3 12C3.6 12 4 11.4 4 10.5C4 9.6 3.6 9 3 9ZM16 15C18.7 15 24 16.95 24 21V24H8V21C8 16.95 13.3 15 16 15ZM16 12C13.8 12 12 9.3 12 6C12 2.7 13.8 0 16 0C18.2 0 20 2.7 20 6C20 9.3 18.2 12 16 12Z"
                    fill={selectedModule === "roles" ? "#174B8B" : "white"}
                  />
                </svg>
              </div>
              <ListItemText
                primary={"Roles"}
                sx={{
                  marginLeft: "0.9rem",
                  fontSize: "12px",
                  color: selectedModule === "roles" ? "#174B8B" : "white",
                }}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontSize: "15px",
                }}
              />
            </ListItemButton>
            <ListItemButton
              sx={{
                pl: leftsidebarExpanded ? 2 : 7,
                fontSize: "12px",
                height: "4vh",
                mb: "12px",
                backgroundColor:
                  selectedModule === "teams" ? "#E4EDF8" : "transparent",
                "&:hover": {
                  backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
                  "& .MuiListItemText-root": {
                    color: "#174B8B", // Color change on hover for text
                  },
                  "& svg path": {
                    fill: "#174B8B", // Color change on hover for SVG
                  },
                },
              }}
              onClick={() => handleModuleClick("teams")}
              component={Link}
              to="/dashboard/teamlist"
            >
              <div style={{ width: "24px", height: "24px" }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.42874 3.42852C3.42874 1.535 4.96374 0 6.85726 0C8.75077 0 10.2858 1.535 10.2858 3.42852C10.2858 4.5338 9.76275 5.51693 8.95071 6.1439C8.92628 6.16192 8.90201 6.18016 8.8779 6.19859C8.31127 6.61263 7.6128 6.85703 6.85726 6.85703C4.96374 6.85703 3.42874 5.32203 3.42874 3.42852Z"
                    fill="white"
                  />
                  <path
                    d="M15.049 6.1439C15.0734 6.16192 15.0977 6.18016 15.1218 6.1986C15.6884 6.61265 16.3869 6.85703 17.1424 6.85703C19.036 6.85703 20.5709 5.32203 20.5709 3.42852C20.5709 1.535 19.036 0 17.1424 0C15.2489 0 13.7139 1.535 13.7139 3.42852C13.7139 4.5338 14.2369 5.51693 15.049 6.1439Z"
                    fill="white"
                  />
                  <path
                    d="M9.02971 8.57128C9.62252 7.5465 10.7305 6.85703 11.9996 6.85703C13.2686 6.85703 14.3766 7.5465 14.9694 8.57128C15.2611 9.07557 15.4281 9.66105 15.4281 10.2855C15.4281 12.1791 13.8931 13.7141 11.9996 13.7141C10.106 13.7141 8.57104 12.1791 8.57104 10.2855C8.57104 9.66105 8.738 9.07557 9.02971 8.57128Z"
                    fill="white"
                  />
                  <path
                    d="M2.57135 8.57126H7.14967C6.96014 9.10744 6.85703 9.68443 6.85703 10.2855C6.85703 11.6027 7.35219 12.8042 8.16654 13.714H7.71413C5.85392 13.714 4.27056 14.8993 3.67789 16.5556C3.09511 16.3185 2.55592 16.0087 2.07794 15.6251C0.786793 14.5888 0 13.0559 0 11.1426C0 9.72257 1.15123 8.57126 2.57135 8.57126Z"
                    fill="white"
                  />
                  <path
                    d="M16.2858 13.714C18.1459 13.714 19.7294 14.8992 20.322 16.5556C20.9048 16.3185 21.444 16.0087 21.9221 15.6251C23.2131 14.5888 23.9999 13.0559 23.9999 11.1426C23.9999 9.7225 22.8486 8.57126 21.4285 8.57126H16.8503C17.0397 9.10744 17.1429 9.68443 17.1429 10.2855C17.1429 11.6027 16.6476 12.8042 15.8334 13.714H16.2858Z"
                    fill="white"
                  />
                  <path
                    d="M18.6628 17.0192C18.7875 17.3214 18.8564 17.6526 18.8564 17.9997C18.8564 19.913 18.0695 21.4459 16.7785 22.4822C15.5077 23.5022 13.8046 23.9996 11.9993 23.9996C10.1941 23.9996 8.49097 23.5022 7.22024 22.4822C5.9291 21.4459 5.1423 19.913 5.1423 17.9997C5.1423 17.6526 5.21113 17.3214 5.33588 17.0192C5.72135 16.0854 6.64075 15.4283 7.71366 15.4283H16.285C17.3579 15.4283 18.2773 16.0854 18.6628 17.0192Z"
                    fill={selectedModule === "teams" ? "#174B8B" : "white"}
                  />
                </svg>
              </div>
              <ListItemText
                primary={"Teams"}
                sx={{
                  marginLeft: "0.9rem",
                  fontSize: "12px",
                  color: selectedModule === "teams" ? "#174B8B" : "white",
                }}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontSize: "15px",
                }}
              />
            </ListItemButton>

            <ListItemButton
              sx={{
                pl: leftsidebarExpanded ? 2 : 7,
                fontSize: "12px",
                height: "4vh",
                mb: "12px",
                backgroundColor:
                  selectedModule === "tags" ? "#E4EDF8" : "transparent",
                "&:hover": {
                  backgroundColor: "#FFFFFF", // Example hover background color, adjust as needed
                  "& .MuiListItemText-root": {
                    color: "#174B8B", // Color change on hover for text
                  },
                  "& svg path": {
                    fill: "#174B8B", // Color change on hover for SVG
                  },
                },
              }}
              onClick={() => handleModuleClick("tags")}
              component={Link}
              to="/dashboard/tags-list"
            >
              <div style={{ width: "24px", height: "24px" }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.2 7.5C4.67739 7.5 5.13523 7.26295 5.47279 6.84099C5.81036 6.41903 6 5.84674 6 5.25C6 4.65326 5.81036 4.08097 5.47279 3.65901C5.13523 3.23705 4.67739 3 4.2 3C3.72261 3 3.26477 3.23705 2.92721 3.65901C2.58964 4.08097 2.4 4.65326 2.4 5.25C2.4 5.84674 2.58964 6.41903 2.92721 6.84099C3.26477 7.26295 3.72261 7.5 4.2 7.5ZM18.492 11.37C18.924 11.91 19.2 12.66 19.2 13.5C19.2 14.325 18.936 15.075 18.492 15.615L12.492 23.115C12.06 23.655 11.46 24 10.8 24C10.14 24 9.54 23.67 9.096 23.115L0.708 12.63C0.264 12.075 0 11.325 0 10.5V3C0 1.335 1.068 0 2.4 0H8.4C9.06 0 9.66 0.33 10.092 0.87L18.492 11.37ZM13.848 2.565L15.048 1.065L23.292 11.37C23.736 11.91 24 12.675 24 13.5C24 14.325 23.736 15.075 23.304 15.615L16.848 23.685L15.648 22.185L22.5 13.5L13.848 2.565Z"
                    fill={selectedModule === "tags" ? "#174B8B" : "white"}
                  />
                </svg>
              </div>
              <ListItemText
                primary={"Tags"}
                sx={{
                  marginLeft: "0.9rem",
                  fontSize: "12px",
                  color: selectedModule === "tags" ? "#174B8B" : "white",
                }}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontSize: "15px",
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton>
          <ListItemIcon>
            <div style={{ width: "24px", height: "24px" }}>
              <svg
                width="24"
                height="23"
                viewBox="0 0 24 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.8 0.800006C12.8 0.566726 12.6982 0.345078 12.5211 0.193094C12.3442 0.0411103 12.1098 -0.0260579 11.879 0.00919006L0.67912 1.72119C0.288512 1.7809 0 2.11685 0 2.51201V19.888C0 20.283 0.288448 20.619 0.679008 20.6789L11.879 22.3925C12.1096 22.4277 12.3442 22.3606 12.5211 22.2086C12.6981 22.0566 12.8 21.8349 12.8 21.6016V11.2H21.0755L19.4805 12.5979C19.1486 12.889 19.1149 13.3942 19.4054 13.7269C19.6958 14.0594 20.2005 14.093 20.5325 13.8021L23.7272 11.0021C23.9006 10.8502 24 10.6307 24 10.4C24 10.1693 23.9006 9.94986 23.7272 9.79796L20.5325 6.99796C20.2005 6.70701 19.6958 6.74071 19.4054 7.07321C19.1149 7.40572 19.1486 7.91113 19.4805 8.20209L21.0757 9.60002H12.8V0.800006ZM8.8 13.2C8.13726 13.2 7.6 12.6627 7.6 12C7.6 11.3373 8.13726 10.8 8.8 10.8C9.46274 10.8 10 11.3373 10 12C10 12.6627 9.46274 13.2 8.8 13.2Z"
                  fill="white"
                />
                <path
                  d="M15.1999 20.8H14.3999V12.8H15.9999V20C15.9999 20.4418 15.6417 20.8 15.1999 20.8Z"
                  fill="white"
                />
                <path
                  d="M14.3999 7.99998V1.59998H15.1999C15.6417 1.59998 15.9999 1.95815 15.9999 2.39998V7.99998H14.3999Z"
                  fill="white"
                />
              </svg>
            </div>
          </ListItemIcon>
          <ListItemText
            sx={{
              ml: -1.2,
              color: selectedModule === "logout" ? "#174B8B" : "white",
            }}
            primary="logout"
            onClick={() => {
              navigate(`/`);
              logout();
            }}
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <div style={{ display: "flex", background: "#E4EDF8" }}>
      <CssBaseline />
      {editorDashboardSegment !== "editor-dahsbord" && (
        <AppBar
          position="fixed"
          sx={{
            height: "6.4vh",
            bgcolor: "#FFFFFF",
            zIndex: (theme: any) => theme.zIndex.drawer + 1, // Ensure AppBar is above the Drawer
            width: { sm: `calc(100% - ${drawerWidth}px)` }, // Adjust the width on larger screens
            ml: { sm: `${drawerWidth}px` }, // Push the AppBar to the right on larger screens
          }}
        >
          <Toolbar sx={{ hight: "5vh" }}>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ marginRight: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              color={"#4B4B4B"}
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            ></Typography>
            <IconButton>
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton>
              <div>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  id={menuId}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={isMenuOpen}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate(`/dashboard/user-detail/${user?._id}`); // Use menuState.row._id
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate(`/dashboard/profile-setting`); // Use menuState.row._id
                    }}
                  >
                    Settings
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate(`/`);
                      logout();
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </IconButton>
          </Toolbar>
        </AppBar>
      )}
      <Box
        component="nav"
        sx={{
          background: "#E4EDF8",
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        {!leftSideBar && (
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        )}
        <Drawer
          container={window.document.body}
          variant="temporary"
          open={mobileOpen && leftSideBar}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            background: "red",
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "#174B8B",
            },
          }}
          open={leftSideBar}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          background: "#F8FAFD",
          flexGrow: 1,

          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {editorDashboardSegment !== "editor-dahsbord" && <Toolbar />}
        {/* routes  */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teamlist" element={<TeamsList />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/team-edit/:id" element={<UpdateTeam />} />
          <Route path="/create-branch" element={<CreateBranch />} />
          <Route path="/branchlist" element={<BranchList />} />
          <Route path="/branch-edit/:id" element={<UpdateBranch />} />
          <Route path="/branch-detail/:id" element={<DetailBranch />} />
          <Route path="/user-list" element={<UserList />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/create-password/:token" element={<ResetPassword />} />
          <Route path="/user-edit/:id" element={<UpdateUser />} />
          <Route path="/user-update-user/:id" element={<UserEdit />} />
          <Route path="/user-detail/:id" element={<UserDetail />} />
          <Route
            path="/user-detail-single/:id"
            element={<UserDetailSingleUser />}
          />
          <Route path="/profile-setting" element={<Setting />} />

          <Route path="/login-history" element={<LoginHistory />} />

          <Route path="/category-list" element={<CategoryList />} />
          <Route path="/create-cetegory" element={<CreateCategory />} />
          <Route path="/update-cetegory/:id" element={<UpdateCategory />} />

          <Route path="/create-tags" element={<CreateTags />} />
          <Route path="/tags-list" element={<TagList />} />
          <Route path="/update-tags/:id" element={<UpdateTags />} />

          <Route path="/create-clauses" element={<CreateClauses />} />
          <Route path="/clauses-list" element={<ClausesList />} />
          <Route path="/update-clauses/:id" element={<UpdateClauses />} />

          <Route path="/compony-list" element={<ComponyList />} />
          <Route path="/update-compony" element={<UpdateCompony />} />

          <Route path="/Upload-folder/:id" element={<Upload />} />
          <Route path="/folder-list" element={<FolderLIst />} />

          <Route path="/template-list" element={<TemplateList />} />
          <Route path="/create-template" element={<CreateTemplate />} />
          <Route path="/update-template/:id" element={<UpdateTemplate />} />

          <Route path="/feild-list" element={<FieldList />} />

          <Route path="/approval-list" element={<ApprovalList />} />
          <Route path="/create-approval" element={<CreateApproval />} />
          <Route path="/update-approval/:id" element={<UpdateApproval />} />

          <Route path="/contract-list" element={<ContractList />} />
          <Route path="/create-contract" element={<CreateContract />} />
          <Route path="/editor-dahsbord" element={<TinyDahsbord />} />
          <Route path="/editor-dahsbord/open" element={<TinyDahsbord />} />
          <Route path="/sub-page-1" element={<SubPage1 />} />
          <Route path="/billing" element={<CardsSubscription />} />

          <Route path="/role-list" element={<RoleList />} />
          <Route path="/crete-custom-role/:id" element={<CreateCustomRole />} />
          <Route path="/crete-custom-role" element={<CreateCustomRole />} />
          <Route path="/system-role" element={<SystemsRole />} />
          <Route path="/editor" element={<CustomTextEditor />} />
          <Route path="/test" element={<CustomTextEditor />} />
        </Routes>
      </Box>
    </div>
  );
}
