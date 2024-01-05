/* eslint-disable @typescript-eslint/no-explicit-any */
// ** React Imports
import { useContext, useEffect, useMemo, useState } from "react";

// ** Next Import
// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// ** Third Party Imports
import logo from "@/assets/team_icon.svg";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useNavigate } from "react-router-dom";
import {
  archiveTeam,
  deleteUser,
  getUserList,
  updateStatus,
} from "@/service/api/apiMethods";
import AddIcon from "@mui/icons-material/Add";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
interface CellType {
  row: any;
  _id: any;
}
const Img = styled("img")(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  marginRight: theme.spacing(3),
}));
interface RowType {
  category: string;
  status: boolean;
  type: string;
  display_name: string;
  description: string;
}

// ** Styled components

const defaultColumns: any[] = [
  {
    flex: 0.3,
    field: "name ",
    minWidth: 230,
    headerName: "User Name",
    headerAlign: "left",
    renderCell: ({ row }: any) => {
      const { name } = row;
      return (
        <Box sx={{ display: "flex" }}>
          <Img src={logo} />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              {name}
            </Typography>
          </Box>
        </Box>
      );
    },
  },

  {
    flex: 0.2,
    minWidth: 125,
    field: "job",
    headerName: "Job Title ",

    renderCell: ({ row }: { row: any }) => {
      const { job } = row;
      return <Typography sx={{ color: "text.secondary" }}>{job}</Typography>;
    },
  },

  {
    flex: 0.2,
    minWidth: 130,
    field: "team",
    headerName: "Team ",

    renderCell: ({ row }: { row: any }) => {
      return (
        <Typography sx={{ color: "text.secondary" }}>
          {row?.team || "-"}
        </Typography>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 130,
    field: "branch",
    headerName: "Branch ",

    renderCell: ({ row }: { row: any }) => {
      return (
        <Typography sx={{ color: "text.secondary" }}>
          {row?.branch || "-"}
        </Typography>
      );
    },
  },

  // {
  //   flex: 0.2,
  //   minWidth: 200,
  //   field: "loginHistory",
  //   headerName: "Last Login",
  //   renderCell: ({ row }: { row: any }) => {
  //     const createdAt = new Date(row?.createdAt);

  //     // Check if createdAt is a valid date
  //     if (isNaN(createdAt.getTime())) {
  //       return <Typography sx={{ color: "text.secondary" }}>-</Typography>;
  //     }

  //     const formattedDate = createdAt.toLocaleString("en-US", {
  //       day: "numeric",
  //       month: "short",
  //       year: "numeric",
  //       hour: "numeric",
  //       minute: "numeric",
  //       hour12: true,
  //     });

  //     return (
  //       <Typography sx={{ color: "text.secondary" }}>
  //         {formattedDate}
  //       </Typography>
  //     );
  //   },
  // },

  {
    flex: 0.2,
    minWidth: 125,
    field: "status",
    headerName: "Status",
    renderCell: ({ row }: { row: any }) => (
      <>
        <Chip
          size="small"
          variant="outlined"
          label={
            row.status === "Active"
              ? "Active"
              : row.status === "Archived"
              ? "Archived"
              : "Inactive"
          }
          sx={{
            fontSize: "14px",
            // fontWeight: "bold",
            backgroundColor:
              row.status === "Active"
                ? "#D3FDE4"
                : row.status === "Archived"
                ? "#FFF7CB"
                : "#FFCBCB",
            color:
              row.status === "Active"
                ? "#3F9748"
                : row.status === "Archived"
                ? "#D32F2F"
                : "#red",
            borderColor:
              row.status === "Active"
                ? "#D3FDE4"
                : row.status === "Archived"
                ? "#FFF7CB"
                : "#FFCBCB", // Optional: to match border color with background
            "& .MuiChip-label": {
              // This targets the label inside the chip for more specific styling
              color:
                row.status === "Active"
                  ? "#3F9748"
                  : row.status === "Archived"
                  ? "#D36A2F"
                  : "#D32F2F",
            },
          }}
        />
      </>
    ),
  },
  {
    flex: 0.2,
    minWidth: 300,
    field: "email",
    headerName: "Email",
    renderCell: ({ row }: { row: any }) => {
      const { email } = row;
      return <Typography sx={{ color: "text.secondary" }}>{email}</Typography>;
    },
  },
];

const UserList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // ** State
  const [search, setSearch] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [catategorylist, setCategorylist] = useState<Array<any>>([]);

  const [menuState, setMenuState] = useState<{
    anchorEl: null | HTMLElement;
    row: CellType | null;
  }>({
    anchorEl: null,
    row: null,
  });

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: CellType
  ) => {
    setMenuState({ anchorEl: event.currentTarget, row: row });
  };

  const handleClose = () => {
    setMenuState({ anchorEl: null, row: null });
  };

  // ** Hooks

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getUserList(user?._id);
      console.log({ data });

      const transformedData = data.map((row: any, index: number) => ({
        ...row,
        id: index,
        name: `${row?.firstName || ""} ${row?.lastName || ""}`,
        team: `${row?.team?.name || ""} `,
        branch: `${row?.branch?.branchName || ""}`,
        // members: row.members ? row.members.length : "",
      }));
      setCategorylist(transformedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const ITEM_HEIGHT = 48;

  const handleActive = async (id: any) => {
    try {
      if (
        window.confirm("Are you sure you want to change the status this user?")
      ) {
        setIsLoading(true);
        const res = await updateStatus(id, { status: "Active" });
        console.log({ res });

        if (res.ok === true) {
          toast.success(res.message);
          listData();
        } else {
          toast.error(res?.message || "");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleInactive = async (id: any) => {
    try {
      if (
        window.confirm("Are you sure you want to change the status this user?")
      ) {
        setIsLoading(true);
        const res = await updateStatus(id, { status: "Inactive" });
        console.log({ res });

        if (res.ok === true) {
          toast.success(res.message);
          listData();
        } else {
          toast.error(res?.message || "");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async (id: any) => {
    try {
      if (window.confirm("Are you sure you want to delete the user?")) {
        setIsLoading(true);
        const res = await deleteUser(id);
        if (res.ok === true) {
          toast.success(res.message);
          listData();
        } else {
          toast.error(res?.message || "");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) listData();
  }, [user?._id]);

  console.log(search, "serch");

  const filteredList = useMemo(() => {
    let result = catategorylist;
    if (search?.trim().length) {
      result = result.filter((item) =>
        item.name?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }
    return result;
  }, [search, catategorylist]);

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.02,
      minWidth: 100,
      sortable: false,
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      renderCell: ({ row }: CellType) => (
        <div>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={(e) => handleClick(e, row)} // Pass the current row here
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={menuState.anchorEl}
            open={Boolean(menuState.anchorEl)}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: "20ch",
              },
            }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                navigate(`/dashboard/user-edit/${menuState.row?._id}`); // Use menuState.row._id
              }}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                handleActive(menuState.row?._id); // Use menuState.row._id
              }}
            >
              Active
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                handleInactive(menuState.row?._id); // Use menuState.row._id
              }}
            >
              Inactive
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDelete(menuState.row?._id); // Use menuState.row._id
                handleClose();
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </div>
      ),
    },
  ];

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <CardHeader title="Users" />
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ pl: 2.2, mt: -2, mb: 2, fontSize: "13px" }}
          >
            <Link to="/dashboard/user-list" className="link-no-underline">
              Home
            </Link>
            {/* <Typography color="text.primary">Categories</Typography> */}
          </Breadcrumbs>
          <Card>
            <Box
              sx={{
                pl: 3,
                p: 2,
                pr: 3,
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    value={search}
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Box>
              </div>

              <div>
                <Button
                  sx={{ ml: 2, textTransform: "none" }}
                  variant="contained"
                  component={Link}
                  to="/dashboard/create-user"
                >
                  <AddIcon /> Add User
                </Button>
              </div>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            ></Box>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "50vh",
                }}
              >
                {" "}
                <ProgressCircularCustomization />
              </Box>
            ) : (
              <DataGrid
                style={{ height: 500 }} // Set a fixed height
                pagination
                rows={filteredList || []}
                columns={columns}
                pageSizeOptions={[7, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
                getRowId={(row) => row._id}
              />
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default UserList;
