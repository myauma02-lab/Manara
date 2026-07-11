import { Suspense } from "react";
import LayananClient from "./LayananClient";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <LayananClient />
    </Suspense>
  );
}