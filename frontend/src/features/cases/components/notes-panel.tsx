"use client";

import React, { useState } from "react";
import { InvestigationNote } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { Button } from "@/components/ui/button";
import { 
  Notebook, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  MessageSquare,
  Clock,
  User,
  History
} from "lucide-react";

interface NotesPanelProps {
  notes: InvestigationNote[];
  onAddNote: (content: string) => Promise<unknown>;
  onUpdateNote: (noteId: number, content: string) => Promise<unknown>;
  onDeleteNote: (noteId: number) => Promise<unknown>;
}

export function NotesPanel({ notes, onAddNote, onUpdateNote, onDeleteNote }: NotesPanelProps) {
  const { t } = useLocale();
  
  // State for adding a note
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States for editing a note
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const result = await onAddNote(newNoteContent.trim());
    setIsSubmitting(false);
    if (result) {
      setNewNoteContent("");
    }
  };

  const handleStartEdit = (note: InvestigationNote) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditContent("");
  };

  const handleSaveEdit = async (noteId: number) => {
    if (!editContent.trim() || isSavingEdit) return;

    setIsSavingEdit(true);
    const result = await onUpdateNote(noteId, editContent.trim());
    setIsSavingEdit(false);
    if (result) {
      setEditingNoteId(null);
      setEditContent("");
    }
  };

  const handleDelete = async (noteId: number) => {
    const confirmed = window.confirm(t("noteDeleteConfirm"));
    if (confirmed) {
      await onDeleteNote(noteId);
    }
  };

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      {/* Header bar */}
      <div className="p-4 bg-muted/10 border-b border-border flex items-center gap-2">
        <Notebook className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
          {t("panelNotes")} ({notes.length})
        </h3>
      </div>

      {/* Editor list */}
      <div className="p-4 space-y-6">
        {/* Notes Listing */}
        {notes.length === 0 ? (
          <div className="p-6 border border-border border-dashed rounded-lg text-center bg-muted/5">
            <MessageSquare className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground italic font-semibold">
              {t("noteNoNotes")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className="p-4 bg-muted/30 border border-border rounded-xl relative group transition-all-custom hover:bg-muted/40"
              >
                {editingNoteId === note.id ? (
                  /* Note Editing Text Area */
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      value={editContent}
                      disabled={isSavingEdit}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isSavingEdit}
                        onClick={handleCancelEdit}
                        className="h-8 text-[11px] font-semibold px-3.5"
                      >
                        <X className="h-3 w-3 mr-1" />
                        {t("formCancelButton")}
                      </Button>
                      <Button
                        size="sm"
                        disabled={isSavingEdit}
                        onClick={() => handleSaveEdit(note.id)}
                        className="h-8 text-[11px] font-semibold px-3.5"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        {t("noteEditSave")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Standard Note Card Layout */
                  <div className="space-y-2 text-xs">
                    <p className="text-foreground leading-relaxed whitespace-pre-line font-medium">
                      {note.content}
                    </p>
                    
                    {/* Footnote attribution details */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-2 text-[10px] text-muted-foreground font-semibold">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3 text-primary/60" />
                          {t("noteCreatedBy")}: {note.createdBy}
                        </span>
                        
                        <span className="flex items-center gap-1 text-[9px] font-medium font-mono">
                          <Clock className="h-3 w-3" />
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {/* Display Modified marker if edited */}
                      {note.lastModifiedBy && (
                        <span className="flex items-center gap-0.5 text-[9px] italic font-medium">
                          <History className="h-3 w-3" />
                          {t("noteLastModified")}: {note.lastModifiedBy}
                        </span>
                      )}
                    </div>

                    {/* Edit / Delete action overlay triggers */}
                    <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={() => handleStartEdit(note)}
                        className="p-1.5 rounded-md hover:bg-muted border border-border/40 bg-card text-muted-foreground hover:text-foreground cursor-pointer"
                        title={t("noteTooltipEdit")}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 border border-border/40 bg-card text-muted-foreground hover:text-destructive cursor-pointer"
                        title={t("noteTooltipDelete")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Input Text Box Form */}
        <form onSubmit={handleSubmitNote} className="space-y-3 pt-2 border-t border-border/40">
          <textarea
            rows={3}
            value={newNoteContent}
            disabled={isSubmitting}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder={t("notePlaceholder")}
            className="w-full text-xs p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !newNoteContent.trim()}
              className="font-bold flex items-center gap-1.5 text-xs h-9 px-5"
            >
              <Notebook className="h-3.5 w-3.5" />
              {t("noteSubmit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
