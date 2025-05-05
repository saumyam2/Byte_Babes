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
            <HoveredLink href="/job-search">Job Search</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Resources">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Success Stories"
              href="/success-stories"
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              description="Get inspired by women who successfully returned to work."
            />
            <ProductItem
              title="Events & Workshops"
              href="/events"
              src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              description="Join our community events and skill-building workshops."
            />
            <ProductItem
              title="Mentorship"
              href="/mentorship"
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              description="Connect with mentors who can guide your career journey."
            />
            <ProductItem
              title="Learning Hub"
              href="/learning"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              description="Access curated learning resources and courses."
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Community">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/forum">Discussion Forum</HoveredLink>
            <HoveredLink href="/networking">Networking</HoveredLink>
            <HoveredLink href="/support-groups">Support Groups</HoveredLink>
            <HoveredLink href="/success-stories">Success Stories</HoveredLink>
          </div>
        </MenuItem>
        <HoveredLink href="/login" className="text-sm font-medium">
          Login
        </HoveredLink>
      </Menu>
    </div>
  );
}