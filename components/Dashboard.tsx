"use client";
import React, {useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import logo from '@/public/images/logo.png';
import profile from '@/public/images/me.jpg';
import Image from "next/image";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ChartBarDecreasing, Grid3x3 } from "lucide-react";

export function SidebarDemo({ children }: { children: React.ReactNode }) {
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-200" />
      ),
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: (
        <ChartBarDecreasing className="h-5 w-5 shrink-0 text-neutral-200"/>
      ),
    },
    {
      label: "Table",
      href: "/table",
      icon: (
        <Grid3x3  className="h-5 w-5 shrink-0 text-neutral-200"/>
      ),
    },
    {
      label: "Logout",
      href: "",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border md:flex-row bg-dark-bg",
        "h-screen", 
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Sura",
                href: "#",
                icon: (
                    <Image src={profile} className="h-8 w-8" alt="Logo" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard>{children}</Dashboard>
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image src={logo} className="h-5 w-5" alt="Logo" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold whitespace-pre text-white font-logo text-2xl"
      >
        queuely
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image src={logo} className="h-5 w-5" alt="Logo" />
    </a>
  );
};


const Dashboard = ({ children } : {children: React.ReactNode}) => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 p-2 md:px-10 md:py-8 border-neutral-700 bg-neutral-900">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      {children}
    </LocalizationProvider>

      </div>
    </div>
  );
};
