import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            color: "white",
            "& fieldset": {
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
          "& .MuiInputLabel-root": {
            color: "white",
          },
          "& .MuiFormHelperText-root": {
            color: "white",
          },
          "& .MuiInputAdornment-root": {
            color: "white",
          },
          "& .MuiTypography-root": {
            color: "gray",
          },
          "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
            {
              display: "none",
            },
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
          '& label.MuiInputLabel-shrink': {
            color: '#fff',
          },
          '& label.Mui-focused': {
            color: '#fff',
          },
        },
      },
    },
  },
});