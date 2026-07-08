"use client";
import { useEffect, useState } from "react";
import { projectsApi } from "@/lib/api";
import ServicePageWrapper from "@/components/shared/ServicePageWrapper";
import ServicePage from "@/components/shared/ServicePage";
import { RESEARCH_DATA } from "@/lib/services-data";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";


export default function ResearchServicePage() {
  return <ServicePage data={RESEARCH_DATA} />;
}