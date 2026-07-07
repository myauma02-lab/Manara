"use client";
import { Suspense } from "react";
import CariClient from "./CariClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CariClient />
    </Suspense>
  );
}