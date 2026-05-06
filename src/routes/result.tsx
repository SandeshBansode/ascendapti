import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, CheckCircle2, XCircle, Clock, Download, Home, Zap } from "lucide-react";
import { ExamState, calculateScore, clearState, loadState } from "@/lib/examStore";
import { QUESTIONS, EXAM_DURATION_SECONDS } from "@/data/questions";
import jsPDF from "jspdf";

export const Route = createFileRoute("/result")({
  head: () => ({ meta: [{ title: "Ascend 2K26 — Your Result" }] }),
  component: ResultPage,
});

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

function ResultPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<ExamState | null>(null);
  const downloadedRef = useRef(false);

  useEffect(() => {
    const s = loadState();
    if (!s || !s.submitted) {
      navigate({ to: "/" });
      return;
    }
    setState(s);
  }, [navigate]);

  useEffect(() => {
    if (state && !downloadedRef.current) {
      downloadedRef.current = true;
      // Auto-download PDF once the result is ready
      setTimeout(() => downloadPdf(), 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!state) return null;

  const score = calculateScore(state);
  const timeTaken = Math.min(
    EXAM_DURATION_SECONDS,
    Math.floor(((state.submittedAt ?? Date.now()) - state.startedAt) / 1000)
  );

  const downloadPdf = () => {
    const doc = new jsPDF();
    const w = doc.internal.pageSize.getWidth();
    doc.setFillColor(20, 30, 50);
    doc.rect(0, 0, w, 35, "F");
    doc.setTextColor(180, 240, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("ASCEND 2K26", 14, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Test Your Skills. Rise Beyond Limits.", 14, 26);

    doc.setTextColor(20, 20, 20);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Aptitude Exam — Result", 14, 50);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    let y = 62;
    const line = (k: string, v: string) => {
      doc.setFont("helvetica", "bold");
      doc.text(k, 14, y);
      doc.setFont("helvetica", "normal");
      doc.text(v, 80, y);
      y += 8;
    };
    line("Candidate:", state.studentName ?? "—");
    line("Roll Number:", state.rollNumber ?? "—");
    line("Year:", state.year ?? "—");
    line("Branch:", state.branch ?? "—");
    line("Date:", new Date(state.submittedAt ?? Date.now()).toLocaleString());
    line("Time Taken:", fmt(timeTaken));
    line("Violations:", `${state.violations}`);
    y += 4;
    line("Total Questions:", `${score.total}`);
    line("Attempted:", `${score.attempted}`);
    line("Correct Answers:", `${score.correct}`);
    line("Wrong Answers:", `${score.wrong}`);
    line("Score:", `${score.score} / ${score.total}`);
    line("Percentage:", `${score.percentage.toFixed(2)}%`);

    doc.setDrawColor(180);
    doc.line(14, y + 2, w - 14, y + 2);
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Question-wise Summary", 14, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    QUESTIONS.forEach((q, i) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      const a = state.answers[i];
      const status = a === undefined ? "Skipped" : a === q.correct ? "Correct" : "Wrong";
      doc.text(`Q${i + 1}. [${q.category}] — ${status}`, 14, y);
      y += 6;
    });

    doc.save(`Ascend2K26_Result_${(state.studentName || "student").replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="min-h-screen grid-bg relative">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />
      <div className="relative max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-bold">ASCEND <span className="neon-text">2K26</span></div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Result Sheet</div>
          </div>
        </div>

        <Card className="p-8 bg-card/70 border-primary/30 mb-6 text-center">
          <Award className="w-14 h-14 mx-auto text-primary mb-3" />
          <div className="text-sm text-muted-foreground">Candidate</div>
          <div className="text-2xl font-bold mb-2">{state.studentName || "Anonymous"}</div>
          <div className="text-6xl font-black neon-text mb-1">{score.percentage.toFixed(1)}%</div>
          <div className="text-muted-foreground">
            {score.score} / {score.total} correct
          </div>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Stat icon={<CheckCircle2 className="text-primary" />} label="Correct" value={score.correct} />
          <Stat icon={<XCircle className="text-destructive" />} label="Wrong" value={score.wrong} />
          <Stat icon={<Award className="text-accent" />} label="Attempted" value={score.attempted} />
          <Stat icon={<Clock className="text-primary" />} label="Time" value={fmt(timeTaken)} />
        </div>

        <Card className="p-6 bg-card/70 mb-6">
          <h3 className="font-semibold mb-4">Question Breakdown</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {QUESTIONS.map((q, i) => {
              const a = state.answers[i];
              const ok = a === q.correct;
              const skipped = a === undefined;
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-md border flex items-center justify-center text-xs font-bold ${
                    skipped
                      ? "bg-secondary border-border text-muted-foreground"
                      : ok
                      ? "bg-primary/20 border-primary/50 text-primary"
                      : "bg-destructive/20 border-destructive/50 text-destructive"
                  }`}
                  title={q.category}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={downloadPdf} size="lg" className="neon-glow">
            <Download className="w-4 h-4 mr-2" /> Download Result PDF
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              clearState();
              navigate({ to: "/" });
            }}
          >
            <Home className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <Card className="p-4 bg-card/60 text-center">
      <div className="w-9 h-9 mx-auto rounded-md bg-secondary/50 flex items-center justify-center mb-2">
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
    </Card>
  );
}
