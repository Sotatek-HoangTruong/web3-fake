import * as React from "react";
import Link from "next/link";
import Balance from "../Balance";

export default function Header() {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold">Hoang DealDo DApp</h1>
        <nav className="flex space-x-4">
          <Link href="/" className="hover:text-gray-400">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-400">
            About
          </Link>
          <Link href="/contact" className="hover:text-gray-400">
            Contact
          </Link>
        </nav>
        <Balance />
      </div>
    </div>
  );
}
