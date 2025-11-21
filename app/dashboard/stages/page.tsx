"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { fetchBands } from "@/supabase/fetchBands";
import { Band } from "@/types";
import { useEffect, useState } from "react";

export default function StagesPage() {
  const [bandsData, setBandsData] = useState<z.infer<typeof Band>[]>([]);

  useEffect(() => {
    const fetchBandsData = async () => {
      const bands = await fetchBands();
      setBandsData(bands);
    };
    fetchBandsData();
  }, []);
  const lawnData = bandsData
    .filter((item) => item.stage === "lawn")
    .sort((a, b) => a.show_time.localeCompare(b.show_time));
  const upstairsData = bandsData
    .filter((item) => item.stage === "upstairs")
    .sort((a, b) => a.show_time.localeCompare(b.show_time));
  const downstairsData = bandsData
    .filter((item) => item.stage === "downstairs")
    .sort((a, b) => a.show_time.localeCompare(b.show_time));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
      <Card>
        <CardHeader>
          <CardTitle>Lawn</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Band Name</TableHead>
                <TableHead>Show Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upstairsData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.show_time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Upstairs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Band Name</TableHead>
                <TableHead>Show Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {downstairsData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.show_time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Downstairs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Band Name</TableHead>
                <TableHead>Show Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lawnData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.show_time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
