/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useContext } from "react";

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
  Divider,
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
import { ContractContext } from "@/context/ContractContext";

type FormValues = {
  name: string;
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
    setValue,
    formState: { errors },
    getValues,
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const { updateContractOverview, contract } = useContext(ContractContext);
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
      // Assuming data contains the updated overview fields

      const updatedOverview: any = {
        name: data?.name,
        vendor: "Vendor Name", // Modify as needed
        currency: data?.currency,
        value: data?.value,
        category: data?.category,
        subcategory: data?.subcategory,
        tags: data?.tags,
        branch: data?.branch,
        team: data?.team,
        contractType: "Type1", // Modify as needed
        status: "Active", // Modify as needed
        // Add other fields as necessary
      };
      console.log(updatedOverview, "dataupdat");
      updateContractOverview(updatedOverview);

      toast.success("Contract overview updated successfully");
    } catch (error) {
      toast.error("Failed to update contract overview");
    }
  };
  useEffect(() => {
    if (contract) {
      setValue("name", contract?.name);
      setValue("currency", contract?.currency);
      setValue("value", contract?.value);
      setValue("category", contract?.category);
      setValue("subcategory", contract?.subcategory);
      setValue("tags", contract?.tags);
      setValue("branch", contract?.branch);
      setValue("team", contract?.team);
      setValue("contractType", contract?.contractType);
    }
  }, [contract, setValue]);

  useEffect(() => {
    // Define a function to handle the logic you want to run on unmount
    const handleUnload = async () => {
      const formData = getValues();
      await onSubmit(formData);
    };

    return () => {
      // Set a timeout to delay the unload operation
      const timeoutId = setTimeout(() => {
        handleUnload().catch((error) => {
          console.error("Failed to update on unmount", error);
          // Ensure toast is available in this scope or imported if necessary
          toast.error("Failed to save changes.");
        });
        return () => clearTimeout(timeoutId);
      }, 3000); // Delay by 3000 milliseconds (3 seconds)
    };
    // Assuming you want this to run only once, on mount and unmount
  }, []);

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
      <Typography variant="body1" color="primary">
        Overview
      </Typography>
      <Divider style={{ margin: "10px 0" }} />
      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mr: 2, whiteSpace: "nowrap" }}
        >
          Contract Name*
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
              error={!!errors.name}
              helperText={errors.name?.message}
              size="small"
              variant="standard"
              InputProps={{
                sx: {
                  "::placeholder": {
                    fontSize: "0.55rem", // Adjusted font size for placeholder
                    textAlign: "center", // Center placeholder text horizontally
                  },
                  input: {
                    fontSize: "0.875rem", // Adjusted font size for input text
                    textAlign: "center", // Center input text horizontally
                  },
                },
              }}
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
              variant="standard"
              InputProps={{
                sx: {
                  "::placeholder": {
                    fontSize: "0.55rem", // Adjusted font size for placeholder
                    textAlign: "center", // Center placeholder text horizontally
                  },
                  input: {
                    fontSize: "0.875rem", // Adjusted font size for input text
                    textAlign: "center", // Center input text horizontally
                  },
                },
              }}
            />
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
              variant="standard"
              InputProps={{
                sx: {
                  "::placeholder": {
                    fontSize: "0.55rem", // Adjusted font size for placeholder
                    textAlign: "center", // Center placeholder text horizontally
                  },
                  input: {
                    fontSize: "0.875rem", // Adjusted font size for input text
                    textAlign: "center", // Center input text horizontally
                  },
                },
              }}
            />
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
            <FormControl fullWidth size="small" variant="outlined">
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
                          fontSize: "0.70rem", // Reduced font size for placeholder
                        }}
                      >
                        Choose currency
                      </em> // Placeholder text with custom color and font size
                    );
                  }
                  return field.value;
                }}
                sx={{
                  ".MuiSelect-select": {
                    border: "none", // Remove border
                    fontSize: "0.70rem", // Ensure consistent font size
                    "&:focus": {
                      backgroundColor: "transparent", // Remove the background color on focus
                    },
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "none", // Ensure no border
                  },
                }}
              >
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
                          fontSize: "0.70rem", // Reduced font size for placeholder
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
                sx={{
                  ".MuiSelect-select": {
                    border: "none", // Remove border
                    fontSize: "0.70rem", // Ensure consistent font size
                    "&:focus": {
                      backgroundColor: "transparent", // Remove the background color on focus
                    },
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "none", // Ensure no border
                  },
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
                          fontSize: "0.70rem", // Reduced font size for placeholder
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
                sx={{
                  ".MuiSelect-select": {
                    border: "none", // Remove border
                    fontSize: "0.70rem", // Ensure consistent font size
                    "&:focus": {
                      backgroundColor: "transparent", // Remove the background color on focus
                    },
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "none", // Ensure no border
                  },
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
                          fontSize: "0.70rem", // Reduced font size for placeholder
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
                sx={{
                  ".MuiSelect-select": {
                    border: "none", // Remove border
                    fontSize: "0.70rem", // Ensure consistent font size
                    "&:focus": {
                      backgroundColor: "transparent", // Remove the background color on focus
                    },
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "none", // Ensure no border
                  },
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
                        fontSize: "0.70rem", // Reduced font size for placeholder
                      }}
                    >
                      Select subcategory
                    </em>
                  ) : (
                    value
                  )
                }
                sx={{
                  ".MuiSelect-select": {
                    border: "none", // Remove border
                    fontSize: "0.70rem", // Ensure consistent font size
                    "&:focus": {
                      backgroundColor: "transparent", // Remove the background color on focus
                    },
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "none", // Ensure no border
                  },
                }}
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
                        Select tag
                      </em> // Placeholder text with custom color
                    );
                  }
                  // Find the selected manager by ID
                  const selectedTag = taglist.find((tag) => tag._id === value);
                  return selectedTag ? `${selectedTag.name} ` : "";
                }}
                sx={{
                  ".MuiSelect-select": {
                    border: "none", // Remove border
                    fontSize: "0.70rem", // Ensure consistent font size
                    "&:focus": {
                      backgroundColor: "transparent", // Remove the background color on focus
                    },
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "none", // Ensure no border
                  },
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

      <Box>
        <Button
          onClick={handleAddField}
          variant="text"
          sx={{
            mt: 1,
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
                  variant="standard"
                  InputProps={{
                    sx: {
                      "::placeholder": {
                        fontSize: "0.55rem", // Adjusted font size for placeholder
                        textAlign: "center", // Center placeholder text horizontally
                      },
                      input: {
                        fontSize: "0.875rem", // Adjusted font size for input text
                        textAlign: "center", // Center input text horizontally
                      },
                    },
                  }}
                />
                <TextField
                  value={field.value}
                  onChange={(e) =>
                    handleFieldChange(index, "value", e.target.value)
                  }
                  placeholder="Enter value"
                  size="small"
                  variant="standard"
                  InputProps={{
                    sx: {
                      "::placeholder": {
                        fontSize: "0.55rem", // Adjusted font size for placeholder
                        textAlign: "center", // Center placeholder text horizontally
                      },
                      input: {
                        fontSize: "0.875rem", // Adjusted font size for input text
                        textAlign: "center", // Center input text horizontally
                      },
                    },
                  }}
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
