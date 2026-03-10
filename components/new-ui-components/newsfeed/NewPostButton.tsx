import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export default function NewPostButton({
  handleNewPost,
}: {
  handleNewPost: () => void;
}) {
  return (
    <Button onClick={handleNewPost} className="w-full hover:cursor-pointer">
      <IconPlus className="size-4" />
      New Post
    </Button>
  );
}
