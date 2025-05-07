"use client";

import * as React from "react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { abi } from "../abi/erc20.abi";
import { CONTRACT_ADDRESS } from "@/constants/env.constant";
import { Address, formatUnits, parseUnits } from "viem";
import { Box, Typography, Button, TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useSnackbar } from "@/hooks/useSnackbar";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export default function SmartContractPage() {
  const { address } = useAccount();
  const { refetch: refetchBalance } = useBalance({
    address: address,
  })

  const { data: symbol } = useReadContract({
    abi: abi,
    address: CONTRACT_ADDRESS as Address,
    functionName: "symbol",
    query: {
      enabled: !!address,
    },
  });
  const { data, refetch } = useReadContract({
    abi: abi,
    address: CONTRACT_ADDRESS as Address,
    functionName: "balanceOf",
    account: address as Address,
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  const { writeContractAsync, data: hash } = useWriteContract();
  const { status: transactionStatus } = useWaitForTransactionReceipt({ hash });
  const { addMessage } = useSnackbar();

  const [message, setMessage] = React.useState("");

  const balanceFormatted = React.useMemo(
    () => (data !== undefined ? formatUnits(data as bigint, 18) : 0),
    [data]
  );

  const handleRefetch = React.useCallback(async () => {
    refetch();
    refetchBalance();
  }, [refetch, refetchBalance]);

  const [isTransferModalOpen, setTransferModalOpen] = React.useState(false);
  const [recipientAddress, setRecipientAddress] = React.useState("");
  const [transferAmount, setTransferAmount] = React.useState("");

  const handleTransferClick = () => {
    setTransferModalOpen(true);
  };

  const handleClaimTokens = React.useCallback(async () => {
    try {
      const resClaim = await writeContractAsync({
        address: CONTRACT_ADDRESS as Address,
        account: address as Address,
        abi: abi,
        functionName: "claim",
        args: [],
      });
      addMessage("Claim transaction sent", "success");
      setMessage("Claim transaction");
    } catch (error) {
      addMessage("Error claiming tokens", "error");
      console.log(error);
    }
  }, [addMessage, address, writeContractAsync]);

  const handleTransferSubmit = React.useCallback(async () => {
    try {
      if (!recipientAddress || !transferAmount) {
        addMessage("Please fill in all fields", "error");
        return;
      }
      await writeContractAsync({
        address: CONTRACT_ADDRESS as Address,
        abi: abi,
        functionName: "transfer",
        args: [recipientAddress, parseUnits(transferAmount, 18)],
      });
      addMessage("Transfer transaction sent", "success");
      setMessage("Transfer transaction");
      handleModalClose();
    } catch (error) {
      addMessage("Error transferring tokens", "error");
      console.log("Error transferring tokens:", error);
    }
  }, [addMessage, recipientAddress, transferAmount, writeContractAsync]);

  const handleModalClose = () => {
    setTransferModalOpen(false);
    setRecipientAddress("");
    setTransferAmount("");
  };

  React.useEffect(() => {
    if (transactionStatus === 'success') {
      addMessage(`${message} confirmed`, "success");
      handleRefetch();
    } else if (transactionStatus === 'error') {
      addMessage(`${message} failed`, "error");
    }
  }, [transactionStatus]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <Typography variant="h4" color="white" align="center" gutterBottom>
        ERC20 Token Management
      </Typography>
      <Typography variant="body1" color="white">
        Your ERC20 Token Balance: {balanceFormatted} {symbol as string}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClaimTokens}>
        Claim
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleTransferClick}
      >
        Transfer ERC20 Token
      </Button>

      <Modal open={isTransferModalOpen} onClose={handleModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" className="text-black">
            Transfer ERC20 Token
          </Typography>
          <TextField
            label="Recipient Address"
            placeholder="0x..."
            fullWidth
            margin="normal"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button onClick={handleModalClose} color="error">
              Cancel
            </Button>
            <Button
              onClick={handleTransferSubmit}
              color="primary"
              variant="contained"
              sx={{ ml: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
