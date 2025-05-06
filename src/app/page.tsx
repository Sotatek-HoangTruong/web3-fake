"use client";

import { useCallback } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchAccount,
} from "wagmi";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SxProps, Theme } from "@mui/material";
import ChainPicker from "@/components/common/ChainPicker";

const style: SxProps<Theme> = {
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
  alignItems: "center",
  gap: 1,
};

export default function HomePage() {
  const account = useAccount();
  const { isConnected, isConnecting, address } = account;
  const { connectors, connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchAccount } = useSwitchAccount();

  const [open, setOpen] = useState(false);

  const handleConnectMetaMask = useCallback(async () => {
    const metaMaskConnector = connectors.find(
      (connector) => connector.name === "MetaMask"
    );
    if (metaMaskConnector) {
      try {
        const res = await connectAsync({ connector: metaMaskConnector });
      } catch (error) {
        console.log("error", error);
      } finally {
        setOpen(false);
      }
    }
  }, [connectAsync, connectors]);

  const handleDisconnect = useCallback(() => {
    const metaMaskConnector = connectors.find(
      (connector) => connector.name === "MetaMask"
    );
    if (metaMaskConnector) {
      disconnect({ connector: metaMaskConnector });
    }
  }, [disconnect, connectors]);

  const handleSwitchAccount = useCallback(() => {
    const metaMaskConnector = connectors.find(
      (connector) => connector.name === "MetaMask"
    );
    if (metaMaskConnector) {
      switchAccount(
        { connector: metaMaskConnector },
        {
          onSuccess: (data, variable) => {
            console.log("Switch account success", data, variable);
          },
          onError: (error, variable) => {
            console.error("Switch account error", error, variable);
          },
        }
      );
    }
  }, [switchAccount, connectors]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Typography variant="h4" gutterBottom className="text-2xl font-bold mb-6">
        Welcome to Hoang Truong dApp
      </Typography>
      {!isConnected && !isConnecting ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign In
        </Button>
      ) : (
        <Box className="items-center justify-center flex flex-col gap-4">
          <Typography variant="h6" className="text-lg font-semibold mb-4">
            Connected with {account.connector?.name} - Address: {address}
          </Typography>
          <ChainPicker />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSwitchAccount}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Switch Account
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDisconnect}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Out
          </Button>
        </Box>
      )}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style} className="bg-white p-6 rounded-lg shadow-lg">
          <Typography
            variant="h6"
            color="black"
            component="h2"
            className="text-lg font-semibold mb-4"
          >
            Choose Wallet to Connect
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            className="w-full mb-2 border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={handleConnectMetaMask}
          >
            MetaMask
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className="w-full mb-2 border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            WalletConnect
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Coinbase Wallet
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
