/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
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
// import userIcon from "../assets/userLogo.png";
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
// Usage: <ArticleIcon />

// Usage: <AssignmentIcon />

const drawerWidth = 240;
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
  });
  const statuses = [
    "All",
    "Draft",
    "Review",
    "Signature pending",
    "Signed",
    "Active",
  ];
  const expireDate = [
    "All",
    "Next 30 days",
    "Next 60 days",
    "Next 90 days",
    "Expired/Terminated",
    "Active",
  ];
  const ExpireColors: any = {
    All: "#155BE5",
    "Next 30 days": "#FFAA04",
    "Next 60 days": "#725FE7",
    "Next 90 days": "#CDAD00",
    "Expired/Terminated": "#BC3D89",

    // Add more status-color mappings as needed
  };
  const statusColors: any = {
    All: "#155BE5",
    Draft: "#FFAA04",
    Review: "#725FE7",
    "Signature pending": "#CDAD00",
    Signed: "#BC3D89",
    Active: "#3F9748",
    // Add more status-color mappings as needed
  };
  // Properly type the section parameter
  const handleSectionClick = (section: keyof any) => {
    setOpenSections((prevSections: any) => ({
      ...prevSections,
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
  };

  const handleStatusClick = (newStatus: string) => {
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
      <Toolbar sx={{ justifyContent: "center", height: "64px" }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            maxWidth: isMobile ? "100px" : "220px",
            marginTop: "16px",
          }}
        />
      </Toolbar>
      <Divider />
      <List onClick={handleDrawerToggle}>
        <ListItemButton onClick={() => handleSectionClick("dashboard")}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
          {openSections.dashboard ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        {/* Collapsible sub-items */}
        <Collapse in={openSections.dashboard} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              component={Link}
              to="/dashboard/sub-page-1"
            >
              <ListItemText
                primary="Sub Page 1"
                primaryTypographyProps={{ variant: "subtitle2" }}
              />
            </ListItemButton>
            {/* You can add more sub-items here */}
          </List>
        </Collapse>

        <ListItemButton
          onClick={() => handleSectionClick("contract")}
          component={Link}
          to="/dashboard/contract-list"
        >
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText
            primary="Contract"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
          {openSections.contract ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        {/* Collapsible sub-items */}
        <Collapse in={openSections.contract} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {statuses?.map((statusItem) => (
              <ListItemButton
                key={statusItem}
                sx={{ pl: 4 }}
                onClick={() => handleStatusClick(statusItem)}
              >
                <div
                  style={{
                    height: "10px",
                    width: "10px",
                    backgroundColor: statusColors[statusItem],
                    borderRadius: "50%",
                    marginRight: "10px",
                    alignSelf: "center",
                  }}
                />
                <ListItemText
                  primary={statusItem}
                  sx={{
                    color:
                      statusItem === contractStatus.status
                        ? "#1976d2"
                        : "initial",
                  }}
                  primaryTypographyProps={{ variant: "subtitle2" }}
                />
              </ListItemButton>
            ))}
            <ListItemButton
              key="expireItem"
              sx={{
                pl: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onClick={handleToggleExpire}
            >
              <ListItemText
                primary="Expire"
                primaryTypographyProps={{ variant: "subtitle2" }}
              />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {/* Sublist items */}
                {expireDate?.map((expireItem) => (
                  <ListItemButton
                    key={expireItem}
                    sx={{ pl: 4 }}
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
                      primaryTypographyProps={{ variant: "subtitle2" }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>
        </Collapse>

        <ListItemButton component={Link} to="/dashboard">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primary="Home"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/contract-list">
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText
            primary="Contracts"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/teamlist">
          <ListItemIcon>
            <GroupsIcon />
          </ListItemIcon>
          <ListItemText
            primary="Teams"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/branchlist">
          <ListItemIcon>
            <AccountTreeIcon />
          </ListItemIcon>
          <ListItemText
            primary="Branches"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>

        <ListItemButton component={Link} to="/dashboard/user-list">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText
            primary="Users"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/role-list">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText
            primary="Roles"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/billing">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText
            primary="Billing"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/approval-list">
          <ListItemIcon>
            <HowToRegIcon />
          </ListItemIcon>
          <ListItemText
            primary="Approvals"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/category-list">
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText
            primary="Categories"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/tags-list">
          <ListItemIcon>
            <LocalOfferIcon />
          </ListItemIcon>
          <ListItemText
            primary="Tags"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/clauses-list">
          <ListItemIcon>
            <TaskIcon />
          </ListItemIcon>
          <ListItemText
            primary="Clauses"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>

        <ListItemButton component={Link} to="/dashboard/folder-list">
          <ListItemIcon>
            <FolderOpenIcon />
          </ListItemIcon>
          <ListItemText
            primary="Folders"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>

        <ListItemButton component={Link} to="/dashboard/template-list">
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText
            primary="Templates"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/feild-list">
          <ListItemIcon>
            <InputIcon />
          </ListItemIcon>
          <ListItemText
            primary="Custom Fields"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/update-compony">
          <ListItemIcon>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText
            primary="Company Profile"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#FFFFFF",
          zIndex: (theme: any) => theme.zIndex.drawer + 1, // Ensure AppBar is above the Drawer
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // Adjust the width on larger screens
          ml: { sm: `${drawerWidth}px` }, // Push the AppBar to the right on larger screens
        }}
      >
        <Toolbar>
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
          >
            Dashboard
          </Typography>
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
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
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
          <Route path="/sub-page-1" element={<SubPage1 />} />
          <Route path="/billing" element={<CardsSubscription />} />

          <Route path="/role-list" element={<RoleList />} />
          <Route path="/crete-custom-role/:id" element={<CreateCustomRole />} />
          <Route path="/crete-custom-role" element={<CreateCustomRole />} />
          <Route path="/system-role" element={<SystemsRole />} />
          <Route path="/editor" element={<CustomTextEditor />} />
        </Routes>
      </Box>
    </Box>
  );
}
