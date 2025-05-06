"use client"

import React, { createContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface ISnackbarProviderProps {
  children: React.ReactNode;
}

interface ISnackbarValue {
  addMessage: (message: string, severity?: "success" | "error" | "info") => void;
}

export const SnackbarContext = createContext<ISnackbarValue>({
  addMessage: () => {},
});

export default function SnackbarProvider({ children }: ISnackbarProviderProps) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const addMessage = (message: string, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ addMessage }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
