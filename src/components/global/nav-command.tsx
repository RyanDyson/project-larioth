"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  BankIcon,
  BarbellIcon,
  ChatCircleIcon,
  CompassIcon,
  CurrencyDollarIcon,
  MusicNotesIcon,
  RobotIcon,
  SquaresFourIcon,
  WalletIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowElbowDownLeftIcon,
} from "@phosphor-icons/react";
import { KeyboardIcon } from "./keyboard-icon";

export const GLOBAL_COMMAND_OPEN_EVENT = "app:open-command-palette";

export function openCommand() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(GLOBAL_COMMAND_OPEN_EVENT));
}

export function openGlobalCommandPalette() {
  openCommand();
}

export function useCommandPalette() {
  return {
    openCommand,
  };
}

const routes = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: SquaresFourIcon,
    shortcut: "G D",
  },
  {
    label: "Chat",
    href: "/dashboard/chat",
    icon: RobotIcon,
    shortcut: "G C",
  },
  {
    label: "Finance",
    href: "/dashboard/finance",
    icon: WalletIcon,
    shortcut: "G F",
  },
  {
    label: "Fitness",
    href: "/dashboard/fitness",
    icon: BarbellIcon,
    shortcut: "G W",
  },
  {
    label: "Media",
    href: "/dashboard/media",
    icon: MusicNotesIcon,
    shortcut: "G M",
  },
];

const actions = [
  {
    label: "Create New Chat",
    shortcut: "N C",
    href: "/dashboard/chat?action=new-chat",
    icon: ChatCircleIcon,
  },
  {
    label: "Input New Expense",
    shortcut: "N E",
    href: "/dashboard/finance?action=new-expense",
    icon: CurrencyDollarIcon,
  },
  {
    label: "Input New Income",
    shortcut: "N I",
    href: "/dashboard/finance?action=new-income",
    icon: BankIcon,
  },
];

export function NavCommand() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    const onOpenEvent = () => setOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(GLOBAL_COMMAND_OPEN_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(GLOBAL_COMMAND_OPEN_EVENT, onOpenEvent);
    };
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="from-background/80 to-background/90 max-w-2xl bg-linear-to-b backdrop-blur-md"
    >
      <Command className="divide-border/70 flex flex-col divide-y bg-transparent px-0">
        <div className="pb-2">
          <CommandInput placeholder="Search routes, actions, and workflows..." />
        </div>

        <CommandList>
          <CommandEmpty>
            <div className="text-muted-foreground flex flex-col items-center gap-1 py-8 text-center text-xs">
              <CompassIcon className="size-4" />
              <p>No command found.</p>
              <p>
                Try &quot;chat&quot;, &quot;finance&quot;, or &quot;new
                expense&quot;.
              </p>
            </div>
          </CommandEmpty>

          <CommandGroup heading="Apps">
            {routes.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <CommandItem
                  key={item.href}
                  onSelect={() => navigate(item.href)}
                  data-checked={isActive}
                  className="cursor-pointer py-2 transition-all duration-100"
                >
                  <Icon className="size-4" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">
                      {item.label}
                    </span>
                  </div>
                  {isActive && (
                    <span className="from-primary/20 to-primary/30 border-primary/40 text-primary rounded-md border bg-linear-to-b px-1.5 py-0.5 text-[10px] font-medium">
                      Current
                    </span>
                  )}
                  <CommandShortcut className="flex items-center justify-end gap-1">
                    {item.shortcut.split(" ").map((part, index) => (
                      <KeyboardIcon
                        key={index}
                        text={part}
                        className="pl-[0.075rem]"
                      />
                    ))}
                  </CommandShortcut>
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Quick Actions">
            {actions.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.label}
                  onSelect={() => navigate(item.href)}
                  className="cursor-pointer py-2 transition-all duration-100"
                >
                  <Icon className="size-4" />
                  <span className="flex-1 text-sm font-medium">
                    {item.label}
                  </span>
                  <CommandShortcut className="flex items-center justify-end gap-1">
                    {item.shortcut.split(" ").map((part, index) => (
                      <KeyboardIcon
                        key={index}
                        text={part}
                        className="pl-[0.075rem]"
                      />
                    ))}
                  </CommandShortcut>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>

        <div className="text-muted-foreground border-t px-3 py-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <KeyboardIcon text={<ArrowDownIcon />} />
              <KeyboardIcon text={<ArrowUpIcon />} /> to navigate
            </span>
            <span className="flex items-center gap-1">
              Press
              <KeyboardIcon text={<ArrowElbowDownLeftIcon />} /> to run
            </span>
          </div>
        </div>
      </Command>
    </CommandDialog>
  );
}
