"use client";

import { useReducer, useCallback, useEffect, useMemo, useState } from "react";
import { quizCards } from "@/data/quiz-cards";
import {
  playClick,
  playCheckOff,
  playUncheck,
  playCelebration,
} from "@/lib/sounds";
import { Confetti } from "@/components/confetti";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  Grid3X3,
  HelpCircle,
  Layers,
  AlertTriangle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const GRID_SIZE = 8;
const LS_KEY = "blocks-game-highscore";

const COLORS = [
  "#94b8f2", // datefix-blue
  "#d684cc", // datefix-pink
  "#e0a958", // datefix-gold
  "#a0c75d", // datefix-green
] as const;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** A piece shape defined as an array of [row, col] offsets from the anchor */
type Shape = [number, number][];

interface Piece {
  id: string;
  shape: Shape;
  color: string;
  isPenalty?: boolean;
}

interface QuizState {
  questionIndex: number;
  options: string[];
  correctAnswer: string;
  wrongCount: number;
  revealed: boolean;
  wrongAnswers: Set<string>;
}

type CellValue = string | null; // color string or null (empty)

type Grid = CellValue[][];

interface GameState {
  grid: Grid;
  pieces: Piece[];
  selectedPieceId: string | null;
  score: number;
  highScore: number;
  linesCleared: number;
  questionsAnswered: number;
  phase: "playing" | "quiz" | "gameover";
  quizState: QuizState | null;
  clearingCells: Set<string>; // "row-col" keys for cells being animated
  usedQuestionIds: Set<number>;
  penaltyPieces: number; // accumulated penalty pieces for next round
}

type Action =
  | { type: "SELECT_PIECE"; pieceId: string }
  | { type: "PLACE_PIECE"; row: number; col: number; pieceId?: string }
  | { type: "ANSWER_QUIZ"; chosenAnswer: string }
  | { type: "QUIZ_CONTINUE" }
  | { type: "CLEAR_LINES_DONE" }
  | { type: "PLAY_AGAIN" };

/* ------------------------------------------------------------------ */
/*  Piece Templates                                                    */
/* ------------------------------------------------------------------ */

const PIECE_TEMPLATES: { name: string; shape: Shape }[] = [
  {
    name: "h2",
    shape: [
      [0, 0],
      [0, 1],
    ],
  },
  {
    name: "v2",
    shape: [
      [0, 0],
      [1, 0],
    ],
  },
  {
    name: "h3",
    shape: [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
  },
  {
    name: "v3",
    shape: [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
  },
  {
    name: "L",
    shape: [
      [0, 0],
      [1, 0],
      [1, 1],
    ],
  },
  {
    name: "T",
    shape: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 1],
    ],
  },
  {
    name: "sq",
    shape: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let pieceCounter = 0;

function generatePieces(count: number, penaltyCount = 0): Piece[] {
  const pieces: Piece[] = [];
  for (let i = 0; i < count + penaltyCount; i++) {
    const template =
      PIECE_TEMPLATES[Math.floor(Math.random() * PIECE_TEMPLATES.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    pieces.push({
      id: `piece-${++pieceCounter}`,
      shape: template.shape,
      color,
      isPenalty: i >= count,
    });
  }
  return pieces;
}

function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null),
  );
}

function canPlacePiece(
  grid: Grid,
  piece: Piece,
  anchorRow: number,
  anchorCol: number,
): boolean {
  for (const [dr, dc] of piece.shape) {
    const r = anchorRow + dr;
    const c = anchorCol + dc;
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
    if (grid[r][c] !== null) return false;
  }
  return true;
}

function placePiece(
  grid: Grid,
  piece: Piece,
  anchorRow: number,
  anchorCol: number,
): Grid {
  const newGrid = grid.map((row) => [...row]);
  for (const [dr, dc] of piece.shape) {
    newGrid[anchorRow + dr][anchorCol + dc] = piece.color;
  }
  return newGrid;
}

function findCompletedLines(grid: Grid): { rows: number[]; cols: number[] } {
  const rows: number[] = [];
  const cols: number[] = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r].every((cell) => cell !== null)) rows.push(r);
  }
  for (let c = 0; c < GRID_SIZE; c++) {
    if (grid.every((row) => row[c] !== null)) cols.push(c);
  }

  return { rows, cols };
}

function clearLines(grid: Grid, rows: number[], cols: number[]): Grid {
  const newGrid = grid.map((row) => [...row]);
  for (const r of rows) {
    for (let c = 0; c < GRID_SIZE; c++) newGrid[r][c] = null;
  }
  for (const c of cols) {
    for (let r = 0; r < GRID_SIZE; r++) newGrid[r][c] = null;
  }
  return newGrid;
}

function getClearingCells(rows: number[], cols: number[]): Set<string> {
  const cells = new Set<string>();
  for (const r of rows) {
    for (let c = 0; c < GRID_SIZE; c++) cells.add(`${r}-${c}`);
  }
  for (const c of cols) {
    for (let r = 0; r < GRID_SIZE; r++) cells.add(`${r}-${c}`);
  }
  return cells;
}

function canAnyPieceFit(grid: Grid, pieces: Piece[]): boolean {
  for (const piece of pieces) {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (canPlacePiece(grid, piece, r, c)) return true;
      }
    }
  }
  return false;
}

function buildQuizState(usedIds: Set<number>): QuizState {
  const available = quizCards.filter((c) => !usedIds.has(c.id));
  const pool = available.length > 0 ? available : quizCards;

  const shuffled = shuffle(pool);
  const card = shuffled[0];

  // Build 4 options: correct answer + 3 built-in distractors
  const options = shuffle([card.answer, ...card.distractors]);

  return {
    questionIndex: card.id,
    options,
    correctAnswer: card.answer,
    wrongCount: 0,
    revealed: false,
    wrongAnswers: new Set<string>(),
  };
}

function loadHighScore(): number {
  if (typeof window === "undefined") return 0;
  try {
    return parseInt(localStorage.getItem(LS_KEY) ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}

function saveHighScore(score: number): void {
  try {
    localStorage.setItem(LS_KEY, String(score));
  } catch {
    // localStorage may be unavailable
  }
}

/* ------------------------------------------------------------------ */
/*  Reducer                                                            */
/* ------------------------------------------------------------------ */

function createInitialState(): GameState {
  return {
    grid: createEmptyGrid(),
    pieces: generatePieces(3),
    selectedPieceId: null,
    score: 0,
    highScore: loadHighScore(),
    linesCleared: 0,
    questionsAnswered: 0,
    phase: "playing",
    quizState: null,
    clearingCells: new Set(),
    usedQuestionIds: new Set(),
    penaltyPieces: 0,
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SELECT_PIECE": {
      if (state.phase !== "playing") return state;
      return {
        ...state,
        selectedPieceId:
          state.selectedPieceId === action.pieceId ? null : action.pieceId,
      };
    }

    case "PLACE_PIECE": {
      const targetPieceId = action.pieceId ?? state.selectedPieceId;
      if (state.phase !== "playing" || !targetPieceId) return state;
      const piece = state.pieces.find((p) => p.id === targetPieceId);
      if (!piece) return state;
      if (!canPlacePiece(state.grid, piece, action.row, action.col))
        return state;

      const newGrid = placePiece(state.grid, piece, action.row, action.col);
      const remainingPieces = state.pieces.filter((p) => p.id !== piece.id);

      // Check for completed lines
      const { rows, cols } = findCompletedLines(newGrid);
      const totalLines = rows.length + cols.length;

      if (totalLines > 0) {
        const clearing = getClearingCells(rows, cols);
        return {
          ...state,
          grid: newGrid,
          pieces: remainingPieces,
          selectedPieceId: null,
          score: state.score + totalLines * 10,
          linesCleared: state.linesCleared + totalLines,
          clearingCells: clearing,
          phase: "playing",
        };
      }

      // All pieces placed? -> quiz time
      if (remainingPieces.length === 0) {
        const quiz = buildQuizState(state.usedQuestionIds);
        return {
          ...state,
          grid: newGrid,
          pieces: remainingPieces,
          selectedPieceId: null,
          phase: "quiz",
          quizState: quiz,
          usedQuestionIds: new Set([
            ...state.usedQuestionIds,
            quiz.questionIndex,
          ]),
        };
      }

      // Check if game over (remaining pieces can't fit)
      if (!canAnyPieceFit(newGrid, remainingPieces)) {
        const hs = Math.max(state.score, state.highScore);
        saveHighScore(hs);
        return {
          ...state,
          grid: newGrid,
          pieces: remainingPieces,
          selectedPieceId: null,
          phase: "gameover",
          highScore: hs,
        };
      }

      return {
        ...state,
        grid: newGrid,
        pieces: remainingPieces,
        selectedPieceId: null,
      };
    }

    case "CLEAR_LINES_DONE": {
      if (state.clearingCells.size === 0) return state;
      const { rows, cols } = findCompletedLines(state.grid);
      const clearedGrid = clearLines(state.grid, rows, cols);

      // If all pieces are placed, go to quiz
      if (state.pieces.length === 0) {
        const quiz = buildQuizState(state.usedQuestionIds);
        return {
          ...state,
          grid: clearedGrid,
          clearingCells: new Set(),
          phase: "quiz",
          quizState: quiz,
          usedQuestionIds: new Set([
            ...state.usedQuestionIds,
            quiz.questionIndex,
          ]),
        };
      }

      // Check game over after clearing
      if (!canAnyPieceFit(clearedGrid, state.pieces)) {
        const hs = Math.max(state.score, state.highScore);
        saveHighScore(hs);
        return {
          ...state,
          grid: clearedGrid,
          clearingCells: new Set(),
          phase: "gameover",
          highScore: hs,
        };
      }

      return {
        ...state,
        grid: clearedGrid,
        clearingCells: new Set(),
      };
    }

    case "ANSWER_QUIZ": {
      if (state.phase !== "quiz" || !state.quizState) return state;
      const quiz = state.quizState;

      if (action.chosenAnswer === quiz.correctAnswer) {
        // Correct — bonus only if no wrong answers
        return {
          ...state,
          quizState: {
            ...quiz,
            revealed: true,
          },
          score: state.score + (quiz.wrongCount === 0 ? 5 : 0),
          questionsAnswered: state.questionsAnswered + 1,
        };
      }

      // Wrong — accumulate penalty, mark this option as wrong
      const newWrongCount = quiz.wrongCount + 1;
      const newWrongAnswers = new Set(quiz.wrongAnswers);
      newWrongAnswers.add(action.chosenAnswer);

      return {
        ...state,
        penaltyPieces: state.penaltyPieces + 1,
        quizState: {
          ...quiz,
          wrongCount: newWrongCount,
          wrongAnswers: newWrongAnswers,
        },
      };
    }

    case "QUIZ_CONTINUE": {
      if (state.phase !== "quiz") return state;
      const penalty = state.penaltyPieces;
      const newPieces = generatePieces(3, penalty);

      // Check game over with new pieces
      if (!canAnyPieceFit(state.grid, newPieces)) {
        const hs = Math.max(state.score, state.highScore);
        saveHighScore(hs);
        return {
          ...state,
          pieces: newPieces,
          phase: "gameover",
          quizState: null,
          highScore: hs,
          penaltyPieces: 0,
        };
      }

      return {
        ...state,
        pieces: newPieces,
        selectedPieceId: null,
        phase: "playing",
        quizState: null,
        penaltyPieces: 0,
      };
    }

    case "PLAY_AGAIN": {
      pieceCounter = 0;
      return {
        ...createInitialState(),
        highScore: Math.max(state.score, state.highScore),
        penaltyPieces: 0,
      };
    }

    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  Sub-Components                                                     */
/* ------------------------------------------------------------------ */

/** Renders a mini piece preview — click to select OR drag onto grid */
function PiecePreview({
  piece,
  isSelected,
  onClick,
  onDragStart,
}: {
  piece: Piece;
  isSelected: boolean;
  onClick: () => void;
  onDragStart: (pieceId: string) => void;
}) {
  const maxRow = Math.max(...piece.shape.map(([r]) => r)) + 1;
  const maxCol = Math.max(...piece.shape.map(([, c]) => c)) + 1;
  const cells = new Set(piece.shape.map(([r, c]) => `${r}-${c}`));

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", piece.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart(piece.id);
      }}
      onClick={onClick}
      className={cn(
        "relative flex cursor-grab flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all duration-150 active:cursor-grabbing",
        isSelected
          ? "scale-105 border-datefix-blue bg-datefix-blue/10 shadow-lg ring-2 ring-datefix-blue/30"
          : piece.isPenalty
            ? "border-red-500/40 bg-red-500/5 hover:border-red-500/60 hover:shadow-md"
            : "border-border/50 bg-card hover:border-datefix-blue/30 hover:shadow-md",
      )}
    >
      {piece.isPenalty && (
        <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 shadow-sm">
          <AlertTriangle className="h-3 w-3 text-white" />
        </div>
      )}
      <div
        className="grid gap-0.5"
        style={{
          gridTemplateColumns: `repeat(${maxCol}, 20px)`,
          gridTemplateRows: `repeat(${maxRow}, 20px)`,
        }}
      >
        {Array.from({ length: maxRow }, (_, r) =>
          Array.from({ length: maxCol }, (_, c) => {
            const filled = cells.has(`${r}-${c}`);
            return (
              <div
                key={`${r}-${c}`}
                className={cn(
                  "h-5 w-5 rounded-sm transition-colors",
                  filled ? "shadow-sm" : "bg-transparent",
                )}
                style={filled ? { backgroundColor: piece.color } : undefined}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

interface BlocksGameProps {
  onBack: () => void;
}

export function BlocksGame({ onBack }: BlocksGameProps) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [hoverCells, setHoverCells] = useState<Set<string>>(new Set());
  const [hoverValid, setHoverValid] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const {
    grid,
    pieces,
    selectedPieceId,
    score,
    highScore,
    linesCleared,
    questionsAnswered,
    phase,
    quizState,
    clearingCells,
    penaltyPieces,
  } = state;

  const selectedPiece = useMemo(
    () => pieces.find((p) => p.id === selectedPieceId) ?? null,
    [pieces, selectedPieceId],
  );

  // Handle clearing animation
  useEffect(() => {
    if (clearingCells.size > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: "CLEAR_LINES_DONE" });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [clearingCells]);

  // Quiz question text
  const quizQuestion = useMemo(() => {
    if (!quizState) return null;
    return quizCards.find((c) => c.id === quizState.questionIndex) ?? null;
  }, [quizState]);

  /* ---- Hover logic ---- */
  const handleCellHover = useCallback(
    (row: number, col: number) => {
      if (!selectedPiece || phase !== "playing") {
        setHoverCells(new Set());
        return;
      }
      const cells = new Set<string>();
      let valid = true;
      for (const [dr, dc] of selectedPiece.shape) {
        const r = row + dr;
        const c = col + dc;
        if (
          r < 0 ||
          r >= GRID_SIZE ||
          c < 0 ||
          c >= GRID_SIZE ||
          grid[r][c] !== null
        ) {
          valid = false;
        }
        cells.add(`${r}-${c}`);
      }
      setHoverCells(cells);
      setHoverValid(valid);
    },
    [selectedPiece, grid, phase],
  );

  const handleGridLeave = useCallback(() => {
    setHoverCells(new Set());
  }, []);

  /* ---- Placement ---- */
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!selectedPiece || phase !== "playing") return;
      if (!canPlacePiece(grid, selectedPiece, row, col)) return;
      playClick();
      dispatch({ type: "PLACE_PIECE", row, col });
      setHoverCells(new Set());
    },
    [selectedPiece, grid, phase],
  );

  /* ---- Piece selection ---- */
  const handlePieceSelect = useCallback(
    (pieceId: string) => {
      if (phase !== "playing") return;
      playClick();
      dispatch({ type: "SELECT_PIECE", pieceId });
    },
    [phase],
  );

  /* ---- Drag-and-drop onto grid ---- */
  const handleDragStart = useCallback(
    (pieceId: string) => {
      if (phase !== "playing") return;
      dispatch({ type: "SELECT_PIECE", pieceId });
    },
    [phase],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, row: number, col: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      handleCellHover(row, col);
    },
    [handleCellHover],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, row: number, col: number) => {
      e.preventDefault();
      const pieceId = e.dataTransfer.getData("text/plain");
      if (!pieceId) return;
      const piece = pieces.find((p) => p.id === pieceId);
      if (!piece) return;
      if (!canPlacePiece(grid, piece, row, col)) return;
      playClick();
      dispatch({ type: "PLACE_PIECE", row, col, pieceId });
      setHoverCells(new Set());
    },
    [pieces, grid],
  );

  /* ---- Quiz answer ---- */
  const handleAnswer = useCallback(
    (answer: string) => {
      if (!quizState) return;

      if (answer === quizState.correctAnswer) {
        playCheckOff();
        dispatch({ type: "ANSWER_QUIZ", chosenAnswer: answer });
      } else {
        playUncheck();
        dispatch({ type: "ANSWER_QUIZ", chosenAnswer: answer });
      }
    },
    [quizState],
  );

  /* ---- Quiz continue ---- */
  const handleQuizContinue = useCallback(() => {
    playClick();
    dispatch({ type: "QUIZ_CONTINUE" });
  }, []);

  /* ---- Play again ---- */
  const handlePlayAgain = useCallback(() => {
    playClick();
    setShowConfetti(false);
    dispatch({ type: "PLAY_AGAIN" });
  }, []);

  /* ---- Game over confetti ---- */
  useEffect(() => {
    if (phase === "gameover" && score > 0) {
      playCelebration();
      setShowConfetti(true);
    }
  }, [phase, score]);

  /* ---- Render ---- */
  return (
    <div className="space-y-5">
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            playClick();
            onBack();
          }}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border/50 bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            Blocks
          </h2>
          <p className="text-xs text-muted-foreground">
            Place blocks, answer questions, clear lines!
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-datefix-gold" />
          <span className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
            {score}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Grid3X3 className="h-3.5 w-3.5 text-datefix-pink" />
            {linesCleared} lines
          </span>
          <span className="flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5 text-datefix-blue" />
            {questionsAnswered} Qs
          </span>
          {highScore > 0 && (
            <span className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-datefix-green" />
              Best: {highScore}
            </span>
          )}
        </div>
      </div>

      {/* ---- PLAYING PHASE ---- */}
      {phase === "playing" && (
        <>
          {/* Grid */}
          <div
            className="mx-auto w-fit rounded-2xl border border-border/50 bg-card p-2"
            onMouseLeave={handleGridLeave}
          >
            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, 40px)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 40px)`,
              }}
            >
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const key = `${r}-${c}`;
                  const isClearing = clearingCells.has(key);
                  const isHovered = hoverCells.has(key);

                  return (
                    <div
                      key={key}
                      className={cn(
                        "h-10 w-10 rounded-md border transition-all duration-200 cursor-pointer",
                        cell
                          ? "border-white/10 shadow-sm"
                          : "border-border/30 bg-card/50",
                        isClearing && "animate-pulse scale-110 opacity-0",
                        isHovered &&
                          !cell &&
                          (hoverValid
                            ? "border-datefix-blue/50 ring-1 ring-datefix-blue/30"
                            : "border-red-500/40 ring-1 ring-red-500/20"),
                      )}
                      style={
                        cell
                          ? { backgroundColor: cell }
                          : isHovered && hoverValid && selectedPiece
                            ? { backgroundColor: selectedPiece.color + "40" }
                            : undefined
                      }
                      onMouseEnter={() => handleCellHover(r, c)}
                      onClick={() => handleCellClick(r, c)}
                      onDragOver={(e) => handleDragOver(e, r, c)}
                      onDrop={(e) => handleDrop(e, r, c)}
                    />
                  );
                }),
              )}
            </div>
          </div>

          {/* Piece tray */}
          <div className="space-y-2">
            <p className="text-center text-xs font-semibold text-muted-foreground">
              {selectedPieceId
                ? "Click a cell or drag the piece to place it"
                : "Click or drag a piece to place it"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {pieces.map((piece) => (
                <PiecePreview
                  key={piece.id}
                  piece={piece}
                  isSelected={piece.id === selectedPieceId}
                  onClick={() => handlePieceSelect(piece.id)}
                  onDragStart={handleDragStart}
                />
              ))}
              {pieces.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  All pieces placed! Loading question...
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* ---- QUIZ PHASE ---- */}
      {phase === "quiz" && quizState && quizQuestion && (
        <div className="space-y-4 rounded-2xl border border-datefix-blue/30 bg-gradient-to-br from-datefix-blue/5 to-datefix-pink/5 p-6">
          <div className="space-y-2 text-center">
            <p className="text-xs font-bold tracking-wider text-datefix-blue uppercase">
              Quiz Time
            </p>
            <p className="text-base font-bold text-foreground leading-snug">
              {quizQuestion.question}
            </p>
            {!quizState.revealed && quizState.wrongCount > 0 && (
              <p className="text-xs font-bold text-red-400">
                +{quizState.wrongCount}{" "}
                {quizState.wrongCount === 1 ? "piece" : "pieces"} penalty
              </p>
            )}
          </div>

          <div className="space-y-2">
            {quizState.options.map((option, i) => {
              const isCorrect = option === quizState.correctAnswer;
              const wasWrong = quizState.wrongAnswers.has(option);
              const isRevealed = quizState.revealed;
              const isDisabled = isRevealed || wasWrong;

              return (
                <button
                  key={i}
                  onClick={() => {
                    if (!isDisabled) handleAnswer(option);
                  }}
                  disabled={isDisabled}
                  className={cn(
                    "w-full cursor-pointer rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
                    isRevealed && isCorrect
                      ? "border-datefix-green/50 bg-datefix-green/10 text-datefix-green"
                      : wasWrong
                        ? "border-red-500/50 bg-red-500/10 text-red-400 opacity-60"
                        : isRevealed
                          ? "border-border/30 bg-card/50 text-muted-foreground opacity-60"
                          : "border-border/50 bg-card text-foreground hover:border-datefix-blue/40 hover:bg-datefix-blue/5",
                  )}
                >
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                  {wasWrong && !isRevealed && (
                    <span className="ml-2 text-[10px] font-bold text-red-400">
                      +1 piece
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {quizState.revealed && (
            <div className="space-y-3 pt-2 text-center">
              <p
                className={cn(
                  "text-sm font-bold",
                  quizState.wrongCount === 0
                    ? "text-datefix-green"
                    : "text-datefix-gold",
                )}
              >
                {quizState.wrongCount === 0
                  ? "Correct! +5 bonus points"
                  : `Correct! Next round: ${3 + penaltyPieces} pieces to place`}
              </p>
              <button
                onClick={handleQuizContinue}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-datefix-blue px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---- GAME OVER ---- */}
      {phase === "gameover" && (
        <div className="space-y-5 rounded-2xl border border-datefix-gold/30 bg-gradient-to-r from-datefix-gold/5 via-datefix-pink/5 to-datefix-blue/5 p-6 text-center">
          <div className="space-y-1">
            <p className="text-xs font-bold tracking-wider text-datefix-gold uppercase">
              Game Over
            </p>
            <p className="text-4xl font-extrabold text-foreground">{score}</p>
            <p className="text-sm text-muted-foreground">points</p>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {linesCleared}
              </p>
              <p className="text-xs">Lines Cleared</p>
            </div>
            <div className="h-8 w-px bg-border/50" />
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {questionsAnswered}
              </p>
              <p className="text-xs">Questions</p>
            </div>
            <div className="h-8 w-px bg-border/50" />
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{highScore}</p>
              <p className="text-xs">High Score</p>
            </div>
          </div>

          {score >= highScore && score > 0 && (
            <p className="text-sm font-bold text-datefix-gold">
              New High Score!
            </p>
          )}

          <button
            onClick={handlePlayAgain}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-datefix-blue px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
