import {
  BankIcon,
  BarbellIcon,
  ChatCircleIcon,
  CurrencyDollarIcon,
  MusicNotesIcon,
  RobotIcon,
  SquaresFourIcon,
  WalletIcon,
  type Icon,
} from "@phosphor-icons/react";

export type NavItem = {
  label: string;
  href: string;
  icon: Icon;
  shortcut: string;
};

export const navItems: NavItem[] = [
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
export const actionItems: NavItem[] = [
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
