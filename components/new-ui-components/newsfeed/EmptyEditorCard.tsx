import { Button } from "@/components/ui/button";
import { IconAlignLeft, IconPlus } from "@tabler/icons-react";

export default function EmptyEditorCard({
  handleNewPost,
}: {
  handleNewPost: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center rounded-xl border border-[#1e1e2e] bg-[#12121a] p-10 text-center">
      <IconAlignLeft className="size-10 text-[#2e2e3e] mb-4" />
      <p className="text-[#6b6b80] text-sm">
        Select a post to edit or create a new one
      </p>
      <Button
        onClick={handleNewPost}
        variant="outline"
        size="sm"
        className="mt-4 hover:cursor-pointer"
      >
        <IconPlus className="size-4 mr-1" />
        New Post
      </Button>
    </div>
  );
}
