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
import Breadcrumbs from "@mui/material/Breadcrumbs";
// ** Third Party Imports
// import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
import { archiveTemp, deletetemplates, getList } from "@/service/api/template";
import { format, utcToZonedTime } from "date-fns-tz";
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

const TemplateList = () => {
  const navigate = useNavigate();
  // ** State
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [catategorylist, setCategorylist] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);

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
      const { data } = await getList();

      setCategorylist(data);

      console.log("teams", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const ITEM_HEIGHT = 48;

  const handleDelete = async (id: any) => {
    try {
      if (window.confirm("Are you sure you want to delete this template?")) {
        setIsLoading(true);
        const res = await deletetemplates(id);
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
      if (window.confirm("Are you sure you want to archive this template?")) {
        setIsLoading(true);
        const res = await archiveTemp(id, { status: "Archived" });
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
  const handleActive = async (id: any) => {
    try {
      if (
        window.confirm(
          "Are you sure you want to change the status this template?"
        )
      ) {
        setIsLoading(true);

        const res = await archiveTemp(id, { status: "Active" });
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

  useEffect(() => {
    listData();
  }, []);

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
  const handleFileClick = (fileUrl: any) => {
    window.open(fileUrl, "_blank");
  };

  const columns: GridColDef[] = [
    {
      flex: 0.2,
      field: "name",
      minWidth: 230,
      headerName: "Name",
      renderCell: ({ row }: any) => {
        const { name } = row;

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ color: "text.secondary" }}>{name}</Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.4,
      field: "description",
      minWidth: 250,
      headerName: "Description",
      renderCell: ({ row }: any) => {
        const { description } = row;
        const displaydescription =
          description?.length > 30
            ? `${description?.substring(0, 30)}...`
            : description;

        return (
          <Tooltip title={description} arrow>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ color: "text.secondary" }}>
                  {displaydescription}
                </Typography>
              </Box>
            </Box>
          </Tooltip>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 100,
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
      field: "file",
      minWidth: 130,
      headerName: "Document Type",
      renderCell: ({ row }: any) => {
        const { file } = row;
        // Extracting the file extension
        const fileType = file?.substring(file.lastIndexOf("."));

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ color: "text.secondary" }}>
                {
                  <IconButton
                    onClick={() => handleFileClick(file)}
                    sx={{
                      color: "#1976d2",
                      fontSize: "15px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fileType}
                  </IconButton>
                }
              </Typography>
            </Box>
          </Box>
        );
      },
    },

    {
      flex: 0.2,
      field: "createdAt",
      minWidth: 140,
      headerName: "Created Date",
      renderCell: ({ row }: any) => {
        const { createdAt } = row;

        // Specify the desired time zone, e.g., 'America/New_York'

        const timeZone = "America/New_York";
        // Convert UTC date to the specified time zone
        const zonedDate = utcToZonedTime(new Date(createdAt), timeZone);

        const formattedDate = format(zonedDate, "dd-MM-yyyy ", {
          timeZone,
        });

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ color: "text.secondary" }}>
                {formattedDate}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.2,
      field: "uploaded_by",
      minWidth: 140,
      headerName: "Created By",
      renderCell: ({ row }: any) => {
        const { uploaded_by } = row;

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ color: "text.secondary" }}>
                {uploaded_by || "-"}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.02,
      minWidth: 100,
      sortable: false,
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      renderCell: ({ row }: any) => (
        <div>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={(e: any) => handleClick(e, row)} // Pass the current row here
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
                navigate(`/dashboard/update-template/${menuState.row?._id}`); // Use menuState.row._id
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
          <CardHeader title="Templates" />
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ pl: 2.2, mt: -2, mb: 2, fontSize: "13px" }}
          >
            <Link to="/dashboard/template-list" className="link-no-underline">
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
                    onChange={(e: any) => setSearch(e.target.value)}
                  />
                </Box>
              </div>

              <div>
                <Button variant="outlined" sx={{ textTransform: "none" }}>
                  Create Template
                </Button>
                <Button
                  sx={{ ml: 2, textTransform: "none" }}
                  variant="contained"
                  component={Link}
                  to="/dashboard/create-template"
                >
                  Upload Template
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
              <Box sx={{ maxHeight: 500, width: "100%", overflow: "auto" }}>
                <DataGrid
                  style={{ paddingLeft: "10px", paddingRight: "10px" }}
                  autoHeight
                  pagination
                  rows={filteredList || []}
                  columns={columns}
                  // checkboxSelection
                  disableRowSelectionOnClick
                  pageSizeOptions={[7, 25, 50]}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  onRowSelectionModelChange={(rows: any) =>
                    setSelectedRows(rows)
                  }
                  getRowId={(row: any) => row._id}
                  // disableColumnMenu
                />
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default TemplateList;
