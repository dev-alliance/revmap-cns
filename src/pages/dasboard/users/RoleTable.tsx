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
import { Checkbox, FormControl } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  archiveBranch,
  deleteBranch,
  getBranchList,
  getUserList,
} from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
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
    minWidth: 125,
    field: "Role Name",
    headerName: "Role Name",

    renderCell: ({ row }: { row: any }) => {
      const { state } = row;
      return (
        <Typography sx={{ color: "text.secondary" }}>
          <Checkbox
            sx={{ mr: 1 }}
            // Include any logic for determining if the checkbox should be checked
            // checked={/* your logic here, e.g., row.isChecked */}
            // Include any additional props or event handlers
            // onChange={/* your event handler here, if needed */}
          />
          {"full access , ets "}
        </Typography>
      );
    },
  },

  {
    flex: 0.2,
    minWidth: 500,
    field: "description",
    headerName: "Description",
    renderCell: ({ row }: { row: any }) => {
      const { branchId } = row;
      return (
        <Typography
          sx={{ color: "text.secondar" }}
        >{`${"Lorem ipsum dolor sit amet, ConnectEDU adipose elite"}`}</Typography>
      );
    },
  },
];

const RoleTable = () => {
  const navigate = useNavigate();
  // ** State
  const { user } = useAuth();
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
      const { data } = await getUserList(user?._id);
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
                // hideSelectAll={true}
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

export default RoleTable;
