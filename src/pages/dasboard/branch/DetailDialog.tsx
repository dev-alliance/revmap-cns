/* eslint-disable @typescript-eslint/no-explicit-any */
// DetailDialog.tsx
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { getBranchByid } from "@/service/api/apiMethods";

interface DetailDialogProps {
  open: boolean;
  id: any; // Replace 'any' with the type of your data
  onClose: () => void;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ open, id, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const listData = async () => {
    try {
      setIsLoading(true);
      const data = await getBranchByid(id);
      console.log(data);

      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    if (id) listData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  console.log(data, "data");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {" "}
        <strong>Branch Details</strong>
      </DialogTitle>
      <DialogContent>
        <p>
          <strong style={{ fontSize: "16px" }}>Branch Name:</strong>{" "}
          {data?.branchName}
        </p>
        <p>
          <strong style={{ fontSize: "16px" }}>BranchId:</strong>{" "}
          {data?.branchId}
        </p>
        <p>
          <strong style={{ fontSize: "16px" }}>Address:</strong> {data?.address}
        </p>
        <p>
          <strong style={{ fontSize: "16px" }}>Pin Code:</strong>{" "}
          {data?.pinCode}
        </p>
        <p>
          <strong style={{ fontSize: "16px" }}>Contact:</strong> {data?.contact}
        </p>
        <p>
          <strong style={{ fontSize: "16px" }}>Country:</strong> {data?.country}
        </p>
        <p>
          <strong style={{ fontSize: "16px" }}>State:</strong> {data?.state}
        </p>
        <p>
          <strong style={{ fontSize: "16px" }}>Website:</strong> {data?.website}
        </p>
        <p>
          <strong style={{ fontSize: "16px" }}>Created By:</strong>{" "}
          {data?.createdByName}
        </p>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailDialog;
