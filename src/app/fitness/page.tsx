"use client";

import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  PlusIcon,
  PencilSimpleIcon,
  TrashIcon,
  PlayIcon,
  CheckCircleIcon,
  CalendarIcon,
  BarbellIcon,
  SoccerBallIcon,
  XIcon,
} from "@phosphor-icons/react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY_INDEX = (new Date().getDay() + 6) % 7; // 0=Mon

type Exercise = { name: string; targetReps: number };
type Routine = {
  id: string;
  name: string;
  day: number;
  isSport: boolean;
  exercises: Exercise[];
};

const seedRoutines: Routine[] = [
  {
    id: "1",
    name: "Push Day",
    day: 0,
    isSport: false,
    exercises: [
      { name: "Bench Press", targetReps: 10 },
      { name: "Overhead Press", targetReps: 8 },
      { name: "Tricep Dips", targetReps: 12 },
    ],
  },
  {
    id: "2",
    name: "Pull Day",
    day: 2,
    isSport: false,
    exercises: [
      { name: "Pull Ups", targetReps: 8 },
      { name: "Barbell Row", targetReps: 10 },
      { name: "Bicep Curls", targetReps: 12 },
    ],
  },
  {
    id: "3",
    name: "Bouldering",
    day: 4,
    isSport: true,
    exercises: [],
  },
  {
    id: "4",
    name: "Leg Day",
    day: 3,
    isSport: false,
    exercises: [
      { name: "Squat", targetReps: 10 },
      { name: "Romanian Deadlift", targetReps: 10 },
      { name: "Leg Press", targetReps: 15 },
    ],
  },
];

const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const completedDays = new Set([1, 3, 5, 6, 8, 10, 12, 13]);

export default function FitnessPage() {
  const [routines, setRoutines] = React.useState<Routine[]>(seedRoutines);
  const [activeSession, setActiveSession] = React.useState<{
    routine: Routine;
    reps: Record<string, number>;
    done: Set<string>;
  } | null>(null);
  const [editingRoutine, setEditingRoutine] = React.useState<Routine | null>(
    null,
  );
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);

  function startRoutine(routine: Routine) {
    setActiveSession({
      routine,
      reps: Object.fromEntries(routine.exercises.map((e) => [e.name, 0])),
      done: new Set(),
    });
    setIsSessionOpen(true);
  }

  function openEdit(routine: Routine) {
    setEditingRoutine(JSON.parse(JSON.stringify(routine)));
    setIsEditOpen(true);
  }

  function saveEdit() {
    if (!editingRoutine) return;
    setRoutines((prev) =>
      prev.map((r) => (r.id === editingRoutine.id ? editingRoutine : r)),
    );
    setIsEditOpen(false);
  }

  function deleteRoutine(id: string) {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  }

  function addExercise() {
    if (!editingRoutine) return;
    setEditingRoutine({
      ...editingRoutine,
      exercises: [...editingRoutine.exercises, { name: "", targetReps: 10 }],
    });
  }

  function updateExercise(
    idx: number,
    field: keyof Exercise,
    value: string | number,
  ) {
    if (!editingRoutine) return;
    const exercises = [...editingRoutine.exercises];
    exercises[idx] = { ...exercises[idx]!, [field]: value };
    setEditingRoutine({ ...editingRoutine, exercises });
  }

  function removeExercise(idx: number) {
    if (!editingRoutine) return;
    setEditingRoutine({
      ...editingRoutine,
      exercises: editingRoutine.exercises.filter((_, i) => i !== idx),
    });
  }

  function incrementRep(name: string) {
    if (!activeSession) return;
    setActiveSession({
      ...activeSession,
      reps: {
        ...activeSession.reps,
        [name]: (activeSession.reps[name] ?? 0) + 1,
      },
    });
  }

  function toggleDone(name: string) {
    if (!activeSession) return;
    const done = new Set(activeSession.done);
    done.has(name) ? done.delete(name) : done.add(name);
    setActiveSession({ ...activeSession, done });
  }

  const routinesByDay = React.useMemo(() => {
    const map: Record<number, Routine[]> = {};
    for (const r of routines) {
      if (!map[r.day]) map[r.day] = [];
      map[r.day]!.push(r);
    }
    return map;
  }, [routines]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Fitness Tracker</h1>
              <p className="text-muted-foreground text-sm">
                Your weekly workout schedule
              </p>
            </div>
            <Button size="sm">
              <PlusIcon className="mr-1 size-4" />
              Add Routine
            </Button>
          </div>

          <Tabs defaultValue="schedule">
            <TabsList>
              <TabsTrigger value="schedule">
                <BarbellIcon className="mr-1 size-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <CalendarIcon className="mr-1 size-4" />
                Calendar
              </TabsTrigger>
            </TabsList>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="mt-4">
              <div className="grid grid-cols-7 gap-3">
                {DAYS.map((day, idx) => {
                  const isToday = idx === TODAY_INDEX;
                  const dayRoutines = routinesByDay[idx] ?? [];
                  return (
                    <div
                      key={day}
                      className={cn(
                        "flex min-h-50 flex-col gap-2 rounded-xl border p-3",
                        isToday &&
                          "border-primary bg-primary/5 ring-primary/30 ring-1",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            isToday ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {day}
                        </span>
                        {isToday && (
                          <Badge
                            variant="outline"
                            className="text-primary border-primary/40 px-1.5 py-0 text-xs"
                          >
                            Today
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        {dayRoutines.length === 0 && (
                          <p className="text-muted-foreground mt-2 text-xs">
                            Rest day
                          </p>
                        )}
                        {dayRoutines.map((routine) => (
                          <Card
                            key={routine.id}
                            className={cn(
                              "cursor-pointer transition-shadow hover:shadow-md",
                              isToday && "border-primary/30",
                            )}
                          >
                            <CardHeader className="p-3 pb-1.5">
                              <div className="flex items-start justify-between gap-1">
                                <div className="flex items-center gap-1.5">
                                  {routine.isSport ? (
                                    <SoccerBallIcon className="text-muted-foreground size-3.5 shrink-0" />
                                  ) : (
                                    <BarbellIcon className="text-muted-foreground size-3.5 shrink-0" />
                                  )}
                                  <CardTitle className="text-xs leading-tight font-medium">
                                    {routine.name}
                                  </CardTitle>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-3 pt-1">
                              {!routine.isSport && (
                                <p className="text-muted-foreground text-xs">
                                  {routine.exercises.length} exercises
                                </p>
                              )}
                              {routine.isSport && (
                                <Badge variant="secondary" className="text-xs">
                                  Sport
                                </Badge>
                              )}
                              <div className="mt-2 flex gap-1">
                                {isToday && (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="h-6 flex-1 px-2 text-xs"
                                    onClick={() => startRoutine(routine)}
                                  >
                                    <PlayIcon className="mr-0.5 size-3" />
                                    Start
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => openEdit(routine)}
                                >
                                  <PencilSimpleIcon className="size-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive h-6 w-6 p-0"
                                  onClick={() => deleteRoutine(routine.id)}
                                >
                                  <TrashIcon className="size-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">March 2026</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 grid grid-cols-7 gap-1">
                    {DAYS.map((d) => (
                      <div
                        key={d}
                        className="text-muted-foreground py-1 text-center text-xs font-medium"
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  {/* offset: March 2026 starts on Sunday, which is index 6 in Mon-first grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {MONTH_DAYS.map((d) => {
                      const isCompleted = completedDays.has(d);
                      const isToday = d === 11;
                      return (
                        <div
                          key={d}
                          className={cn(
                            "flex aspect-square flex-col items-center justify-center rounded-lg text-sm font-medium transition-colors",
                            isCompleted && "bg-primary text-primary-foreground",
                            isToday &&
                              !isCompleted &&
                              "ring-primary text-primary ring-2",
                            !isCompleted &&
                              !isToday &&
                              "text-muted-foreground hover:bg-accent",
                          )}
                        >
                          {d}
                          {isCompleted && (
                            <CheckCircleIcon className="mt-0.5 size-3" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>

      {/* Edit Routine Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Routine</DialogTitle>
          </DialogHeader>
          {editingRoutine && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label>Name</Label>
                <Input
                  value={editingRoutine.name}
                  onChange={(e) =>
                    setEditingRoutine({
                      ...editingRoutine,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Day</Label>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS.map((d, i) => (
                    <Button
                      key={d}
                      size="sm"
                      variant={editingRoutine.day === i ? "default" : "outline"}
                      className="h-8"
                      onClick={() =>
                        setEditingRoutine({ ...editingRoutine, day: i })
                      }
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-sport"
                  checked={editingRoutine.isSport}
                  onChange={(e) =>
                    setEditingRoutine({
                      ...editingRoutine,
                      isSport: e.target.checked,
                    })
                  }
                  className="size-4"
                />
                <Label htmlFor="is-sport">This is a sport (no exercises)</Label>
              </div>
              {!editingRoutine.isSport && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label>Exercises</Label>
                    <Button size="sm" variant="outline" onClick={addExercise}>
                      <PlusIcon className="mr-1 size-3" />
                      Add
                    </Button>
                  </div>
                  <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
                    {editingRoutine.exercises.map((ex, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          placeholder="Exercise name"
                          value={ex.name}
                          className="h-8 flex-1 text-sm"
                          onChange={(e) =>
                            updateExercise(i, "name", e.target.value)
                          }
                        />
                        <Input
                          type="number"
                          value={ex.targetReps}
                          className="h-8 w-16 text-sm"
                          min={1}
                          onChange={(e) =>
                            updateExercise(
                              i,
                              "targetReps",
                              parseInt(e.target.value) || 1,
                            )
                          }
                        />
                        <span className="text-muted-foreground text-xs">
                          reps
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive h-8 w-8 p-0"
                          onClick={() => removeExercise(i)}
                        >
                          <XIcon className="size-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Active Session Dialog */}
      <Dialog open={isSessionOpen} onOpenChange={setIsSessionOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {activeSession?.routine.name}
              <span className="text-muted-foreground ml-2 text-sm font-normal">
                Active Session
              </span>
            </DialogTitle>
          </DialogHeader>
          {activeSession && (
            <div className="flex flex-col gap-3">
              {activeSession.routine.isSport ? (
                <div className="py-8 text-center">
                  <SoccerBallIcon className="text-muted-foreground mx-auto mb-3 size-12" />
                  <p className="text-muted-foreground">
                    Sport session in progress. Have fun!
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setIsSessionOpen(false)}
                  >
                    <CheckCircleIcon className="mr-1.5 size-4" />
                    Finish Session
                  </Button>
                </div>
              ) : (
                <>
                  {activeSession.routine.exercises.map((ex) => {
                    const current = activeSession.reps[ex.name] ?? 0;
                    const isDone = activeSession.done.has(ex.name);
                    return (
                      <div
                        key={ex.name}
                        className={cn(
                          "flex items-center justify-between rounded-lg border p-3 transition-colors",
                          isDone && "bg-primary/10 border-primary/30",
                        )}
                      >
                        <div>
                          <p
                            className={cn(
                              "text-sm font-medium",
                              isDone && "text-muted-foreground line-through",
                            )}
                          >
                            {ex.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Target: {ex.targetReps} reps
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-center text-lg font-semibold">
                            {current}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => incrementRep(ex.name)}
                            disabled={isDone}
                          >
                            <PlusIcon className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={isDone ? "default" : "ghost"}
                            className="h-8 w-8 p-0"
                            onClick={() => toggleDone(ex.name)}
                          >
                            <CheckCircleIcon className="size-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  <Button
                    className="mt-2"
                    onClick={() => setIsSessionOpen(false)}
                  >
                    <CheckCircleIcon className="mr-1.5 size-4" />
                    Finish Session
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
