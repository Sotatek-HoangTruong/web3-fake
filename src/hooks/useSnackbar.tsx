import { SnackbarContext } from "@/providers/SnackBarProvider";
import { useContext } from "react";

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};