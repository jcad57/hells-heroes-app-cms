import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import data from "../data.json";

export default function StagesPage() {
  const lawnData = data
    .filter((item) => item.stage === "Lawn")
    .sort((a, b) => a.showTime.localeCompare(b.showTime));
  const upstairsData = data
    .filter((item) => item.stage === "Upstairs")
    .sort((a, b) => a.showTime.localeCompare(b.showTime));
  const downstairsData = data
    .filter((item) => item.stage === "Downstairs")
    .sort((a, b) => a.showTime.localeCompare(b.showTime));

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
                  <TableCell className="font-medium">{item.bandName}</TableCell>
                  <TableCell>{item.showTime}</TableCell>
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
                  <TableCell className="font-medium">{item.bandName}</TableCell>
                  <TableCell>{item.showTime}</TableCell>
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
                  <TableCell className="font-medium">{item.bandName}</TableCell>
                  <TableCell>{item.showTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
