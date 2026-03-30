"use client";

import * as React from "react";
import { AppSidebar } from "@/components/global/app-sidebar";
import { SiteHeader } from "@/components/global/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { cn } from "@/lib/utils";
import {
  PlusIcon,
  PencilSimpleIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DotsThreeIcon,
  CalendarIcon,
  TagIcon,
} from "@phosphor-icons/react";

type CashflowType = "income" | "expense";
type CashflowItem = {
  id: string;
  type: CashflowType;
  amount: number;
  description: string;
  tag: string;
  date: string;
};

const TAGS = [
  "Grocery",
  "Gym",
  "Transport",
  "Housing",
  "Entertainment",
  "Food",
  "Health",
  "Salary",
  "Freelance",
  "Other",
];

const seedData: CashflowItem[] = [
  {
    id: "1",
    type: "income",
    amount: 5000,
    description: "Monthly Salary",
    tag: "Salary",
    date: "2026-03-01",
  },
  {
    id: "2",
    type: "expense",
    amount: 85,
    description: "Gym membership",
    tag: "Gym",
    date: "2026-03-02",
  },
  {
    id: "3",
    type: "expense",
    amount: 120,
    description: "Weekly groceries",
    tag: "Grocery",
    date: "2026-03-03",
  },
  {
    id: "4",
    type: "expense",
    amount: 45,
    description: "Lunch & dinner",
    tag: "Food",
    date: "2026-03-04",
  },
  {
    id: "5",
    type: "income",
    amount: 800,
    description: "Freelance project",
    tag: "Freelance",
    date: "2026-03-05",
  },
  {
    id: "6",
    type: "expense",
    amount: 1200,
    description: "Rent",
    tag: "Housing",
    date: "2026-03-06",
  },
  {
    id: "7",
    type: "expense",
    amount: 30,
    description: "Bus pass",
    tag: "Transport",
    date: "2026-03-07",
  },
  {
    id: "8",
    type: "expense",
    amount: 60,
    description: "Movie & dinner",
    tag: "Entertainment",
    date: "2026-03-08",
  },
  {
    id: "9",
    type: "expense",
    amount: 95,
    description: "Doctor visit",
    tag: "Health",
    date: "2026-03-09",
  },
  {
    id: "10",
    type: "expense",
    amount: 75,
    description: "Weekly groceries",
    tag: "Grocery",
    date: "2026-03-10",
  },
];

const TAG_COLORS: Record<string, string> = {
  Grocery: "var(--chart-1)",
  Gym: "var(--chart-2)",
  Transport: "var(--chart-3)",
  Housing: "var(--chart-4)",
  Entertainment: "var(--chart-5)",
  Food: "oklch(0.7 0.15 150)",
  Health: "oklch(0.7 0.15 30)",
  Salary: "oklch(0.6 0.2 140)",
  Freelance: "oklch(0.6 0.2 200)",
  Other: "oklch(0.6 0 0)",
};

type TimePeriod = "month" | "alltime";

export default function FinancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = React.useState<CashflowItem[]>(seedData);
  const [period, setPeriod] = React.useState<TimePeriod>("month");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] =
    React.useState<Partial<CashflowItem> | null>(null);

  const filtered = React.useMemo(() => {
    if (period === "alltime") return items;
    const now = new Date();
    return items.filter((i) => {
      const d = new Date(i.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
  }, [items, period]);

  const totalIncome = filtered
    .filter((i) => i.type === "income")
    .reduce((s, i) => s + i.amount, 0);
  const totalExpenses = filtered
    .filter((i) => i.type === "expense")
    .reduce((s, i) => s + i.amount, 0);
  const balance = totalIncome - totalExpenses;

  const expenseByTag = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of filtered.filter((i) => i.type === "expense")) {
      map[item.tag] = (map[item.tag] ?? 0) + item.amount;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  React.useEffect(() => {
    const action = searchParams.get("action");
    if (action === "new-expense") {
      openNew("expense");
      router.replace("/dashboard/finance");
      return;
    }

    if (action === "new-income") {
      openNew("income");
      router.replace("/dashboard/finance");
    }
  }, [router, searchParams]);

  function openNew(type: CashflowType) {
    setEditingItem({
      type,
      amount: 0,
      description: "",
      tag: "Other",
      date: new Date().toISOString().split("T")[0],
    });
    setIsDialogOpen(true);
  }

  function openEdit(item: CashflowItem) {
    setEditingItem({ ...item });
    setIsDialogOpen(true);
  }

  function saveItem() {
    if (!editingItem?.description || !editingItem.amount) return;
    if (editingItem.id) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id ? (editingItem as CashflowItem) : i,
        ),
      );
    } else {
      setItems((prev) => [
        ...prev,
        { ...editingItem, id: crypto.randomUUID() } as CashflowItem,
      ]);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const chartConfig = Object.fromEntries(
    expenseByTag.map(({ name }) => [
      name,
      { label: name, color: TAG_COLORS[name] ?? "var(--chart-1)" },
    ]),
  );

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Finance Tracker</h1>
            <p className="text-muted-foreground text-sm">
              Track your income and expenses
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tabs
              value={period}
              onValueChange={(v) => setPeriod(v as TimePeriod)}
            >
              <TabsList>
                <TabsTrigger value="month">
                  <CalendarIcon className="mr-1 size-3.5" />
                  This Month
                </TabsTrigger>
                <TabsTrigger value="alltime">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button size="sm" onClick={() => openNew("expense")}>
              <PlusIcon className="mr-1 size-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ArrowUpIcon className="size-4 text-green-500" />
                <span className="text-2xl font-semibold">
                  ${totalIncome.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ArrowDownIcon className="size-4 text-red-500" />
                <span className="text-2xl font-semibold">
                  ${totalExpenses.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span
                className={cn(
                  "text-2xl font-semibold",
                  balance >= 0 ? "text-green-500" : "text-red-500",
                )}
              >
                {balance >= 0 ? "+" : ""}${balance.toLocaleString()}
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Pie Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-sm">Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {expenseByTag.length > 0 ? (
                <>
                  <ChartContainer config={chartConfig} className="h-50 w-full">
                    <PieChart>
                      <Pie
                        data={expenseByTag}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {expenseByTag.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={TAG_COLORS[entry.name] ?? "var(--chart-1)"}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="mt-2 flex w-full flex-col gap-1">
                    {expenseByTag.map(({ name, value }) => (
                      <div
                        key={name}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-1.5">
                          <div
                            className="size-2.5 rounded-full"
                            style={{
                              background: TAG_COLORS[name] ?? "var(--chart-1)",
                            }}
                          />
                          <span className="text-muted-foreground">{name}</span>
                        </div>
                        <span className="font-medium">${value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground py-12 text-sm">
                  No expenses
                </p>
              )}
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Transactions</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openNew("income")}
                >
                  <ArrowUpIcon className="mr-1 size-3 text-green-500" />
                  Income
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openNew("expense")}
                >
                  <ArrowDownIcon className="mr-1 size-3 text-red-500" />
                  Expense
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {item.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          <TagIcon className="mr-1 size-2.5" />
                          {item.tag}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-semibold tabular-nums",
                          item.type === "income"
                            ? "text-green-500"
                            : "text-red-500",
                        )}
                      >
                        {item.type === "income" ? "+" : "-"}$
                        {item.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="hover:bg-accent inline-flex size-7 items-center justify-center rounded-md">
                            <DotsThreeIcon className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(item)}>
                              <PencilSimpleIcon className="mr-2 size-3.5" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => deleteItem(item.id)}
                            >
                              <TrashIcon className="mr-2 size-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {sorted.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-muted-foreground py-8 text-center"
                      >
                        No transactions yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id
                ? "Edit Transaction"
                : `Add ${editingItem?.type === "income" ? "Income" : "Expense"}`}
            </DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label>Type</Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={
                      editingItem.type === "income" ? "default" : "outline"
                    }
                    onClick={() =>
                      setEditingItem({ ...editingItem, type: "income" })
                    }
                    className="flex-1"
                  >
                    <ArrowUpIcon className="mr-1 size-3.5" />
                    Income
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      editingItem.type === "expense" ? "default" : "outline"
                    }
                    onClick={() =>
                      setEditingItem({ ...editingItem, type: "expense" })
                    }
                    className="flex-1"
                  >
                    <ArrowDownIcon className="mr-1 size-3.5" />
                    Expense
                  </Button>
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label>Description</Label>
                <Input
                  placeholder="e.g. Weekly groceries"
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Amount ($)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  min={0}
                  value={editingItem.amount ?? ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Tag</Label>
                <Select
                  value={editingItem.tag}
                  onValueChange={(v) =>
                    setEditingItem({ ...editingItem, tag: v ?? undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAGS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={editingItem.date}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, date: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveItem}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
