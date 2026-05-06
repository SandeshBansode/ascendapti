import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, Shield, Clock, AlertTriangle, Maximize2, Ban, FileText, Zap } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { newState, saveState, loadState } from "@/lib/examStore";
import { enterFullscreen } from "@/lib/examSecurity";
import { QUESTIONS, EXAM_DURATION_SECONDS } from "@/data/questions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ascend 2K26 — Aptitude Exam Portal" },
      { name: "description", content: "Ascend 2K26 — Test Your Skills. Rise Beyond Limits. Secure online aptitude exam." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const existing = typeof window !== "undefined" ? loadState() : null;
  const [name, setName] = useState(existing?.studentName ?? "");
  const [year, setYear] = useState(existing?.year ?? "");
  const [branch, setBranch] = useState(existing?.branch ?? "");
  const [rollNumber, setRollNumber] = useState(existing?.rollNumber ?? "");
  const [accepted, setAccepted] = useState(false);

  const start = async () => {
    if (!name.trim() || !year || !branch.trim() || !rollNumber.trim()) return;
    const state = newState({
      name: name.trim(),
      year,
      branch: branch.trim(),
      rollNumber: rollNumber.trim(),
    });
    saveState(state);
    await enterFullscreen();
    navigate({ to: "/exam" });
  };

  const resume = async () => {
    await enterFullscreen();
    navigate({ to: "/exam" });
  };

  return (
    <div className="min-h-screen grid-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30 pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Technical Event</div>
              <div className="font-bold text-lg">ASCEND <span className="neon-text">2K26</span></div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-accent" /> Secure Exam Portal
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Online Aptitude Examination
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-4">
            ASCEND <span className="neon-text">2K26</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground italic">
            “Test Your Skills. Rise Beyond Limits.”
          </p>
        </div>

        {/* Instructions */}
        <Card className="p-6 sm:p-8 bg-card/60 backdrop-blur border-primary/20">
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Exam Instructions
          </h2>
          <p className="text-sm text-muted-foreground mb-6">Read carefully before you begin.</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Rule icon={<Clock className="w-4 h-4" />} title="Duration" text={`${QUESTIONS.length} questions · ${EXAM_DURATION_SECONDS / 60} minutes`} />
            <Rule icon={<Maximize2 className="w-4 h-4" />} title="Fullscreen Required" text="Exiting fullscreen will be flagged as a violation." />
            <Rule icon={<Ban className="w-4 h-4" />} title="No Tab Switching" text="Switching tabs or minimizing the browser is prohibited." />
            <Rule icon={<Shield className="w-4 h-4" />} title="Anti-Cheat Active" text="Right-click, copy/paste, dev tools and shortcuts are disabled." />
            <Rule icon={<AlertTriangle className="w-4 h-4" />} title="3 Violations = Auto Submit" text="Each violation increases the counter shown in the top bar." />
            <Rule icon={<Zap className="w-4 h-4" />} title="Auto Save & Recovery" text="Your answers and timer are saved locally — works offline." />
          </div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                <Input
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!!existing && !existing.submitted}
                  className="bg-background/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Roll Number</label>
                <Input
                  placeholder="e.g. 21CS1234"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  disabled={!!existing && !existing.submitted}
                  className="bg-background/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Year</label>
                <Select
                  value={year}
                  onValueChange={setYear}
                  disabled={!!existing && !existing.submitted}
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Branch</label>
                <Input
                  placeholder="e.g. CSE, ECE, MECH"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  disabled={!!existing && !existing.submitted}
                  className="bg-background/50"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 accent-primary"
              />
              <span className="text-muted-foreground">
                I have read the instructions and agree to the exam rules. I understand the exam will enter
                fullscreen mode automatically and that violations may lead to auto-submission.
              </span>
            </label>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {existing && !existing.submitted ? (
                <Button onClick={resume} size="lg" className="neon-glow flex-1">
                  Resume Exam
                </Button>
              ) : (
                <Button
                  onClick={start}
                  size="lg"
                  disabled={
                    !accepted ||
                    !name.trim() ||
                    !year ||
                    !branch.trim() ||
                    !rollNumber.trim()
                  }
                  className="neon-glow animate-pulse-glow flex-1"
                >
                  Start Exam
                </Button>
              )}
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8">
          © Ascend 2K26 · Powered by a secure offline-first exam engine
        </p>
      </div>
    </div>
  );
}

function Rule({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg bg-secondary/40 border border-border">
      <div className="w-8 h-8 rounded-md bg-primary/15 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{text}</div>
      </div>
    </div>
  );
}
