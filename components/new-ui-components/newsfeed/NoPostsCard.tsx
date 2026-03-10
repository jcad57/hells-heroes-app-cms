import { IconAlignLeft } from "@tabler/icons-react";

export default function NoPostsCard() {
  return (
    <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-6 text-center">
      <IconAlignLeft className="size-6 text-[#6b6b80] mx-auto mb-2" />
      <p className="text-[#6b6b80] text-sm">No posts yet.</p>
      <p className="text-[#6b6b80] text-xs mt-1">
        Create your first newsfeed post.
      </p>
    </div>
  );
}
