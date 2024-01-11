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
import { format, utcToZonedTime } from "date-fns-tz";
import { deletecustomFields, getList } from "@/service/api/customFeild";
import AddIcon from "@mui/icons-material/Add";
import CreateField from "@/pages/dasboard/customField/CreateField";
interface CellType {
  row: any;
  _id: any;
  name: any;
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

const FieldList = () => {
  const navigate = useNavigate();
  // ** State
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });
  const [catategorylist, setCategorylist] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleCloseModalResetPass = () => setIsOpenCreate(false);
  const [itemName, setItemName] = useState({ id: "", name: "" });
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
      if (
        window.confirm("Are you sure you want to delete this custom field?")
      ) {
        setIsLoading(true);
        const res = await deletecustomFields(id);
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
      flex: 0.3,
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
      flex: 0.3,
      field: "createdAt",
      minWidth: 150,
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
      minWidth: 230,
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
                setIsOpenCreate(true);
                setItemName({
                  id: menuState.row?._id || "",
                  name: menuState.row?.name || "",
                });
              }}
            >
              Rename
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
          <CardHeader title=" Custom Fields" />
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ pl: 2.2, mt: -2, mb: 2, fontSize: "13px" }}
          >
            <Link to="/dashboard/feild-list" className="link-no-underline">
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

              <div style={{ display: "flex" }}>
                <Button
                  sx={{ mr: 2, textTransform: "none" }}
                  variant="contained"
                  onClick={() => setIsOpenCreate(true)}
                >
                  <AddIcon />
                  Create Field
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
              >
                {" "}
                <ProgressCircularCustomization />
              </Box>
            ) : (
              <DataGrid
                style={{ maxHeight: 500 }}
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
      <CreateField
        open={isOpenCreate}
        onClose={handleCloseModalResetPass}
        itemName={itemName}
        listData={listData}
        setItemName={setItemName}
      />
    </>
  );
};

export default FieldList;
