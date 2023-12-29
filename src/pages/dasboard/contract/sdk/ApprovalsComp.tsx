/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Divider,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { getList } from "@/service/api/approval";

const ApprovalsComp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [approvalList, setApprovallist] = useState<any[]>([]);

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getList();
      setApprovallist(data);
      console.log("approvals", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listData();
  }, []);
  const bubbleColors = ["#FEC85E", "#BC3D89", "#725FE7,#00A7B1"]; // Yellow, Green, Blue
  return (
    <div style={{ textAlign: "left", position: "relative" }}>
      <Typography variant="body1" color="primary">
        Approvals
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Add a pre-approved approval workflow or create a custom or conditional
        workflow to get the contract approved before signing
      </Typography>
      <Divider style={{ margin: "20px 0" }} />

      <div style={{ flex: 1, textAlign: "right" }}>
        <Button variant="text" color="primary" sx={{ textTransform: "none" }}>
          + Set Approvals
        </Button>
      </div>

      {approvalList?.map((approval) => (
        <Grid
          container
          key={approval.id}
          spacing={1}
          alignItems="center"
          wrap="nowrap"
        >
          <Grid item xs>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {approval.name}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {approval.type}
            </Typography>
          </Grid>

          <Grid item>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {approval.approver && approval.approver.length > 0 ? (
                approval.approver.map((appr: any, index: any) => (
                  <Box
                    key={appr._id}
                    sx={{
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      backgroundColor:
                        bubbleColors[index % bubbleColors.length],
                      color: "#FFFFFF",
                      marginRight: -1,
                      fontSize: "10px",
                    }}
                  >
                    <Typography>
                      {appr.firstName?.charAt(0).toUpperCase()}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: "text.secondary" }}>-</Typography>
              )}
            </Box>
          </Grid>

          <Grid item>
            <Button
              variant="text"
              color="primary"
              sx={{ textTransform: "none", fontSize: "0.75rem" }}
            >
              Approve
            </Button>
            <Button
              variant="text"
              color="primary"
              sx={{ textTransform: "none", fontSize: "0.75rem" }}
            >
              Reject
            </Button>
          </Grid>
        </Grid>
      ))}
    </div>
  );
};

export default ApprovalsComp;
