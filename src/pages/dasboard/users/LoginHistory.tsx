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
  logiHistory,
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

interface Row {
  Date: string;
}

const formatDateTime = (dateTimeString: string) => {
  const dateTime = new Date(dateTimeString);

  // Format date as "day month year"
  const optionsDate: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = dateTime.toLocaleDateString(undefined, optionsDate);

  // Format time as "hh:mm am/pm"
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formattedTime = dateTime.toLocaleTimeString(undefined, optionsTime);

  return {
    formattedDate,
    formattedTime,
  };
};

const defaultColumns: GridColDef[] = [
  {
    flex: 0.2,
    field: "LoginDate",
    headerName: "Login Date",
    renderCell: ({ row }: { row: Row }) => {
      const { formattedDate } = formatDateTime(row.Date);

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
    field: "LoginTime",
    headerName: "Login Time",
    renderCell: ({ row }: { row: Row }) => {
      const { formattedTime } = formatDateTime(row.Date);

      return (
        <Typography sx={{ color: "text.secondary" }}>
          {formattedTime}
        </Typography>
      );
    },
  },
];
const LoginHistory = () => {
  const navigate = useNavigate();
  // ** State
  const [search, setSearch] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [List, setList] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [data, setData] = useState<any>([]);

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
      const { user } = await logiHistory("655ca092c273b5227c1ec6cd");
      setList(user?.loginHistory);
      setData(user);
      console.log("user", user);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const ITEM_HEIGHT = 48;

  useEffect(() => {
    listData();
  }, []);

  const filteredList = useMemo(() => {
    let result = List;
    if (search?.trim().length) {
      result = result.filter((item) =>
        item.branchName?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }
    return result;
  }, [search, List]);

  const handleApplyFilters = async (filters: CheckedState) => {
    console.log(filters, "filters");

    // const filteredData = await fetchDataWithFilters(filters);
    // setData(filteredData);
  };

  //   const columns: any[] = [
  //     ...defaultColumns,
  //     {
  //       flex: 0.1,
  //       minWidth: 130,
  //       sortable: false,
  //       field: "actions",
  //       headerName: "Actions",
  //       renderCell: ({ row }: CellType) => (
  //         <div>
  //           <IconButton
  //             aria-label="more"
  //             aria-controls="long-menu"
  //             aria-haspopup="true"
  //             onClick={(e) => handleClick(e, row)} // Pass the current row here
  //           >
  //             <MoreVertIcon />
  //           </IconButton>
  //           <Menu
  //             id="long-menu"
  //             anchorEl={menuState.anchorEl}
  //             open={Boolean(menuState.anchorEl)}
  //             onClose={handleClose}
  //             PaperProps={{
  //               style: {
  //                 maxHeight: ITEM_HEIGHT * 4.5,
  //                 width: "20ch",
  //               },
  //             }}
  //           >
  //             <MenuItem
  //               onClick={() => {
  //                 handleClose();
  //                 navigate(`/dashboard/Team-edit/${menuState.row?._id}`); // Use menuState.row._id
  //               }}
  //             >
  //               Edit
  //             </MenuItem>
  //             <MenuItem
  //               onClick={() => {
  //                 handleClose();
  //                 handleArchive(menuState.row?._id); // Use menuState.row._id
  //               }}
  //             >
  //               Archive
  //             </MenuItem>
  //             <MenuItem
  //               onClick={() => {
  //                 handleDelete(menuState.row?._id); // Use menuState.row._id
  //                 handleClose();
  //               }}
  //             >
  //               Delete
  //             </MenuItem>
  //           </Menu>
  //         </div>
  //       ),
  //     },
  //   ];

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} sx={{ mb: -4 }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                value={search}
                sx={{ mr: 1, maxWidth: "170px" }}
                placeholder="Search Orders"
                onChange={(e) => setSearch(e.target.value)}
                size="small"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            ></Box>
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
              ></Box>
            ) : (
              <DataGrid
                autoHeight
                pagination
                rows={filteredList || []}
                columns={defaultColumns}
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

export default LoginHistory;