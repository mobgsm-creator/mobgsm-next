// components/SignOutMenuItem.tsx
"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function SignOutMenuItem() {
  return (
    
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
 
  );
}
