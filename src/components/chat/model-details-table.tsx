import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export type ModelDetails = Record<string, React.ReactElement>;

export function ModelDetailsTable({ details }: { details: ModelDetails }) {
  return (
    <Table>
      <TableBody>
        {Object.entries(details).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell>{key}</TableCell>
            <TableCell>{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
