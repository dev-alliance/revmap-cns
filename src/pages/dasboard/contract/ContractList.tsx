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
import { useContract } from "@/hooks/useContract";
import toast from "react-hot-toast";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import { FormControl } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  archiveBranch,
  deleteBranch,
  getBranchList,
} from "@/service/api/apiMethods";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PDFUploaderViewer from "@/pages/dasboard/contract/PDFUploaderViewer";
import { ContractContext } from "@/context/ContractContext";
import { getList } from "@/service/api/contract";
// import MenuButton from "@/components/MenuButton";
import { format, utcToZonedTime } from "date-fns-tz";

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
    flex: 0.3,
    minWidth: 170,
    field: "state",
    headerName: "Contract with",

    renderCell: ({ row }: { row: any }) => {
      const { state } = row;
      return (
        <Typography sx={{ color: "text.secondary" }}>
          {row?.overview?.with_name}
        </Typography>
      );
    },
  },
  {
    flex: 0.2,
    field: "branchName",
    minWidth: 220,
    headerName: "Contract name",
    renderCell: ({ row }: any) => {
      const { branchName } = row;

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <Img src={checkImageFormat(row?.image?.path)} /> */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ color: "text.secondary" }}>
              {row?.overview?.name}
            </Typography>
          </Box>
        </Box>
      );
    },
  },

  {
    flex: 0.3,
    minWidth: 125,
    field: "Team",
    headerName: "Team ",
    renderCell: ({ row }: { row: any }) => {
      const { manager } = row;
      return (
        <Typography sx={{ color: "text.secondary" }}>{`${
          row?.overview?.team || "-"
        }`}</Typography>
      );
    },
  },
  {
    flex: 0.2,
    field: "createdAt",
    minWidth: 140,
    headerName: "Created Date",
    renderCell: ({ row }: any) => {
      // Extract the date from the row
      const { lifecycle } = row || {};
      const { startDate } = lifecycle?.formData?.dateFields || {};

      // If the date is empty, return a default value
      if (!startDate) {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ color: "text.secondary" }}>-</Typography>
            </Box>
          </Box>
        );
      }

      // Specify the desired time zone, e.g., 'America/New_York'
      const timeZone = "America/New_York";

      // Convert UTC date to the specified time zone
      const zonedDate = utcToZonedTime(new Date(startDate), timeZone);

      // Format the zoned date to the desired output format
      const formattedDate = format(zonedDate, "dd-MM-yyyy", { timeZone });

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
    field: "Expiration date",
    minWidth: 140,
    headerName: "Expiration date",
    renderCell: ({ row }: any) => {
      // Extract the date from the row
      const { lifecycle } = row || {};
      const { endDate } = lifecycle?.formData?.dateFields || {};

      // If the date is empty, return a default value
      if (!endDate) {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ color: "text.secondary" }}>-</Typography>
            </Box>
          </Box>
        );
      }

      // Specify the desired time zone, e.g., 'America/New_York'
      const timeZone = "America/New_York";

      // Convert UTC date to the specified time zone
      const zonedDate = utcToZonedTime(new Date(endDate), timeZone);

      // Format the zoned date to the desired output format
      const formattedDate = format(zonedDate, "dd-MM-yyyy", { timeZone });

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
    field: "Notice period",
    minWidth: 140,
    headerName: "Notice period",
    renderCell: ({ row }: any) => {
      // Extract the date from the row
      const { lifecycle } = row || {};
      const { noticePeriodDate } = lifecycle?.formData?.dateFields || {};

      // If the date is empty, return a default value
      if (!noticePeriodDate) {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ color: "text.secondary" }}>-</Typography>
            </Box>
          </Box>
        );
      }

      // Specify the desired time zone, e.g., 'America/New_York'
      const timeZone = "America/New_York";

      // Convert UTC date to the specified time zone
      const zonedDate = utcToZonedTime(new Date(noticePeriodDate), timeZone);

      // Format the zoned date to the desired output format
      const formattedDate = format(zonedDate, "dd-MM-yyyy", { timeZone });

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
    flex: 0.3,
    minWidth: 125,
    field: "display_name",
    headerName: "Annual Value ",

    renderCell: ({ row }: { row: RowType }) => {
      const { display_name } = row;
      return (
        <Typography sx={{ color: "text.secondary" }}>{"NZD150"}</Typography>
      );
    },
  },
];

const ContractList = () => {
  const navigate = useNavigate();
  // ** State
  const { contractStatus, setContractStatus } = useContract();
  const { setContract, setLifecycleData, setSidebarExpanded } =
    useContext(ContractContext);
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cntractlist, setContractlist] = useState<Array<any>>([]);
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
      const { data } = await getList(user?._id);
      setContractlist(data);
      console.log("contract", data);
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
      if (window.confirm("Are you sure you want to archive this branch?")) {
        setIsLoading(true);
        const res = await archiveBranch(id, { status: "Archived" });
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
    if (user?._id) listData();
  }, [user?._id]);

  const filteredList = useMemo(() => {
    let result = cntractlist;
    if (search?.trim().length) {
      result = result.filter((item) =>
        item.branchName?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }
    return result;
  }, [search, cntractlist]);

  const handleApplyFilters = async (filters: CheckedState) => {
    console.log(filters, "filters");

    // const filteredData = await fetchDataWithFilters(filters);
    // setData(filteredData);
  };

  const columns: any[] = [
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
          <Box
            sx={{
              pr: 3,
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <CardHeader title="Contracts" />
              <Breadcrumbs
                aria-label="breadcrumb"
                sx={{ pl: 2.2, mt: -2, mb: 2, fontSize: "13px" }}
              >
                <Link to="/dashboard/branchlist" className="link-no-underline">
                  Home
                </Link>
                {/* <Typography color="text.primary">Categories</Typography> */}
              </Breadcrumbs>
            </Box>
            <Box>
              <Button variant="outlined" sx={{ textTransform: "none" }}>
                <ExitToAppIcon /> Export
              </Button>
              <Button
                sx={{ ml: 2, mr: 2, textTransform: "none" }}
                variant="contained"
                component={Link}
                to="/dashboard/create-contract"
                onClick={() => {
                  setContract(null),
                    setLifecycleData({
                      activeSection: "",
                      showButtons: false,
                      recipients: [],
                      formData: {
                        checkboxStates: {
                          isEvergreen: false,
                          isRenewalsActive: false,
                          isNotificationEmailEnabled: false,
                          isRemindersEnabled: false,
                        },
                        dateFields: {
                          signedOn: "",
                          startDate: "",
                          endDate: "",
                          noticePeriodDate: "",
                        },
                        renewalDetails: {
                          renewalType: "days",
                          renewalPeriod: 0,
                        },
                        notificationDetails: {
                          notifyOwner: false,
                          additionalRecipients: [],
                        },
                        reminderSettings: {
                          firstReminder: 0,
                          daysBetweenReminders: 0,
                          daysBeforeFinalExpiration: 0,
                        },
                      },
                    });
                }}
              >
                <AddIcon /> Create Contract
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              borderTop: "0.5px solid #174B8B", // Add a top border
              borderBottom: "0.5px solid #174B8B",
              pl: 3,
              p: 2,
              pr: 3,
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              background: "white",
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
                sx={{
                  mr: 2,
                  textTransform: "none",
                  backgroundColor: "green", // Set the button color to green
                  "&:hover": {
                    backgroundColor: "darkgreen", // Darker green on hover
                  },
                }}
                variant="contained"
              >
                Set as a default
              </Button>

              {/* <MenuButton /> */}
            </div>
          </Box>
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
    </>
  );
};

export default ContractList;
