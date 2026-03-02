"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import UpdatedCard from "./updated-card";

export default function LinksForm() {
  const [links, setLinks] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const link = formData.get("link") as string;
    console.log(link);
  };
  return (
    <form onSubmit={handleSubmit}>
      <UpdatedCard>
        Festival Links
        <p>links here</p>
      </UpdatedCard>

      <h2>Social Links</h2>
      <ul className="list-disc list-inside">
        <li className="flex items-center gap-2">
          <label htmlFor="facebook">Facebook:</label>{" "}
          <Input type="text" name="facebook" placeholder="Facebook" />
        </li>
        <li className="flex items-center gap-2">
          <label htmlFor="instagram">Instagram:</label>{" "}
          <Input type="text" name="instagram" placeholder="Instagram" />
        </li>
        <li className="flex items-center gap-2">
          <label htmlFor="x">X:</label>{" "}
          <Input type="text" name="x" placeholder="X" />
        </li>
      </ul>
      <Button type="submit">Save Links</Button>
    </form>
  );
}
