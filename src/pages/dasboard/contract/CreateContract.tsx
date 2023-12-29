/* eslint-disable @typescript-eslint/no-explicit-any */
// TeamForm.tsx
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Grid, Typography, Paper, Box } from "@mui/material";
import { TextareaAutosize } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
import { create } from "@/service/api/clauses";
import CreateIcon from "@mui/icons-material/Create";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";

type FormValues = {
  name: string;
  content: string;
  status: string;
};

const CreateContract = () => {
  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        id: user._id,
        name: data.name,
        content: data.content,
      };

      const response = await create(payload);
      if (response.ok === true) {
        toast.success(response.message);
        navigate("/dashboard/clauses-list");
      } else {
        const errorMessage = response.data || response.message;
        toast.error(errorMessage);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);

      let errorMessage = "failed";
      if (error.response) {
        errorMessage = error.response.data || error.response.data.message;
      } else {
        errorMessage = error.message;
      }
      toast.error(errorMessage);

      // Handle error
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
            position: "absolute",
            margin: "auto",
            width: "70%",
          }}
        >
          <ProgressCircularCustomization />
        </Box>
      )}

      <Box
        sx={{
          opacity: isLoading ? "30%" : "100%",
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
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Create Contract
            </Typography>

            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{ mt: -2, mb: 2, fontSize: "14px" }}
            >
              <Link
                style={{ marginRight: "-7px" }}
                to="/dashboard/contract-list"
                className="link-no-underline"
              >
                Home
              </Link>
              <Typography
                sx={{ fontSize: "14px", ml: "-7px" }}
                color="text.primary"
              >
                Create Contract
              </Typography>
            </Breadcrumbs>
          </Box>
        </div>

        <div>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            sx={{ ml: 2, textTransform: "none" }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </div>
      </Box>
      <Paper sx={{ padding: 4, display: "table", width: "100%" }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box>
              <Button
                variant="contained"
                component={Link}
                to="/dashboard/tiny-dahsbord"
                sx={{
                  display: "table-cell",
                  padding: "20px",
                  width: "260px",
                  justifyContent: "center",
                  textTransform: "none",
                }}
              >
                <div style={{ display: "flex" }}>
                  <div>
                    <CreateIcon sx={{ width: "40px", mt: 1.5 }} />
                  </div>

                  <div style={{ display: "table" }}>
                    <div style={{ display: "table-row" }}>
                      <div
                        style={{
                          display: "table-cell",
                          textAlign: "start",
                        }}
                      >
                        <Typography variant="body1" component="span">
                          Create Contract
                        </Typography>
                      </div>
                    </div>
                    <div style={{ display: "table-row" }}>
                      <div
                        style={{
                          display: "table-cell",
                          textAlign: "start",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "11px", whiteSpace: "nowrap" }}
                        >
                          Create a new contract
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </Button>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box>
              <Button
                variant="outlined"
                sx={{
                  display: "table-cell",
                  padding: "20px",
                  width: "260px",
                  justifyContent: "center",
                  textTransform: "none",
                }}
              >
                <div style={{ display: "flex" }}>
                  <div>
                    <CloudUploadIcon sx={{ width: "40px", mt: 1.5 }} />
                  </div>

                  <div style={{ display: "table", margin: "0 auto" }}>
                    <div style={{ display: "table-row" }}>
                      <div
                        style={{
                          display: "table-cell",
                          textAlign: "start",
                        }}
                      >
                        <Typography variant="body1" component="span">
                          Upload Document
                        </Typography>
                      </div>
                    </div>
                    <div style={{ display: "table-row" }}>
                      <div
                        style={{
                          display: "table-cell",
                          textAlign: "start",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "11px", whiteSpace: "nowrap" }}
                        >
                          Upload document to create a contract
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </Button>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box>
              <Button
                variant="outlined"
                sx={{
                  display: "table-cell",
                  padding: "20px",
                  width: "260px",
                  justifyContent: "center",
                  textTransform: "none",
                }}
              >
                <div style={{ display: "flex" }}>
                  <div>
                    <DescriptionIcon sx={{ width: "40px", mt: 1.5 }} />
                  </div>

                  <div style={{ display: "table", margin: "0 auto" }}>
                    <div style={{ display: "table-row" }}>
                      <div
                        style={{
                          display: "table-cell",
                          textAlign: "start",
                        }}
                      >
                        <Typography variant="body1" component="span">
                          DescriptionIcon
                        </Typography>
                      </div>
                    </div>
                    <div style={{ display: "table-row" }}>
                      <div
                        style={{
                          display: "table-cell",
                          textAlign: "start",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "11px", whiteSpace: "nowrap" }}
                        >
                          Use saved template to create a contract
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default CreateContract;
