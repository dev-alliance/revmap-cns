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
import AddIcon from "@mui/icons-material/Add";
// ** Third Party Imports

import toast from "react-hot-toast";

import Button from "@mui/material/Button";
import { FormControl } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  archiveBranch,
  deleteBranch,
  getBranchList,
} from "@/service/api/apiMethods";
// import MenuButton from "@/components/MenuButton";

interface CellType {
  row: any;
  _id: any;
}
interface CheckedState {
  name: boolean;
  manager: boolean;
  status: boolean;
  activeContract: boolean;
  annualValue: boolean;
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

const defaultColumns: GridColDef[] = [
  {
    flex: 0.2,
    field: "branchName",
    minWidth: 200,
    headerName: "Branch Name",
    renderCell: ({ row }: any) => {
      const { branchName } = row;

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <Img src={checkImageFormat(row?.image?.path)} /> */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ color: "text.secondary" }}>
              {branchName}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 125,
    field: "state",
    headerName: "Region/State",

    renderCell: ({ row }: { row: any }) => {
      const { state } = row;
      return <Typography sx={{ color: "text.secondary" }}>{state}</Typography>;
    },
  },
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
            row.status === "active"
              ? "Active"
              : row.status === "archived"
              ? "Archived"
              : "Inactive"
          }
          sx={{
            backgroundColor:
              row.status === "active"
                ? "#D3FDE4"
                : row.status === "archived"
                ? "#FFF7CB"
                : "#D32F2F",
            color:
              row.status === "active"
                ? "#3F9748"
                : row.status === "archived"
                ? "#D36A2F"
                : "#FFCBCB",
            borderColor:
              row.status === "active"
                ? "#D3FDE4"
                : row.status === "archived"
                ? "#FFF7CB"
                : "#D32F2F", // Optional: to match border color with background
            "& .MuiChip-label": {
              // This targets the label inside the chip for more specific styling
              color:
                row.status === "active"
                  ? "#3F9748"
                  : row.status === "archived"
                  ? "#D36A2F"
                  : "#FFCBCB",
            },
          }}
        />
      </>
    ),
  },

  // {
  //   flex: 0.2,
  //   minWidth: 125,
  //   field: "branchId",
  //   headerName: "Branch ID",
  //   renderCell: ({ row }: { row: any }) => {
  //     const { branchId } = row;
  //     return (
  //       <Typography sx={{ color: "text.secondary" }}>{`${
  //         branchId || ""
  //       }`}</Typography>
  //     );
  //   },
  // },
  {
    flex: 0.2,
    minWidth: 125,
    field: "manager",
    headerName: "Manager ",
    renderCell: ({ row }: { row: any }) => {
      const { manager } = row;
      return (
        <Typography sx={{ color: "text.secondary" }}>{`${
          manager?.firstName || ""
        }`}</Typography>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 105,
    field: "Active Contracts",
    headerName: "Active Contracts",

    renderCell: ({ row }: { row: RowType }) => {
      return <Typography sx={{ color: "text.secondary" }}>{"10"}</Typography>;
    },
  },

  {
    flex: 0.2,
    minWidth: 125,
    field: "display_name",
    headerName: "Annual value ",

    renderCell: ({ row }: { row: RowType }) => {
      const { display_name } = row;
      return <Typography sx={{ color: "text.secondary" }}>{"$150"}</Typography>;
    },
  },
];

const BranchList = () => {
  const navigate = useNavigate();
  // ** State
  const [search, setSearch] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [catategorylist, setCategorylist] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [data, setData] = useState([]);

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

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getBranchList();
      setCategorylist(data);
      console.log("branc", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const options: any[] = [
    {
      text: "Edit",
      // onClick: handleEditClick,
    },
    {
      text: "Delete",
      // onClick: handleDelete,
    },
  ];
  const ITEM_HEIGHT = 48;

  const handleDelete = async (id: any) => {
    try {
      if (
        window.confirm(
          "Deleting branch will delete all the data associated with it."
        )
      ) {
        setIsLoading(true);
        const res = await deleteBranch(id);
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

  const handleArchive = async (id: any) => {
    try {
      setIsLoading(true);
      const res = await archiveBranch(id, { status: "archived" });
      console.log({ res });

      if (res.ok === true) {
        toast.success(res.message);
        listData();
      } else {
        toast.error(res?.message || "");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listData();
  }, []);

  const filteredList = useMemo(() => {
    let result = catategorylist;
    if (search?.trim().length) {
      result = result.filter((item) =>
        item.branchName?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }
    return result;
  }, [search, catategorylist]);

  const handleApplyFilters = async (filters: CheckedState) => {
    console.log(filters, "filters");

    // const filteredData = await fetchDataWithFilters(filters);
    // setData(filteredData);
  };

  const columns: any[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: "actions",
      headerName: "Actions",
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
                navigate(`/dashboard/branch-edit/${menuState.row?._id}`); // Use menuState.row._id
              }}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                handleArchive(menuState.row?._id); // Use menuState.row._id
              }}
            >
              Archive
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
          <CardHeader title="Branches" />
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

              <div style={{ display: "flex" }}>
                <Button
                  sx={{ mr: 2, textTransform: "none" }}
                  variant="contained"
                  component={Link}
                  to="/dashboard/create-branch"
                >
                  <AddIcon /> Create Branch
                </Button>
                {/* <MenuButton /> */}
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
              ></Box>
            ) : (
              <DataGrid
                autoHeight
                pagination
                rows={filteredList || []}
                columns={columns}
                // checkboxSelection
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onRowSelectionModelChange={(rows: any) => setSelectedRows(rows)}
                getRowId={(row) => row._id}
                // disableColumnMenu
              />
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default BranchList;
