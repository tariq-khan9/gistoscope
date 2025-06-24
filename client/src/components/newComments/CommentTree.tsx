import React, { useState, useEffect, useRef, useMemo } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { CommentType } from "../../services/types";
import CommentCard from "./CommentCard";
import { groupCommentsByParent } from "../../services/utils/groupCommentsByParent";
import { sortCommentsByCreatedAt } from "../../services/utils/sortCommentsByTime";

interface Props {
  editId: number;
  comments: CommentType[];
  handleRefetchComments: () => void;
}

export default function CommentTree({
  comments,
  editId,
  handleRefetchComments,
}: Props) {
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set()
  );
  const [fullSizeComments, setFullSizeComments] = useState<Set<number>>(
    new Set()
  );
  const [focusedComment, setFocusedComment] = useState<number | null>(null);
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const treeRef = useRef<HTMLDivElement>(null); //outside click will set focus false

  const toggleComment = (commentId: number, parentId: number | null) => {
    setFocusedComment(commentId);

    setScrollTrigger((prev) => prev + 1);

    setExpandedComments((prev) => {
      const newExpanded = new Set(prev);

      if (newExpanded.has(commentId)) {
        // Collapse the comment if already expanded
        newExpanded.delete(commentId);
      } else {
        // Collapse all siblings (other children of same parent)
        const siblingIds = comments
          .filter((c) => c.parentId === parentId)
          .map((c) => c.id);

        siblingIds.forEach((id) => newExpanded.delete(id));

        // Expand the clicked comment
        newExpanded.add(commentId);
      }

      return newExpanded;
    });
  };

  const toggleFullSize = (commentId: number) => {
    setFocusedComment(commentId);

    const newFullSize = new Set(fullSizeComments);
    newFullSize.has(commentId)
      ? newFullSize.delete(commentId)
      : newFullSize.add(commentId);
    setFullSizeComments(newFullSize);
  };

  const renderCommentNode = (comment: CommentType) => {
    const children = comments
      .filter((c) => c.parentId === comment.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    const isExpanded = expandedComments.has(comment.id);
    const isFullSize = fullSizeComments.has(comment.id);
    const isFocused = focusedComment === comment.id;

    // Only render TreeNode children if expanded AND has at least one child
    const childNodes =
      isExpanded && children.length > 0
        ? children.map((child) => renderCommentNode(child))
        : null;

    return (
      <TreeNode
        key={comment.id}
        label={
          <div className="flex justify-center">
            <CommentCard
              comment={comment}
              editId={editId}
              replies={children.length}
              handleRefetchComments={handleRefetchComments}
              toggleComment={() => toggleComment(comment.id, comment.parentId)}
              toggleFullSize={() => toggleFullSize(comment.id)}
              isExpanded={isExpanded}
              isFullSize={isFullSize}
              isFocused={isFocused}
              scrollTrigger={scrollTrigger}
              onFocusClick={() => {
                setFocusedComment(comment.id);
                setScrollTrigger((prev) => prev + 1);
              }}
            />
          </div>
        }
      >
        {childNodes}
      </TreeNode>
    );
  };

  const rootComments = comments
    .filter((c) => c.parentId === null)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (treeRef.current && !treeRef.current.contains(event.target as Node)) {
        setFocusedComment(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={treeRef} className="pb-6 w-full">
      <div className="overflow-x-auto w-full pb-10">
        <Tree
          lineWidth="2px"
          lineColor="#bec0ef"
          lineBorderRadius="10px"
          label={null}
        >
          {rootComments.map((comment) => (
            <div key={comment.id} className="flex justify-center">
              {renderCommentNode(comment)}
            </div>
          ))}
        </Tree>
      </div>

      <style>{`
        .org-tree-node-label {
          display: inline-block;
          padding: 0;
          background: transparent;
        }
        .org-tree-node-children {
          display: flex;
          padding-top: 20px;
          position: relative;
          justify-content: center;
        }
        .org-tree-node-children::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: #cbd5e1;
        }
        .org-tree-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20px;
          position: relative;
          margin: 0 10px;
        }
        .org-tree > .org-tree-node::after {
          display: none !important;
        }
        .org-tree-node:not(:has(.org-tree-node-children))::after {
          display: none;
        }
        .org-tree-node-children > .org-tree-node {
          padding-top: 30px;
        }
      `}</style>
    </div>
  );
}
