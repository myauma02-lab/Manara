import { Suspense } from "react";
import CariClient from "./cariClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CariClient />
    </Suspense>
  );
}