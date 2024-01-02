/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getBranchList,
  getTeamsList,
  getUserListNameID,
} from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import { getCategoryList } from "@/service/api/category";
import { getList } from "@/service/api/tags";
import AddIcon from "@mui/icons-material/Add";

type FormValues = {
  name: string;
  vendor: string;
  currency: string;
  value: number;
  category: string;
  tags: string[];
  branch: string;
  team: string;
  contractType: string;
  status: string;
  subcategory: string;
};
interface Field {
  name: string;
  value: string;
  isEditing: boolean;
}

const OverView = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teamData, setTeamData] = useState<Array<any>>([]);
  const [branchData, setBranchData] = useState<Array<any>>([]);
  const [userList, setUserList] = useState<Array<any>>([]);
  const [catategorylist, setCategorylist] = useState<Array<any>>([]);
  const [taglist, setTaglist] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [fields, setFields] = useState<Field[]>([
    { name: "", value: "", isEditing: true },
  ]);

  const handleAddField = () => {
    // Set all existing fields to non-editing state and add a new editing field
    const updatedFields = fields.map((field) => ({
      ...field,
      isEditing: false,
    }));
    setFields([...updatedFields, { name: "", value: "", isEditing: true }]);
  };

  const handleFieldChange = (
    index: number,
    key: keyof Field,
    newValue: string
  ) => {
    const updatedFields = fields.map((field, i) =>
      i === index ? { ...field, [key]: newValue } : field
    );
    setFields(updatedFields);
  };

  const handleDeleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleEditField = (index: number) => {
    const updatedFields = fields.map((field, i) =>
      i === index ? { ...field, isEditing: true } : field
    );
    setFields(updatedFields);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Submit logic
      toast.success("Success message");
      navigate("/nextRoute");
    } catch (error) {
      // Error handling
      toast.error("Error message");
    }
  };
  useEffect(() => {
    const category = catategorylist.find((c) => c._id === selectedCategory);
    setSubCategories(category ? category.subCategories : []);
  }, [selectedCategory, catategorylist]);

  const getTeamsData = async () => {
    try {
      const { data } = await getTeamsList(user?._id);
      setTeamData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getBranchData = async () => {
    try {
      const { data } = await getBranchList(user?._id);

      setBranchData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const CategorylistData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getCategoryList(user?._id);
      setCategorylist(data);
      console.log("branc", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const TaglistData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getList();

      setTaglist(data);

      console.log("teams", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getBranchData();
      getTeamsData();
      CategorylistData();
      TaglistData();
    }
  }, [user?._id]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mr: 2, whiteSpace: "nowrap" }}
        >
          Contract Name*
        </Typography>
        <Controller
          name="name" // Make sure to use unique names for each field
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Add name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              size="small"
              variant="outlined"
            />
          )}
        />
      </Box>

      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mr: 2, whiteSpace: "nowrap" }}
        >
          Contract With*
        </Typography>
        <Controller
          name="name"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Add name"
              fullWidth
              size="small"
              variant="outlined"
            />
          )}
        />
      </Box>
      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mr: 2, whiteSpace: "nowrap" }}
        >
          Vendor
        </Typography>
        <Controller
          name="vendor"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth size="small">
              {/* Optional: add this line if you want a label */}
              <Select
                {...field}
                labelId="status-label"
                displayEmpty
                renderValue={(value) => {
                  if (value === "") {
                    return (
                      <em
                        style={{
                          color: "#C2C2C2",
                          fontStyle: "normal",
                          fontSize: "15.5px",
                        }}
                      >
                        {" "}
                        Choose Vendor
                      </em> // Placeholder text with custom color
                    );
                  }
                  return field.value;
                }}
              >
                {/* Placeholder */}
                <MenuItem value="name">name</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography variant="body2" sx={{ minWidth: "75px", mr: 2 }}>
          Currency
        </Typography>
        <Controller
          name="currency"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth size="small">
              {/* Optional: add this line if you want a label */}
              <Select
                {...field}
                labelId="status-label"
                displayEmpty
                renderValue={(value) => {
                  if (value === "") {
                    return (
                      <em
                        style={{
                          color: "#C2C2C2",
                          fontStyle: "normal",
                          fontSize: "15.5px",
                        }}
                      >
                        {" "}
                        Choose currency
                      </em> // Placeholder text with custom color
                    );
                  }
                  return field.value;
                }}
              >
                {/* Placeholder */}
                <MenuItem value="$">$</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>
      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mr: 2, whiteSpace: "nowrap" }}
        >
          Annual Value
        </Typography>
        <Controller
          name="value"
          control={control}
          //   rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Add value"
              fullWidth
              //   error={!!errors.value}
              //   helperText={errors.contractWith?.value}
              size="small"
              variant="outlined"
            />
          )}
        />
      </Box>

      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mr: 2, whiteSpace: "nowrap" }}
        >
          Branch
        </Typography>
        <FormControl fullWidth size="small">
          <Controller
            name="branch"
            control={control}
            defaultValue=""
            rules={{ required: " Branch is required" }}
            render={({ field }) => (
              <Select
                {...field}
                labelId="branch-label"
                placeholder="Branch"
                displayEmpty
                renderValue={(value: any) => {
                  if (value === "") {
                    return (
                      <em
                        style={{
                          color: "#C2C2C2",
                          fontStyle: "normal",
                          fontSize: "15.5px",
                        }}
                      >
                        Select branch
                      </em> // Placeholder text with custom color
                    );
                  }
                  const selectedBranch = branchData.find(
                    (branch) => branch._id === value
                  );
                  return selectedBranch ? selectedBranch.branchName : "";
                }}
              >
                {branchData?.map((branch: any) => (
                  <MenuItem key={branch?._id} value={branch?._id}>
                    {branch?.branchName}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mr: 2, whiteSpace: "nowrap" }}
        >
          Team*
        </Typography>
        <FormControl fullWidth size="small">
          <Controller
            name="team"
            control={control}
            defaultValue=""
            rules={{ required: " Team is required" }}
            render={({ field }) => (
              <Select
                {...field}
                labelId="team-label"
                placeholder="Team"
                displayEmpty
                renderValue={(value) => {
                  if (value === "") {
                    return (
                      <em
                        style={{
                          color: "#C2C2C2",
                          fontStyle: "normal",
                          fontSize: "15.5px",
                        }}
                      >
                        Select team
                      </em> // Placeholder text with custom color
                    );
                  }

                  // Find the team with the matching ID in teamData and return its name
                  const selectedTeam = teamData.find(
                    (team) => team._id === value
                  );
                  return selectedTeam ? selectedTeam.name : "";
                }}
              >
                {teamData?.map((team: any) => (
                  <MenuItem key={team._id} value={team._id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography variant="body2" sx={{ minWidth: "75px", mr: 2 }}>
          Category*
        </Typography>
        <Controller
          name="category"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth size="small">
              {/* Optional: add this line if you want a label */}
              <Select
                {...field}
                onChange={(e) => {
                  field.onChange(e); // Update form
                  setSelectedCategory(e.target.value as string); // Update local state
                }}
                labelId="manager-label"
                displayEmpty
                renderValue={(value) => {
                  if (value === "") {
                    return (
                      <em
                        style={{
                          color: "#C2C2C2",
                          fontStyle: "normal",
                          fontSize: "15.5px",
                        }}
                      >
                        Select category
                      </em> // Placeholder text with custom color
                    );
                  }
                  // Find the selected manager by ID
                  const selectedCategory = catategorylist.find(
                    (category) => category._id === value
                  );
                  return selectedCategory ? `${selectedCategory.name}` : "";
                }}
              >
                {catategorylist?.map((category: any) => (
                  <MenuItem key={category?._id} value={category?._id}>
                    {category?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>
      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography variant="body2" sx={{ minWidth: "75px", mr: 2 }}>
          Subcategory*
        </Typography>
        <Controller
          name="subcategory"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select
                {...field}
                labelId="subcategory-label"
                displayEmpty
                renderValue={(value) =>
                  value === "" ? (
                    <em
                      style={{
                        color: "#C2C2C2",
                        fontStyle: "normal",
                        fontSize: "15.5px",
                      }}
                    >
                      Select subcategory
                    </em>
                  ) : (
                    value
                  )
                }
              >
                {subCategories.map((subCategory: any) => (
                  <MenuItem key={subCategory._id} value={subCategory.name}>
                    {subCategory.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>
      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mr: 2, whiteSpace: "nowrap" }}
        >
          Contract Type*
        </Typography>
        <Controller
          name="contractType"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth size="small">
              {/* Optional: add this line if you want a label */}
              <Select
                {...field}
                labelId="status-label"
                displayEmpty
                renderValue={(value) => {
                  if (value === "") {
                    return (
                      <em
                        style={{
                          color: "#C2C2C2",
                          fontStyle: "normal",
                          fontSize: "15.5px",
                        }}
                      >
                        {" "}
                        Choose contract type
                      </em> // Placeholder text with custom color
                    );
                  }
                  return field.value;
                }}
              >
                {/* Placeholder */}
                <MenuItem value="Sale">Sale</MenuItem>
                <MenuItem value="Purchase">Purchase</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      {/* <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mr: 2, whiteSpace: "nowrap" }}
        >
          Status
        </Typography>
        <Controller
          name="status"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select
                {...field}
                labelId="status-label"
                displayEmpty
                renderValue={(value) => {
                  if (value === "") {
                    return (
                      <em
                        style={{
                          color: "#C2C2C2",
                          fontStyle: "normal",
                          fontSize: "15.5px",
                        }}
                      >
                        {" "}
                        Choose a status
                      </em>
                    );
                  }
                  return field.value;
                }}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Negotiation">Negotiation</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Notice period">Notice period</MenuItem>
                <MenuItem value="Expired">Expired</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box> */}

      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mr: 2, whiteSpace: "nowrap" }}
        >
          Tag*
        </Typography>
        <Controller
          name="tags"
          control={control}
          // defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth size="small">
              {/* Optional: add this line if you want a label */}
              <Select
                {...field}
                labelId="manager-label"
                displayEmpty
                renderValue={(value) => {
                  // if (value === "") {
                  //   return (
                  //     <em
                  //       style={{
                  //         color: "#C2C2C2",
                  //         fontStyle: "normal",
                  //         fontSize: "15.5px",
                  //       }}
                  //     >
                  //       Select tag
                  //     </em> // Placeholder text with custom color
                  //   );
                  // }
                  // Find the selected manager by ID
                  const selectedTag = taglist.find((tag) => tag._id === value);
                  return selectedTag ? `${selectedTag.name} ` : "";
                }}
              >
                {taglist?.map((tag: any) => (
                  <MenuItem key={tag?._id} value={tag?._id}>
                    {tag?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>
      <Box>
        <Button
          onClick={handleAddField}
          variant="text"
          sx={{
            mt: 2,
            color: "inherit",
            backgroundColor: "transparent",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "&:active": {
              boxShadow: "none",
            },
            textTransform: "none", // Optional: prevents uppercase transformation
          }}
        >
          <AddIcon sx={{ color: "blue" }} /> Add Field
        </Button>
        {fields.map((field, index) => (
          <Box
            key={index}
            sx={{ display: "flex", mb: 2, alignItems: "center" }}
          >
            {field.isEditing ? (
              <>
                <TextField
                  value={field.name}
                  onChange={(e) =>
                    handleFieldChange(index, "name", e.target.value)
                  }
                  placeholder="Enter name"
                  size="small"
                  sx={{ mr: 2 }}
                />
                <TextField
                  value={field.value}
                  onChange={(e) =>
                    handleFieldChange(index, "value", e.target.value)
                  }
                  placeholder="Enter value"
                  size="small"
                />
              </>
            ) : (
              <>
                <Typography
                  sx={{ mr: 2, flexGrow: 1 }}
                  onClick={() => handleEditField(index)}
                >
                  {field.name}: {field.value}
                </Typography>
                <IconButton onClick={() => handleDeleteField(index)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
        ))}
      </Box>
    </form>
  );
};

export default OverView;
