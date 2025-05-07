import * as React from "react";
import { useAccount, useSwitchChain } from "wagmi";
import {
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";

export default function ChainPicker() {
  const { chain } = useAccount();
  const { chains, switchChain } = useSwitchChain();

  const handleChange = (event: SelectChangeEvent<number>) => {
    const chainId = event.target.value as number;
    switchChain({ chainId });
  };

  return (
    <FormControl className="w-full max-w-xs">
      <Select
        labelId="chain-picker-label"
        value={chain?.id || ""}
        onChange={handleChange}
        sx={{
          color: "white",
          ".MuiSvgIcon-root ": {
            fill: "white !important",
          },
        }}
        className="border-white border-1 rounded-md"
        displayEmpty
        renderValue={(value) => (value ? chain?.name : "Select a chain")}
      >
        {chains.map((item) => (
          <MenuItem
            hidden={item.id === chain?.id}
            key={item.id}
            value={item.id}
            selected={item.id === chain?.id}
          >
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
