import { IconPencil } from "@tabler/icons-react";
import { NewsFeedItem } from "@/types";
import { z } from "zod";
import { IconClock } from "@tabler/icons-react";
import { formatDateShort } from "@/utils/format-date-helper";

type Post = z.infer<typeof NewsFeedItem>;

export default function NewsfeedPost({
  post,
  isActive,
  handleSelectPost,
}: {
  post: Post;
  isActive: boolean;
  handleSelectPost: (post: Post) => void;
}) {
  return (
    <button
      key={post.id}
      onClick={() => handleSelectPost(post)}
      className={[
        "text-left w-full p-4 rounded-xl border hover:cursor-pointer transition-all duration-200 group",
        isActive
          ? "border-[#3A97D4]/50 bg-[#3A97D4]/5"
          : "border-[#1e1e2e] bg-[#12121a] hover:border-[#2e2e3e] hover:bg-[#1a1a24]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={[
            "font-medium text-sm truncate",
            isActive ? "text-[#3A97D4]" : "text-[#e8e8f0]",
          ].join(" ")}
        >
          {post.title}
        </p>
        {isActive && (
          <IconPencil className="size-3 text-[#3A97D4] flex-shrink-0 mt-0.5 hover:cursor-pointer" />
        )}
      </div>
      <p className="text-xs text-[#6b6b80] mt-1.5 line-clamp-2 leading-relaxed">
        {post.body}
      </p>
      <p className="text-[11px] text-[#6b6b80] mt-2.5 flex items-center gap-1">
        <IconClock className="size-3" />
        {formatDateShort(post.created_at)}
      </p>
    </button>
  );
}
