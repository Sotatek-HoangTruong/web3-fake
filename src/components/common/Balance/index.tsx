"use client";

import { Button } from "@mui/material";
import Link from "next/link";
import * as React from "react";
import { useAccount, useBalance } from "wagmi";

export default function Balance() {
  const { address, chain } = useAccount();
  const balance = useBalance({ address });

  return (
    <div>
      {address && (
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="ml-2 font-semibold text-lg">
              Balance: {balance.data?.formatted} {chain?.nativeCurrency.symbol}
            </span>
          </div>
          <Link href={"/transfer"}>
            <Button
              color="primary"
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Transfer
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
