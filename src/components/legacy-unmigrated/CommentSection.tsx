// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import "@mdxeditor/editor/style.css";
import { useEffect, useState } from "react";
import { Comment } from "@prisma/client";
import { useRouter } from "next/router";
import { Serialized } from "../../common";
import { User } from "../types/auth";
import { Button } from "../ui/button";
import CommentWithDiscussionItem from "./CommentWithDiscussion";
import CommentForm from "./CommentForm";

export interface CommentsGroup {
  closingComment: Serialized<Comment> | null;
  editingComments: Serialized<CommentWithDiscussion>[];
}

export interface CommentWithDiscussion extends Serialized<Comment> {
  replies: Array<Serialized<Comment>>;
}

const CommentSection = () => {
  const [comments, setComments] = useState<CommentsGroup[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [projectWebUrl, setProjectWebUrl] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const reso = await fetch("/api/project/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (reso.status !== 200) {
          const error = await reso.json();
          console.error("Error fetching project info", error);
        }
        const projectData = await reso.json();
        if (projectData.web_url) {
          setProjectWebUrl(projectData.web_url);
        }
      } catch (error) {
        console.error("Error fetching project info", error);
      }
    })();
  }, []);

  useEffect(() => {
    fetch("/api/comments/")
      .then((res) => res.json())
      .then(setComments);
  }, [router.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/comments/")
        .then((res) => res.json())
        .then(setComments);
    }, 30000);
    return () => clearInterval(interval);
  }, [router.pathname]);

  useEffect(() => {
    (async function () {
      const resp = await fetch("/api/whoami/");
      if (resp.status === 200) {
        setUser(await resp.json());
      }
    })();
  }, []);

  const handleCommentDelete = async (id: string) => {
    await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    });

    setComments((prev) =>
      prev.map((group) => {
        const newEditing = group.editingComments.filter((c) => c.id !== id);
        if (newEditing.length === group.editingComments.length) {
          for (const comment of group.editingComments) {
            const index = comment.replies.findIndex((c) => c.id === id);
            if (index !== -1) {
              comment.replies.splice(index, 1);
            }
          }
        }
        return { ...group, editingComments: [...group.editingComments] };
      }),
    );
  };

  const handleCommentSave = async (id: string, content: string) => {
    const resp = await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
    const newComment = await resp.json();

    setComments((prev) =>
      prev.map((group) => {
        const editingComments = group.editingComments.map((c) => {
          if (c.id === id) {
            return { ...c, content };
          }
          const replyIndex = c.replies.findIndex((r) => r.id === id);
          if (replyIndex !== -1) {
            const updatedReplies = [...c.replies];
            updatedReplies[replyIndex] = {
              ...updatedReplies[replyIndex],
              content,
            };
            return { ...c, replies: updatedReplies };
          }
          return c;
        });
        return { ...group, editingComments };
      }),
    );
  };

  const handleNewCommentCreated = async (comment: Serialized<Comment>) => {
    setComments((prev) => {
      const discussionId = comment.gitlabDiscussionId;
      let updated = false;

      const newGroups = prev.map((group) => {
        const index = group.editingComments.findIndex(
          (c) => c.gitlabDiscussionId === discussionId,
        );
        if (index !== -1) {
          const updatedComments = [...group.editingComments];
          updatedComments[index].replies.push(comment);
          updated = true;
          return { ...group, editingComments: updatedComments };
        }
        return group;
      });

      if (!updated) {
        return [
          ...newGroups,
          {
            closingComment: null,
            editingComments: [{ ...comment, replies: [] }],
          },
        ];
      }

      return newGroups;
    });
  };

  if (router.pathname === "/self-assessment" || router.pathname === "/diff") {
    return null;
  }

  return (
    <div className="mt-20 border-t border-gray-300 pt-4">
      <div>
        <p className="text-2xl font-bold">Konsultation & Kommentierung</p>
        {comments.length > 0 && (
          <p className="">
            Die AutorInnen bearbeiten diesen Kommentierungsverlauf in dem
            openCode Issue: <br />
            <a
              href={`${projectWebUrl}/-/issues/${comments[0].editingComments[0]?.gitlabIssueId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {projectWebUrl}/-/issues/
              {comments[0].editingComments[0]?.gitlabIssueId}
            </a>
          </p>
        )}
      </div>
      <div className="mt-6 w-full h-full bg-gray-100">
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <>
              <CommentWithDiscussionItem
                onDelete={handleCommentDelete}
                onSave={handleCommentSave}
                comment={comment}
                projectUrl={projectWebUrl}
                onCommentCreated={handleNewCommentCreated}
                key={comment.closingComment?.id}
                currentUserId={user?.identityId}
              />
            </>
          ))}
          {user !== null ? (
            <div className="px-8 pb-8 pt-4">
              <div className=" border-t border-gray-300">
                <CommentForm
                  discussionId={null}
                  onCommentCreated={handleNewCommentCreated}
                />
              </div>
            </div>
          ) : (
            <div className="bg-gray-50">
              <div className="px-4 py-5 sm:p-6">
                <div className="max-w-xl text-sm text-gray-500">
                  <p>
                    Hier können Sie Kommentare zu dieser Seite hinzufügen und an
                    Diskussionen teilnehmen. Diese werden von den AutorInnen in
                    einem Issue auf openCode bearbeitet. Um an der Diskussion
                    teilzunehmen, müssen Sie sich anmelden bzw.
                    registrieren.{" "}
                  </p>
                </div>
                <div className="mt-5 flex gap-4">
                  <Button
                    variant="secondary"
                    className={"cursor-pointer"}
                    onClick={() => {
                      router.push("/login");
                    }}
                  >
                    Anmelden
                  </Button>
                  <Button
                    variant="outline"
                    className={"cursor-pointer"}
                    onClick={() => {
                      router.push("/registration");
                    }}
                  >
                    Registrieren
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
