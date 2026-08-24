"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Label } from "@/components/ui/label";

type EditorCommand =
  | "bold"
  | "italic"
  | "underline"
  | "insertUnorderedList"
  | "insertOrderedList"
  | "justifyLeft"
  | "justifyCenter"
  | "justifyRight"
  | "justifyFull"
  | "removeFormat"
  | "undo"
  | "redo"
  | "formatBlock"
  | "foreColor"
  | "createLink";

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm text-slate-600 transition hover:bg-slate-200 hover:text-[#065b48] focus-visible:outline-2 focus-visible:outline-[#00af84]"
    >
      {children}
    </button>
  );
}

export function syncRichTextEditors(form: HTMLFormElement) {
  form.querySelectorAll<HTMLElement>("[data-rich-text-editor]").forEach((editor) => {
    const name = editor.dataset.name;
    if (!name) return;
    const input = form.querySelector<HTMLInputElement>(`input[type="hidden"][name="${name}"]`);
    if (input) input.value = editor.innerHTML;
  });
}

export function RichTextEditor({
  name,
  label,
  defaultValue,
  description,
  preset = "full",
}: {
  name: string;
  label: string;
  defaultValue: string;
  description?: string;
  preset?: "full" | "title";
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const savedRange = useRef<Range | null>(null);

  const rememberSelection = () => {
    const selection = window.getSelection();
    const editor = editorRef.current;
    if (!selection?.rangeCount || !editor || !editor.contains(selection.anchorNode)) return;
    savedRange.current = selection.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection || !savedRange.current) return;
    selection.removeAllRanges();
    selection.addRange(savedRange.current);
  };

  const sync = () => {
    if (editorRef.current && inputRef.current) {
      inputRef.current.value = editorRef.current.innerHTML;
    }
  };

  useEffect(() => {
    sync();
    const form = inputRef.current?.form;
    if (!form) return;
    form.addEventListener("submit", sync);
    return () => form.removeEventListener("submit", sync);
  }, []);

  const run = (command: EditorCommand, argument?: string) => {
    editorRef.current?.focus();
    restoreSelection();
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current && !editorRef.current.contains(selection.anchorNode)) {
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    if (["bold", "italic", "underline", "foreColor"].includes(command)) {
      document.execCommand("styleWithCSS", false, "true");
    }
    document.execCommand(command, false, argument);
    sync();
    rememberSelection();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`${name}-editor`}>{label}</Label>
      {description ? <p className="text-xs text-slate-500">{description}</p> : null}
      <input ref={inputRef} type="hidden" name={name} defaultValue={defaultValue} />
      <div className="overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-[#00af84] focus-within:ring-2 focus-within:ring-[#00af84]/15">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 p-2">
          {preset === "full" ? (
            <select
              aria-label="Style du texte"
              defaultValue=""
              onMouseDown={rememberSelection}
              onChange={(event) => {
                if (event.target.value) run("formatBlock", event.target.value);
                event.target.value = "";
              }}
              className="mr-1 h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700"
            >
              <option value="">Style</option>
              <option value="p">Paragraphe</option>
              <option value="h2">Grand titre</option>
              <option value="h3">Sous-titre</option>
              <option value="blockquote">Citation</option>
            </select>
          ) : null}
          <ToolbarButton label="Gras" onClick={() => run("bold")}>
            <span className="font-bold">B</span>
          </ToolbarButton>
          <ToolbarButton label="Italique" onClick={() => run("italic")}>
            <span className="italic">I</span>
          </ToolbarButton>
          <ToolbarButton label="Souligné" onClick={() => run("underline")}>
            <span className="underline">U</span>
          </ToolbarButton>
          <span className="mx-1 h-6 w-px bg-slate-200" aria-hidden />
          <ToolbarButton label="Aligner à gauche" onClick={() => run("justifyLeft")}>
            ≡
          </ToolbarButton>
          <ToolbarButton label="Centrer" onClick={() => run("justifyCenter")}>
            ≣
          </ToolbarButton>
          <ToolbarButton label="Aligner à droite" onClick={() => run("justifyRight")}>
            ≡
          </ToolbarButton>
          <ToolbarButton label="Justifier" onClick={() => run("justifyFull")}>
            ☰
          </ToolbarButton>
          {preset === "full" ? (
            <>
              <span className="mx-1 h-6 w-px bg-slate-200" aria-hidden />
              <ToolbarButton label="Liste à puces" onClick={() => run("insertUnorderedList")}>
                •
              </ToolbarButton>
              <ToolbarButton label="Liste numérotée" onClick={() => run("insertOrderedList")}>
                1.
              </ToolbarButton>
              <ToolbarButton
                label="Lien"
                onClick={() => {
                  const url = window.prompt("Adresse du lien (https://… ou /page)", "https://");
                  if (url?.trim()) run("createLink", url.trim());
                }}
              >
                ↗
              </ToolbarButton>
            </>
          ) : null}
          <label
            title="Couleur du texte"
            aria-label="Couleur du texte"
            onMouseDown={rememberSelection}
            className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg font-bold text-slate-600 hover:bg-slate-200"
          >
            A
            <span className="absolute bottom-1.5 h-0.5 w-4 bg-[#00af84]" />
            <input
              type="color"
              defaultValue="#065b48"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(event) => run("foreColor", event.target.value)}
            />
          </label>
          <span className="mx-1 h-6 w-px bg-slate-200" aria-hidden />
          <ToolbarButton label="Annuler" onClick={() => run("undo")}>
            ↺
          </ToolbarButton>
          <ToolbarButton label="Rétablir" onClick={() => run("redo")}>
            ↻
          </ToolbarButton>
          <ToolbarButton label="Effacer la mise en forme" onClick={() => run("removeFormat")}>
            Tx
          </ToolbarButton>
        </div>
        <div
          ref={editorRef}
          id={`${name}-editor`}
          data-rich-text-editor
          data-name={name}
          role="textbox"
          aria-multiline="true"
          contentEditable
          suppressContentEditableWarning
          onInput={sync}
          onKeyUp={rememberSelection}
          onMouseUp={rememberSelection}
          onBlur={sync}
          dangerouslySetInnerHTML={{ __html: defaultValue }}
          className={
            preset === "title"
              ? "min-h-24 px-4 py-3 text-lg font-bold leading-7 text-slate-800 outline-none"
              : "min-h-36 px-4 py-3 text-sm leading-7 text-slate-700 outline-none [&_blockquote]:border-l-4 [&_blockquote]:border-[#00af84] [&_blockquote]:pl-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc"
          }
        />
      </div>
    </div>
  );
}
