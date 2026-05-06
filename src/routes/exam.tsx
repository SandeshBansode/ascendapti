import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertTriangle, Clock, Flag, ChevronLeft, ChevronRight, Check, Zap,
} from "lucide-react";
import { QUESTIONS, MAX_VIOLATIONS, EXAM_DURATION_SECONDS } from "@/data/questions";
import { ExamState, loadState, saveState, timeRemaining } from "@/lib/examStore";
import { blockShortcuts, enterFullscreen, isFullscreen } from "@/lib/examSecurity";

export const Route = createFileRoute("/exam")({
  head: () => ({ meta: [{ title: "Ascend 2K26 — Exam in Progress" }] }),
  component: ExamPage,
});

function fmt(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function ExamPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<ExamState | null>(null);
  const [remaining, setRemaining] = useState(EXAM_DURATION_SECONDS);
  const [warning, setWarning] = useState<string | null>(null);
  const stateRef = useRef<ExamState | null>(null);

  // init
  useEffect(() => {
    const s = loadState();
    if (!s || s.submitted) {
      navigate({ to: "/" });
      return;
    }
    setState(s);
    stateRef.current = s;
    setRemaining(timeRemaining(s));
  }, [navigate]);

  const update = useCallback((upd: (s: ExamState) => ExamState) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = upd(prev);
      stateRef.current = next;
      saveState(next);
      return next;
    });
  }, []);

  const submit = useCallback(() => {
    const s = stateRef.current;
    if (!s || s.submitted) return;
    const next = { ...s, submitted: true, submittedAt: Date.now() };
    saveState(next);
    stateRef.current = next;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    navigate({ to: "/result" });
  }, [navigate]);

  const addViolation = useCallback(
    (reason: string) => {
      const s = stateRef.current;
      if (!s || s.submitted) return;
      const next = { ...s, violations: s.violations + 1 };
      stateRef.current = next;
      saveState(next);
      setState(next);
      setWarning(`⚠ ${reason} — Violation ${next.violations}/${MAX_VIOLATIONS}`);
      setTimeout(() => setWarning(null), 4000);
      if (next.violations >= MAX_VIOLATIONS) {
        setTimeout(submit, 600);
      }
    },
    [submit]
  );

  // Timer
  useEffect(() => {
    if (!state) return;
    const id = setInterval(() => {
      const r = timeRemaining(stateRef.current!);
      setRemaining(r);
      if (r <= 0) submit();
    }, 1000);
    return () => clearInterval(id);
  }, [state, submit]);

  // Anti-cheat listeners
  useEffect(() => {
    if (!state) return;

    const onVis = () => {
      if (document.visibilityState === "hidden") addViolation("Tab switched / window hidden");
    };
    const onBlur = () => addViolation("Browser focus lost");
    const onFs = () => {
      if (!isFullscreen()) {
        addViolation("Exited fullscreen mode");
        enterFullscreen();
      }
    };
    const onContext = (e: MouseEvent) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => blockShortcuts(e);
    const onCopy = (e: ClipboardEvent) => e.preventDefault();
    const onSelect = (e: Event) => e.preventDefault();

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("keydown", onKey);
    document.addEventListener("copy", onCopy);
    document.addEventListener("paste", onCopy);
    document.addEventListener("cut", onCopy);
    document.addEventListener("selectstart", onSelect);

    if (!isFullscreen()) enterFullscreen();

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("paste", onCopy);
      document.removeEventListener("cut", onCopy);
      document.removeEventListener("selectstart", onSelect);
    };
  }, [state, addViolation]);

  if (!state) return null;

  const q = QUESTIONS[state.current];
  const selected = state.answers[state.current];

  const goto = (i: number) =>
    update((s) => ({ ...s, current: i, visited: { ...s.visited, [i]: true } }));
  const choose = (opt: number) =>
    update((s) => ({ ...s, answers: { ...s.answers, [s.current]: opt } }));
  const toggleMark = () =>
    update((s) => ({ ...s, marked: { ...s.marked, [s.current]: !s.marked[s.current] } }));

  const lowTime = remaining < 300;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-bold text-sm">ASCEND <span className="neon-text">2K26</span></div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Aptitude Exam</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${lowTime ? "border-destructive bg-destructive/10 text-destructive" : "border-primary/40 bg-primary/10 text-primary"}`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold tabular-nums">{fmt(remaining)}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${state.violations > 0 ? "border-destructive bg-destructive/10 text-destructive" : "border-border bg-secondary/40 text-muted-foreground"}`}>
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-semibold">{state.violations}/{MAX_VIOLATIONS}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Warning banner */}
      {warning && (
        <div className="bg-destructive text-destructive-foreground text-center py-2 text-sm font-medium animate-pulse">
          {warning}
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="lg:w-72 border-b lg:border-b-0 lg:border-r border-border p-4 bg-card/40">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Question Palette</div>
          <div className="grid grid-cols-8 lg:grid-cols-5 gap-2">
            {QUESTIONS.map((_, i) => {
              const ans = state.answers[i] !== undefined;
              const mk = state.marked[i];
              const vis = state.visited[i];
              const cur = i === state.current;
              let cls = "bg-secondary text-muted-foreground border-border";
              if (vis && !ans) cls = "bg-destructive/20 text-destructive border-destructive/40";
              if (ans) cls = "bg-primary/20 text-primary border-primary/50";
              if (mk) cls = "bg-accent/20 text-accent border-accent/50";
              if (cur) cls += " ring-2 ring-primary";
              return (
                <button
                  key={i}
                  onClick={() => goto(i)}
                  className={`aspect-square rounded-md border text-sm font-semibold transition ${cls}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-5 space-y-1.5 text-xs">
            <Legend color="bg-primary/30 border-primary/50" label="Answered" />
            <Legend color="bg-accent/30 border-accent/50" label="Marked for review" />
            <Legend color="bg-destructive/20 border-destructive/40" label="Visited, not answered" />
            <Legend color="bg-secondary border-border" label="Not visited" />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 sm:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs px-2.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary uppercase tracking-wider">
              {q.category}
            </div>
            <div className="text-sm text-muted-foreground">
              Question <span className="text-foreground font-bold">{state.current + 1}</span> / {QUESTIONS.length}
            </div>
          </div>

          <Card className="p-6 sm:p-8 bg-card/60 border-primary/20 flex-1">
            {q.direction && (
              <div className="mb-5 p-4 rounded-lg border border-accent/30 bg-accent/5">
                <div className="text-[11px] uppercase tracking-widest text-accent font-bold mb-1">
                  Direction{q.directionRange ? ` (${q.directionRange})` : ""}
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {q.direction}
                </div>
              </div>
            )}
            <h2 className="text-lg sm:text-xl font-semibold mb-6 leading-relaxed">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const sel = selected === i;
                return (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    className={`w-full text-left p-4 rounded-lg border transition group flex items-center gap-3 ${
                      sel
                        ? "border-primary bg-primary/15 text-foreground"
                        : "border-border bg-secondary/30 hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full border flex items-center justify-center text-sm font-bold shrink-0 ${
                        sel
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm sm:text-base">{opt}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Bottom bar */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => goto(Math.max(0, state.current - 1))}
              disabled={state.current === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button
              variant={state.marked[state.current] ? "default" : "outline"}
              onClick={toggleMark}
            >
              <Flag className="w-4 h-4 mr-1" />
              {state.marked[state.current] ? "Unmark" : "Mark for review"}
            </Button>
            <div className="flex-1" />
            {state.current < QUESTIONS.length - 1 ? (
              <Button onClick={() => goto(state.current + 1)}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : null}
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("Submit your exam? This cannot be undone.")) submit();
              }}
            >
              <Check className="w-4 h-4 mr-1" /> Submit Exam
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className={`w-4 h-4 rounded border ${color}`} />
      {label}
    </div>
  );
}
