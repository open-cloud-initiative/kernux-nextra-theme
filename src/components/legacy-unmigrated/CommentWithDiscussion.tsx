// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { FunctionComponent, useState } from "react";
import { CommentsGroup, CommentWithDiscussion } from "./CommentSection";
import CommentItem from "./Comment";
import { Serialized } from "@/common";
import { Comment } from "@prisma/client";
import CommentForm from "./CommentForm";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";

interface Props {
  comment: CommentsGroup;
  projectUrl: string;
  onDelete: (commentId: string) => Promise<void>;
  onCommentCreated: (comment: Serialized<Comment>) => void;
  onSave: (commentId: string, content: string) => Promise<void>;
  c: Serialized<CommentWithDiscussion>;
  index: number;
  currentUserId?: string;
}

const CommentEl: FunctionComponent<Props> = ({
  comment,
  onDelete,
  onSave,
  projectUrl,
  c,
  onCommentCreated,
  index,
  currentUserId,
}) => {
  const [answer, setAnswer] = useState(false);

  const handleCommentCreated = (comment: Serialized<Comment>) => {
    onCommentCreated(comment);
    setAnswer(false);
  };
  return (
    <li
      className={cn(
        "relative flex flex-wrap gap-x-4 pr-4 sm:pr-8",
        index > 0 && "mt-4",
      )}
    >
      <div className="flex basis-full">
        <div
          className={cn(
            index === comment.editingComments.length - 1 ? "h-2" : "-bottom-6",
            "absolute left-0 top-0 flex w-6 justify-center max-sm:hidden",
          )}
        >
          <div className="w-px bg-gray-400" />
        </div>
        <div className="relative flex size-6 flex-none items-center justify-center max-sm:hidden">
          <div className="size-2 rounded-full bg-gray-300 ring-2 ring-gray-400" />
        </div>
        <div className="basis-full mt-2 bg-gray-200">
          <CommentItem
            onDelete={onDelete}
            onSave={onSave}
            onAnswer={() => setAnswer(true)}
            comment={c}
            childComment={false}
            projectUrl={projectUrl}
            currentUserId={currentUserId}
          />
          {c.replies?.length > 0 && (
            <Collapsible className="bg-gray-200">
              <CollapsibleTrigger className="flex flex-row items-center text-start gap-2 cursor-pointer p-2">
                <ChevronUpDownIcon className="size-6 text-gray-500" />{" "}
                <span className="text-sm text-gray-500">
                  Antworten zu diesem Kommentar anzeigen
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {c.replies?.map((reply: Serialized<Comment>, index) => (
                  <div
                    key={reply.id}
                    className={cn(index === 0 && "pt-4", "pr-6 pb-6")}
                  >
                    <CommentItem
                      onDelete={onDelete}
                      onSave={onSave}
                      comment={reply}
                      childComment={true}
                      projectUrl={projectUrl}
                      key={reply.id}
                      currentUserId={currentUserId}
                    />
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
          {answer && (
            <div className="px-4 pb-4 basis-full">
              <CommentForm
                discussionId={comment.editingComments[0].gitlabDiscussionId}
                onCommentCreated={handleCommentCreated}
                isReply={true}
                setAnswer={setAnswer}
              />
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

const CommentWithDiscussionItem: FunctionComponent<{
  comment: CommentsGroup;
  projectUrl: string;
  onDelete: (commentId: string) => Promise<void>;
  onCommentCreated: (comment: Serialized<Comment>) => void;
  onSave: (commentId: string, content: string) => Promise<void>;
  currentUserId?: string;
}> = ({
  comment,
  projectUrl,
  onDelete,
  onSave,
  onCommentCreated,
  currentUserId,
}) => {
  const handleCommentCreated = (comment: Serialized<Comment>) => {
    onCommentCreated(comment);
  };

  return (
    <>
      <ul role="list" className="ml-4!">
        {comment.closingComment && (
          <li className="relative flex flex-wrap gap-x-4 pr-4 sm:pr-8">
            <div className="flex basis-full">
              <div
                className={cn(
                  "-bottom-16",
                  "absolute left-0 top-0 flex w-6 justify-center max-sm:hidden",
                )}
              >
                <div className="w-px bg-gray-400" />
              </div>
              <div className="relative flex size-6 flex-none items-center justify-center max-sm:hidden">
                <div className="size-2 rounded-full bg-gray-300 ring-2 ring-gray-400" />
              </div>
              <Collapsible>
                <CollapsibleTrigger className="flex flex-row items-start gap-2 cursor-pointer">
                  <ChevronUpDownIcon className="size-6 text-gray-500 max-sm:min-w-5" />{" "}
                  <span className="text-sm text-gray-500 text-start">
                    Der Kommentierungsverlauf wurde geschlossen. Klicken Sie
                    hier, um den Verlauf anzuzeigen.
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="">
                  <ul role="list" className="-ml-0! max-sm:ml-6!">
                    {comment.closingComment &&
                      comment.editingComments.map((c, index) => (
                        <CommentEl
                          key={c.id}
                          comment={comment}
                          projectUrl={projectUrl}
                          onDelete={onDelete}
                          onSave={onSave}
                          c={c}
                          index={index}
                          onCommentCreated={handleCommentCreated}
                          currentUserId={currentUserId}
                        />
                      ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </li>
        )}
        {!comment.closingComment &&
          comment.editingComments.map((c, index) => (
            <CommentEl
              key={c.id}
              comment={comment}
              projectUrl={projectUrl}
              onDelete={onDelete}
              onSave={onSave}
              c={c}
              index={index}
              onCommentCreated={handleCommentCreated}
              currentUserId={currentUserId}
            />
          ))}
      </ul>
    </>
  );
};

export default CommentWithDiscussionItem;
