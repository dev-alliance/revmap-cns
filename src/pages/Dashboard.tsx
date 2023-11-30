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

const drawerWidth = 240;
export default function Dashboard() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOptionClick = (option: string) => {
    console.log(option + " clicked");
    // You can add logic here for different options
    handleMenuClose();
  };

  const menuId = "primary-account-menu";
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClick = () => {
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
      <List>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        {/* Collapsible sub-items */}
        <Collapse in={open} timeout="auto" unmountOnExit>
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
        <ListItemButton component={Link} to="/dashboard">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primary="Home"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard/teamlist">
          <ListItemIcon>
            <GroupsIcon />
          </ListItemIcon>
          <ListItemText
            primary="Team"
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
        {/* <ListItemButton component={Link} to="/dashboard/category-list">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText
            primary="Category"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItemButton> */}

        {/* Main collapsible list item */}

        {/* Add more links or collapsible items if you have more pages */}
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
          zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure AppBar is above the Drawer
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // Adjust the width on larger screens
          ml: { sm: `${drawerWidth}px` }, // Push the AppBar to the right on larger screens
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
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
        <Drawer
          container={window.document.body}
          variant="temporary"
          open={mobileOpen}
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
          open
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
          <Route path="/user-list" element={<UserList />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/create-password/:token" element={<ResetPassword />} />
          <Route path="/user-edit/:id" element={<UpdateUser />} />
          <Route path="/user-update-user/:id" element={<UserEdit />} />
          <Route path="/user-detail/:id" element={<UserDetail />} />
          <Route path="/profile-setting" element={<Setting />} />
          <Route path="/login-history" element={<LoginHistory />} />
          <Route path="/category-list" element={<CategoryList />} />
          <Route path="/sub-page-1" element={<SubPage1 />} />
        </Routes>
      </Box>
    </Box>
  );
}
