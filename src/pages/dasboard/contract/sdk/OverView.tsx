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
import { log } from "console";

type FormValues = {
  name: string;
  with_name: string;
  currency: string;
  value: number;
  category: string;
  tags: string;
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
  const { updateContractOverview, contract, setContract } =
    useContext(ContractContext);
  const { user } = useAuth();
  const [teamData, setTeamData] = useState<Array<any>>([]);
  const [branchData, setBranchData] = useState<Array<any>>([]);
  const [userList, setUserList] = useState<Array<any>>([]);
  const [catategorylist, setCategorylist] = useState<Array<any>>([]);
  const [taglist, setTaglist] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [fields, setFields] = useState<any>([]);
  const [newField, setNewField] = useState<any>({ name: "", value: "" });

  const handleAddField = () => {
    setFields([...fields, { ...newField, isEditing: false }]);
    setNewField({ name: "", value: "" });
  };

  const handleFieldChange = (index: any, key: any, value: any) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleDeleteField = (index: any) => {
    const updatedFields = fields.filter((_: any, i: any) => i !== index);
    setFields(updatedFields);
  };

  const handleEditField = (index: any) => {
    const updatedFields = [...fields];
    updatedFields[index].isEditing = !updatedFields[index].isEditing;
    setFields(updatedFields);
  };

  const handleNewFieldChange = (key: any, value: any) => {
    setNewField({ ...newField, [key]: value });
  };

  const canAddField =
    newField.name.trim() !== "" && newField.value.trim() !== "";

  const onSubmit = async (data: FormValues) => {
    try {
      // Assuming data contains the updated overview fields
      const updatedOverview: any = {
        name: data?.name,
        with_name: data?.with_name,
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
      setContract(updatedOverview);

      // updateContractOverview(updatedOverview);

      // toast.success("Contract overview updated successfully");
    } catch (error) {
      // toast.error("Failed to update contract overview");
    }
  };
  console.log(contract, "contract");

  useEffect(() => {
    if (contract) {
      setValue("name", contract?.name);
      setValue("with_name", contract?.with_name || "");
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
      <Typography variant="body1" color="black">
        Overview
      </Typography>
      <Divider style={{ margin: "10px 0" }} />
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body2"
          sx={{
            minWidth: "75px",
            mr: 2,
            mb: 0.8,
            whiteSpace: "nowrap",
            color: "#155BE5",
          }}
        >
          Document Name
        </Typography>
        <Controller
          name="name"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Add document name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              size="small"
              variant="standard"
              InputProps={{
                disableUnderline: true, // Disables the underline by default
                sx: {
                  "::after": {
                    borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
                  },
                  "::before": {
                    borderBottom: "none !important", // Hides the underline
                  },
                  ":hover:not(.Mui-disabled)::before": {
                    borderBottom: "none !important", // Ensures underline stays hidden on hover
                  },
                  "input:focus + fieldset": {
                    border: "none", // Optional: for outlined variant if ever used
                  },
                  "::placeholder": {
                    fontSize: "0.55rem",
                  },
                  input: {
                    fontSize: "0.875rem",
                    "&:focus": {
                      // Shows the underline when the input is focused
                      borderBottom: "2px solid", // Adjust color as needed
                    },
                  },
                },
              }}
            />
          )}
        />
      </Box>

      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body2"
          sx={{
            minWidth: "75px",
            mr: 2,
            mb: 0.8,
            mt: 0.8,
            whiteSpace: "nowrap",
            color: "#155BE5",
          }}
        >
          With
        </Typography>
        <Controller
          name="with_name"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Add third party name"
              fullWidth
              size="small"
              variant="standard"
              InputProps={{
                disableUnderline: true, // Disables the underline by default
                sx: {
                  "::after": {
                    borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
                  },
                  "::before": {
                    borderBottom: "none !important", // Hides the underline
                  },
                  ":hover:not(.Mui-disabled)::before": {
                    borderBottom: "none !important", // Ensures underline stays hidden on hover
                  },
                  "input:focus + fieldset": {
                    border: "none", // Optional: for outlined variant if ever used
                  },
                  "::placeholder": {
                    fontSize: "0.55rem",
                  },
                  input: {
                    fontSize: "0.875rem",
                    "&:focus": {
                      // Shows the underline when the input is focused
                      borderBottom: "2px solid", // Adjust color as needed
                    },
                  },
                },
              }}
            />
          )}
        />
      </Box>
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body2"
          sx={{
            minWidth: "75px",
            mb: 0.8,
            mt: 0.8,
            whiteSpace: "nowrap",
            color: "#155BE5",
          }}
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
                disableUnderline: true, // Disables the underline by default
                sx: {
                  "::after": {
                    borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
                  },
                  "::before": {
                    borderBottom: "none !important", // Hides the underline
                  },
                  ":hover:not(.Mui-disabled)::before": {
                    borderBottom: "none !important", // Ensures underline stays hidden on hover
                  },
                  "input:focus + fieldset": {
                    border: "none", // Optional: for outlined variant if ever used
                  },
                  "::placeholder": {
                    fontSize: "0.55rem",
                  },
                  input: {
                    fontSize: "0.875rem",
                    "&:focus": {
                      // Shows the underline when the input is focused
                      borderBottom: "2px solid", // Adjust color as needed
                    },
                  },
                },
              }}
            />
          )}
        />
      </Box>
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mt: 0.8, mr: 2, color: "#155BE5" }}
        >
          Currency
        </Typography>
        <Controller
          name="currency"
          control={control}
          defaultValue="" // Ensure this matches the initial state expected by your form
          render={({ field }) => (
            <FormControl fullWidth size="small" variant="outlined">
              <Select
                {...field}
                displayEmpty // This should ensure the placeholder is displayed when the value is ""
                renderValue={(value) => {
                  if (value === "") {
                    return (
                      <em
                        style={{
                          color: "#C2C2C2",
                          fontStyle: "normal",
                          fontSize: "13px",
                        }}
                      >
                        Choose currency
                      </em> // Placeholder text with custom color and font size
                    );
                  }
                  return field.value; // Ensure this reflects the selected option text correctly
                }}
                labelId="currency-label"
                sx={{
                  ".MuiSelect-select": {
                    border: "none", // Remove border
                    fontSize: "13px", // Ensure consistent font size
                    marginLeft: "-0.8rem",
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
                <MenuItem value="NZ$">NZ$</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      {/* <Box sx={{ mb: 0 }}>
        <Typography
          variant="body2"
          sx={{
            minWidth: "75px",
            mr: 2,
            whiteSpace: "nowrap",
            color: "#155BE5",
          }}
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
                          fontSize: "13px",
                          
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
                    fontSize: "13px", // Ensure consistent font size
                     marginLeft: "-0.8rem",
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
      </Box> */}
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body2"
          sx={{
            minWidth: "75px",
            mr: 2,
            whiteSpace: "nowrap",
            color: "#155BE5",
          }}
        >
          Team
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
                          fontSize: "13px",
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
                    fontSize: "13px", // Ensure consistent font size
                    marginLeft: "-0.8rem",
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
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mr: 2, color: "#155BE5" }}
        >
          Category
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
                          fontSize: "13px",
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
                    fontSize: "13px", // Ensure consistent font size
                    marginLeft: "-0.8rem",
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
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body2"
          sx={{ minWidth: "75px", mr: 2, color: "#155BE5" }}
        >
          Subcategory
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
                        fontSize: "13px",
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
                    fontSize: "13px", // Ensure consistent font size
                    marginLeft: "-0.8rem",
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
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body2"
          sx={{
            minWidth: "75px",
            mr: 2,
            whiteSpace: "nowrap",
            color: "#155BE5",
          }}
        >
          Tag
        </Typography>

        <Controller
          name="tags"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select
                {...field}
                labelId="subcategory-label"
                displayEmpty
                renderValue={(value) => {
                  if (value === "") {
                    return (
                      <em
                        style={{
                          color: "#C2C2C2",
                          fontStyle: "normal",
                          fontSize: "14px",
                          // Reduced font size for placeholder
                        }}
                      >
                        Select tag
                      </em> // Placeholder text with custom color
                    );
                  }
                  // Find the selected manager by ID
                  const selectedTags = taglist.find(
                    (tags) => tags._id === value
                  );
                  return selectedTags ? `${selectedTags.name}` : "";
                }}
                sx={{
                  ".MuiSelect-select": {
                    border: "none", // Remove border
                    fontSize: "13px",
                    marginLeft: "-0.8rem", // Ensure consistent font size
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

      <Box>
        <Button
          onClick={handleAddField}
          variant="text"
          disabled={!canAddField}
          sx={{
            fontSize: "12px",
            marginLeft: "-0.6rem",
            color: "#155BE5",
            backgroundColor: "transparent",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "&:active": {
              boxShadow: "none",
            },
            textTransform: "none",
          }}
        >
          <AddIcon sx={{ color: "black", fontSize: "14px" }} /> Add Field
        </Button>

        {fields.map((field: any, index: any) => (
          <Box key={index} sx={{ mb: 0 }}>
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
                />
                <Box sx={{ mt: 1 }}>
                  <TextField
                    value={field.value}
                    onChange={(e) =>
                      handleFieldChange(index, "value", e.target.value)
                    }
                    placeholder="Enter value"
                    size="small"
                    variant="standard"
                  />
                </Box>
              </>
            ) : (
              <div style={{ display: "flex" }}>
                <Typography
                  sx={{ mr: 2, flexGrow: 1 }}
                  onClick={() => handleEditField(index)}
                >
                  {field.name}: {field.value}
                </Typography>
                <IconButton onClick={() => handleDeleteField(index)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            )}
          </Box>
        ))}
        <TextField
          value={newField.name}
          onChange={(e) => handleNewFieldChange("name", e.target.value)}
          placeholder="Enter name"
          size="small"
          sx={{ mr: 2 }}
          variant="standard"
        />
        <TextField
          value={newField.value}
          onChange={(e) => handleNewFieldChange("value", e.target.value)}
          placeholder="Enter value"
          size="small"
          variant="standard"
        />
      </Box>
    </form>
  );
};

export default OverView;
