"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Career Tools">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/skill-gap">Skill Gap Analysis</HoveredLink>
            <HoveredLink href="/resume-feedback">Resume Feedback</HoveredLink>
            <HoveredLink href="/career-roadmap">Career Roadmap</HoveredLink>
            <HoveredLink href="/mentorship">Find a Mentor</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Resources">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Success Stories"
              href="/success-stories"
              src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=200"
              description="Get inspired by women who've successfully returned to work."
            />
            <ProductItem
              title="Learning Hub"
              href="/learning"
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=200"
              description="Access courses, workshops, and resources for upskilling."
            />
            <ProductItem
              title="Community"
              href="/community"
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=200"
              description="Connect with other women in tech and share experiences."
            />
            <ProductItem
              title="Events"
              href="/events"
              src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=200"
              description="Discover networking events, workshops, and webinars."
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Job Search">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/jobs">Browse Jobs</HoveredLink>
            <HoveredLink href="/companies">Companies</HoveredLink>
            <HoveredLink href="/saved-jobs">Saved Jobs</HoveredLink>
            <HoveredLink href="/job-alerts">Job Alerts</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Profile">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/dashboard">Dashboard</HoveredLink>
            <HoveredLink href="/profile">My Profile</HoveredLink>
            <HoveredLink href="/applications">Applications</HoveredLink>
            <HoveredLink href="/settings">Settings</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}