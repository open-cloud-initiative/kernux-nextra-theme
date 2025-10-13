// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { CommentCreateRequest } from "../pages/api/comments";
import { Serialized } from "@/common";
import { Comment } from "@prisma/client";
import MarkdownEditor from "./MarkdownEditor";

interface props {
  onCommentCreated: (comment: Serialized<Comment>) => void;
  discussionId: string | null;
  isReply?: boolean;
  setAnswer?: (value: boolean) => void;
}

const CommentForm = ({
  onCommentCreated,
  discussionId,
  isReply,
  setAnswer,
}: props) => {
  const [comment, setComment] = useState({ content: "", discussionId: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const req: CommentCreateRequest = {
      content: comment.content,
      discussionId,
    };

    const resp = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    if (resp.ok === false) {
      console.error("Fehler beim Erstellen des Kommentars:", resp.statusText);
      setError(
        "Es ist leider ein Fehler beim Erstellen des Kommentars aufgetreten. Bitte versuchen Sie es später erneut.",
      );
      setLoading(false);
      return;
    }

    const newComment = await resp.json();
    onCommentCreated(newComment);
    setComment({ content: "", discussionId: "" });
    setLoading(false);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <MarkdownEditor
        className="border border-gray-300 rounded"
        placeholder={
          isReply
            ? "Schreiben Sie eine Antwort..."
            : "Schreiben Sie einen Kommentar..."
        }
        markdown={comment.content}
        onChange={(setContent) => {
          setComment((prev) => ({
            ...prev,
            content: setContent,
          }));
        }}
      />
      <div className="mt-4 flex justify-end">
        <Button
          variant="secondary"
          type="submit"
          disabled={comment.content.length === 0 || loading}
        >
          {loading ? (
            <span className="flex flex-row items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Wird gespeichert
            </span>
          ) : isReply ? (
            "Antworten"
          ) : (
            "Kommentar abschicken"
          )}
        </Button>
        {isReply && (
          <Button
            variant="default"
            type="button"
            className="ml-2"
            onClick={() => {
              setAnswer && setAnswer(false);
            }}
          >
            Abbrechen
          </Button>
        )}
      </div>
      {!!error && (
        <div className="mt-8 text-red-500 flex justify-end">
          <p>{error}</p>
        </div>
      )}
    </form>
  );
};

export default CommentForm;
