import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  Typography,
  Button,
  Divider,
} from "@mui/material";

const PlanDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md">
      <DialogTitle>Choose a New Plan</DialogTitle>
      <Divider />
      <DialogContent>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Card 1 */}
          <Card
            style={{
              margin: "7px",
              padding: "20px",
              textAlign: "center",
              width: "30%",
              height: "300px", // Fixed height for the card
            }}
          >
            <Typography variant="h5" color="primary">
              Essentials
            </Typography>
            <Typography
              variant="body1"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                height: "80px",
              }}
            >
              Essential features for efficient contract management
            </Typography>
            <Typography variant="subtitle1" color="primary">
              $20
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              per/1 month
            </Typography>
            <Button variant="contained" color="primary" sx={{ mb: 2 }}>
              Select Plan 1
            </Button>
            <Button variant="text" sx={{ mb: -2, textTransform: "none" }}>
              See plan details
            </Button>
          </Card>

          {/* Card 2 */}
          <Card
            style={{
              margin: "7px",
              padding: "20px",
              textAlign: "center",
              width: "30%",
              height: "300px",
            }}
          >
            <Typography variant="h5" color="primary">
              Professional
            </Typography>
            <Typography
              variant="body1"
              style={{
                height: "80px",
              }}
            >
              Take your contract management to the next level with advanced
              tools and customization
            </Typography>
            <Typography variant="subtitle1" color="primary" sx={{ mt: 1 }}>
              $20
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              per/1 month
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 1, textTransform: "none" }}
            >
              Current plan
            </Button>
            <Button variant="text" sx={{ mb: -3, textTransform: "none" }}>
              See plan details
            </Button>
          </Card>

          {/* Card 3 */}
          <Card
            style={{
              margin: "7px",
              padding: "20px",
              textAlign: "center",
              width: "30%",
              height: "300px",
            }}
          >
            <Typography variant="h5" color="primary">
              Enterprise
            </Typography>
            <Typography
              variant="body1"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: "10px",
                height: "112px",
              }}
            >
              Powerful solutions tailored for large-scale contract management
              needs
            </Typography>
            <Typography variant="subtitle1" color="primary">
              Custom
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 2, textTransform: "none" }}
            >
              Current plan
            </Button>
            <Button variant="text" sx={{ mb: -2, textTransform: "none" }}>
              See plan details
            </Button>
          </Card>
        </div>
        <Typography variant="body1" sx={{ mb: 3, mt: 3 }}>
          You're upgrading your subscription to the Professional Plan. Upon your
          plan renewal on dd/mm/yy, the new monthly total will be USD 599 for 10
          user licences. Prorated charges for the current billing cycle will
          reflect on your upcoming invoice. Please note that the price excludes
          applicable taxes, and all charges are subject to our subscriber terms.
        </Typography>

        <Divider />

        <div style={{ textAlign: "right", marginTop: "10px" }}>
          <Button
            sx={{ textTransform: "none" }}
            onClick={onClose}
            variant="outlined"
            color="secondary"
            style={{ marginRight: "10px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: "none" }}
          >
            Change Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDialog;
