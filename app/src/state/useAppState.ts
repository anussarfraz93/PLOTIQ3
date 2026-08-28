import { useCallback, useMemo, useRef, useState } from "react";
import { BUDGET_STEP, SCALE_BY_TYPE, STEP1, VIBE_BY_TYPE } from "../data/conversation";
import { PLOTS, TYPE_LABEL } from "../data/plots";
import { Answers, BudgetOption, LandType, Match, PurposeOption, SavedEntry, ScaleOption, VibeOption } from "../data/types";
import { fetchRecommendation } from "../lib/api";

// This hook is a direct port of the global state machine in
// prototype/index.html's <script> block: the same view/back-stack model,
// the same per-step "undo checkpoint" design for the questionnaire, and the
// same saved-plots logic — restructured into React state instead of DOM
// mutation, but the same rules.

export type ChatItem =
  | { kind: "bubble"; id: string; who: "bot" | "user"; text: string }
  | { kind: "purposeOptions"; id: string }
  | { kind: "scaleOptions"; id: string; purpose: LandType }
  | { kind: "budgetOptions"; id: string }
  | { kind: "vibeOptions"; id: string; purpose: LandType }
  | { kind: "recommending"; id: string }
  | { kind: "noResults"; id: string }
  | { kind: "results"; id: string; typeLabel: string; scaleRange: [number, number]; matches: Match[] };

export type ViewName = "chat" | "saved" | "insights" | "compare";

type Checkpoint = { itemCount: number; clearKey: "purpose" | "scale" | "budget" | "vibe" };

let uid = 0;
const nextId = () => `i${++uid}`;

export function useAppState() {
  const [chat, setChat] = useState<ChatItem[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [savedPlots, setSavedPlots] = useState<SavedEntry[]>([]);
  const [currentView, setCurrentView] = useState<ViewName>("chat");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Mutable refs mirror the artifact's plain JS globals (viewHistory,
  // chatCheckpoints, stepMark) — they don't need to trigger re-renders on
  // their own, only the state they gate (chat/currentView) does.
  const viewHistory = useRef<ViewName[]>([]);
  const chatCheckpoints = useRef<Checkpoint[]>([]);
  const stepMark = useRef<Partial<Record<Checkpoint["clearKey"], number>>>({});
  const answersRef = useRef<Answers>({});
  answersRef.current = answers;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Set the instant any option is picked, cleared once the next question has
  // actually rendered. Removing the answered grid from `chat` state isn't
  // enough on its own: React re-renders asynchronously, so two clicks fired
  // in the same tick (a fast real double-tap) both land on the *same*
  // still-mounted grid before the first click's removal has committed. This
  // ref is checked synchronously, independent of render timing, so the
  // second click is dropped outright instead of re-running the handler.
  const isPicking = useRef(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  // ---- chat step renderers (each records its own start mark, same as the
  // artifact's showXStep functions) ----
  const showPurposeStep = useCallback(() => {
    setChat((c) => {
      stepMark.current.purpose = c.length;
      return [...c, { kind: "bubble", id: nextId(), who: "bot", text: STEP1.bot }, { kind: "purposeOptions", id: nextId() }];
    });
  }, []);

  const showScaleStep = useCallback((purpose: LandType) => {
    setChat((c) => {
      stepMark.current.scale = c.length;
      return [...c, { kind: "bubble", id: nextId(), who: "bot", text: SCALE_BY_TYPE[purpose].bot }, { kind: "scaleOptions", id: nextId(), purpose }];
    });
  }, []);

  const showBudgetStep = useCallback(() => {
    setChat((c) => {
      stepMark.current.budget = c.length;
      return [...c, { kind: "bubble", id: nextId(), who: "bot", text: BUDGET_STEP.bot }, { kind: "budgetOptions", id: nextId() }];
    });
  }, []);

  const showVibeStep = useCallback((purpose: LandType) => {
    setChat((c) => {
      stepMark.current.vibe = c.length;
      return [...c, { kind: "bubble", id: nextId(), who: "bot", text: "Any preference on location or vibe?" }, { kind: "vibeOptions", id: nextId(), purpose }];
    });
  }, []);

  const STEP_SHOW_FN = useMemo(
    () => ({
      purpose: () => showPurposeStep(),
      // scale/vibe need the already-answered purpose to know which branch
      // to re-render — if that's ever missing (state desynced from the
      // checkpoint stack somehow), fall back to the purpose step instead
      // of crashing on `.purpose!.value`.
      scale: () => (answersRef.current.purpose ? showScaleStep(answersRef.current.purpose.value) : showPurposeStep()),
      budget: () => showBudgetStep(),
      vibe: () => (answersRef.current.purpose ? showVibeStep(answersRef.current.purpose.value) : showPurposeStep()),
    }),
    [showPurposeStep, showScaleStep, showBudgetStep, showVibeStep]
  );

  const updateBottombarTick = useState(0)[1]; // forces bottombar re-render when refs change
  const bump = () => updateBottombarTick((n) => n + 1);

  const pushCheckpoint = (clearKey: Checkpoint["clearKey"]) => {
    chatCheckpoints.current.push({ itemCount: stepMark.current[clearKey]!, clearKey });
  };

  // Ports the artifact's `wrap.remove()` behavior: the moment an option is
  // picked, the options grid that was just answered is removed from the
  // chat in the same state update that appends the user's answer bubble.
  // Without this the grid stayed fully live and clickable forever, so a
  // second tap (or a tap on a sibling card) re-fired the handler and
  // appended a whole extra duplicate question+answer block — which also
  // desynced the Back-button checkpoints from the real chat length. This
  // single removal fixes the duplicate-answer bug, the "answers stack up
  // instead of replacing" bug, and the Back-wipes-everything bug together.
  const answerAndAdvance = (optionsKind: ChatItem["kind"], text: string) =>
    setChat((c) => {
      const last = c[c.length - 1];
      const withoutGrid = last && last.kind === optionsKind ? c.slice(0, -1) : c;
      return [...withoutGrid, { kind: "bubble", id: nextId(), who: "user", text }];
    });

  const startChat = useCallback(() => {
    setChat([]);
    setAnswers({});
    viewHistory.current = [];
    chatCheckpoints.current = [];
    stepMark.current = {};
    isPicking.current = false;
    bump();
    showPurposeStep();
  }, [showPurposeStep]);

  const showRecommendation = useCallback(async (finalAnswers: Required<Answers>) => {
    setChat((c) => [...c, { kind: "recommending", id: nextId() }]);
    const { data } = await fetchRecommendation(finalAnswers);
    setChat((c) => {
      const withoutRecommending = c.filter((i) => i.kind !== "recommending");
      if (data.matches.length === 0) {
        return [...withoutRecommending, { kind: "noResults", id: nextId() }];
      }
      return [...withoutRecommending, { kind: "results", id: nextId(), typeLabel: data.typeLabel, scaleRange: data.scaleRange, matches: data.matches }];
    });
  }, []);

  const onPurpose = useCallback(
    (opt: PurposeOption) => {
      if (isPicking.current) return;
      isPicking.current = true;
      answerAndAdvance("purposeOptions", opt.label);
      setAnswers((a) => ({ ...a, purpose: opt }));
      setTimeout(() => {
        pushCheckpoint("purpose");
        showScaleStep(opt.value);
        bump();
        isPicking.current = false;
      }, 280);
    },
    [showScaleStep]
  );

  const onScale = useCallback(
    (opt: ScaleOption) => {
      if (isPicking.current) return;
      isPicking.current = true;
      answerAndAdvance("scaleOptions", opt.label);
      setAnswers((a) => ({ ...a, scale: opt }));
      setTimeout(() => {
        pushCheckpoint("scale");
        showBudgetStep();
        bump();
        isPicking.current = false;
      }, 280);
    },
    [showBudgetStep]
  );

  const onBudget = useCallback(
    (opt: BudgetOption) => {
      if (isPicking.current) return;
      isPicking.current = true;
      answerAndAdvance("budgetOptions", opt.label);
      setAnswers((a) => ({ ...a, budget: opt }));
      setTimeout(() => {
        pushCheckpoint("budget");
        showVibeStep(answersRef.current.purpose!.value);
        bump();
        isPicking.current = false;
      }, 280);
    },
    [showVibeStep]
  );

  const onVibe = useCallback(
    (opt: VibeOption) => {
      if (isPicking.current) return;
      isPicking.current = true;
      answerAndAdvance("vibeOptions", opt.label);
      setAnswers((a) => {
        const next = { ...a, vibe: opt };
        setTimeout(() => {
          pushCheckpoint("vibe");
          showRecommendation(next as Required<Answers>);
          bump();
          isPicking.current = false;
        }, 280);
        return next;
      });
    },
    [showRecommendation]
  );

  // ---- view / back-stack (same rules as setView/goBack/goHome) ----
  const setView = useCallback((v: ViewName, opts?: { skipHistory?: boolean }) => {
    setCurrentView((prev) => {
      if (!opts?.skipHistory && v !== prev) viewHistory.current.push(prev);
      return v;
    });
    if (v === "chat") viewHistory.current = [];
    setDrawerOpen(false);
    bump();
  }, []);

  const goBack = useCallback(() => {
    if (currentView === "chat" && chatCheckpoints.current.length > 0) {
      isPicking.current = false;
      const cp = chatCheckpoints.current.pop()!;
      setChat((c) => c.slice(0, cp.itemCount));
      setAnswers((a) => {
        const next = { ...a };
        delete next[cp.clearKey];
        return next;
      });
      STEP_SHOW_FN[cp.clearKey]();
      bump();
      return;
    }
    if (viewHistory.current.length === 0) {
      showToast("You're already at the start");
      return;
    }
    const prev = viewHistory.current.pop()!;
    setView(prev, { skipHistory: true });
  }, [currentView, STEP_SHOW_FN, setView, showToast]);

  const goHome = useCallback(() => {
    viewHistory.current = [];
    setView("chat", { skipHistory: true });
  }, [setView]);

  const backDisabled = currentView === "chat" ? chatCheckpoints.current.length === 0 : viewHistory.current.length === 0;

  // ---- saved plots (same in-memory-first design as the artifact) ----
  const isSaved = useCallback((plotId: number) => savedPlots.some((s) => s.plotId === plotId), [savedPlots]);

  const toggleSave = useCallback(
    (plotId: number, size?: number) => {
      setSavedPlots((list) => {
        const idx = list.findIndex((s) => s.plotId === plotId);
        if (idx > -1) {
          showToast("Removed from saved");
          return list.filter((s) => s.plotId !== plotId);
        }
        showToast("Saved to your list");
        return [...list, { plotId, size: size ?? 0, savedAt: Date.now() }];
      });
    },
    [showToast]
  );

  // ---- quick-start (drawer shortcuts) ----
  const quickStart = useCallback(
    (target: LandType, tag?: PurposeOption["tag"]) => {
      setView("chat");
      setChat([]);
      setAnswers({});
      viewHistory.current = [];
      chatCheckpoints.current = [];
      stepMark.current = { purpose: 0 };
      bump();
      setChat([{ kind: "bubble", id: nextId(), who: "bot", text: STEP1.bot }]);
      const opt = STEP1.options.find((o) => o.value === target && (!tag || o.tag === tag)) ?? STEP1.options.find((o) => o.value === target)!;
      setTimeout(() => {
        onPurpose(opt);
      }, 150);
    },
    [setView, onPurpose]
  );

  return {
    chat,
    answers,
    savedPlots,
    currentView,
    drawerOpen,
    toast,
    backDisabled,
    setDrawerOpen,
    setView,
    goBack,
    goHome,
    startChat,
    onPurpose,
    onScale,
    onBudget,
    onVibe,
    isSaved,
    toggleSave,
    quickStart,
    showToast,
  };
}

export { PLOTS, TYPE_LABEL };
