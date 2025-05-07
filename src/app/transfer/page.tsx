"use client";

import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { TextField, Button, Box, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { theme } from "@/style/theme/transfer.theme";
import { Address, parseEther } from "viem";
import { useSnackbar } from "@/hooks/useSnackbar";

export default function TransferPage() {
  const { chain, address: accountAddress } = useAccount();
  const { data: dataBalance, refetch } = useBalance({
    address: accountAddress,
  });
  const { sendTransactionAsync } = useSendTransaction();
  const { addMessage } = useSnackbar();

  const [address, setAddress] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [tx, setTx] = React.useState("");

  const result = useWaitForTransactionReceipt({
    hash: tx as Address,
  });

  const handleSubmit = React.useCallback(async () => {
    try {
      if ((dataBalance?.value || 0) < parseEther(amount)) {
        addMessage("Insufficient balance", "error");
        return;
      }
      const tx = await sendTransactionAsync({
        to: address as Address,
        value: parseEther(amount),
      });
      setTx(tx);
      addMessage("Transaction sent successfully", "success");
      setAddress("");
      setAmount("");
    } catch (error) {
      addMessage("Error sending transaction", "error");
      console.log("Error sending transaction:", error);
    }
  }, [addMessage, address, amount, dataBalance, sendTransactionAsync]);

  React.useEffect(() => {
    if (result.status === "success") {
      addMessage("Transaction confirmed", "success");
      refetch();
    } else if (result.status === "error") {
      addMessage("Transaction failed", "error");
    }
  }, [result.status]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <Typography variant="h4" color="white" align="center" gutterBottom>
          Very fast transfer page
        </Typography>
        <TextField
          placeholder="0x..."
          label="Public Address"
          variant="outlined"
          className="w-[320px]"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          label="Amount"
          variant="outlined"
          type="number"
          className="w-[320px]"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {chain?.nativeCurrency.symbol}
                </InputAdornment>
              ),
            },
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </ThemeProvider>
  );
}
