"use client";

import { LogOutIcon, LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/constants/routes";
import { authClient } from "@/lib/auth-client";

export const AccountButton = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session) {
    // Sign-in defaults to the dashboard.
    return (
      <Button
        nativeButton={false}
        render={<Link href={ROUTES.SIGN_IN} />}
        variant="secondary"
        size="sm"
        className="h-8 rounded-full px-3.5"
        aria-busy={isPending}
      >
        Log in
      </Button>
    );
  }

  const name = session.user.name || session.user.email;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            aria-label={`Open account menu for ${name}`}
          />
        }
      >
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold uppercase">
            {name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate font-normal">
            <span className="text-muted-foreground block text-xs">
              Signed in as
            </span>
            {session.user.email}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={ROUTES.DASHBOARD} />}>
          <LayoutDashboardIcon /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={async () => {
            const result = await authClient.signOut();
            if (result.error) {
              toast.error("Could not sign out. Please try again.");
              return;
            }
            window.location.assign(ROUTES.HOME);
          }}
        >
          <LogOutIcon /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
