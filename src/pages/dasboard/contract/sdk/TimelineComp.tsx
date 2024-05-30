/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Typography, Divider, Paper } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";
import { getList } from "@/service/api/clauses";

const TimelineComp = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const [isLoading, setIsLoading] = useState(false);
  const [List, setlist] = useState<any[]>([]);

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getList();
      setlist(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listData();
  }, []);

  return (
    <div style={{ textAlign: "left" }}>
      <Typography variant="subtitle1" color="black">
        TimeLine
      </Typography>
      <Divider sx={{ mt: 0.1, mb: 1, pl: -1, background: "#174B8B" }} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {isLoading ? (
          <Typography>Loading timeline...</Typography>
        ) : List.length > 0 ? (
          <Timeline>
            {List.map((item, index) => (
              <TimelineItem key={item._id}>
                <TimelineSeparator>
                  <TimelineDot />
                  {index < List.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6" component="h1">
                    {item.title || "No Title"} {/* Fallback if no title */}
                  </Typography>
                  <Typography>
                    {item.description || "No Description"}{" "}
                    {/* Fallback if no description */}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        ) : (
          <Typography>No timeline data available.</Typography>
        )}
      </div>
    </div>
  );
};

export default TimelineComp;
