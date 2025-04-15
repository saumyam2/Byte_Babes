"use client";

import React from "react";
import { ChatProvider } from "../../../hooks/useChat";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ChatProvider>{children}</ChatProvider>;
}
