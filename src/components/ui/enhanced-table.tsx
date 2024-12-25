import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, FileText, FileSpreadsheet } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  sortable?: boolean;
}

interface EnhancedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export function EnhancedTable<T>({ 
  data, 
  columns,
  onExportPDF = () => console.log('Export PDF clicked'),
  onExportExcel = () => console.log('Export Excel clicked')
}: EnhancedTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    setSortConfig(current => ({
      key: column.accessorKey,
      direction: current.key === column.accessorKey && current.direction === 'asc' 
        ? 'desc' 
        : 'asc'
    }));
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <Card className="w-full">
      <div className="p-4 flex justify-end gap-2 border-b">
        <Button variant="outline" onClick={onExportExcel}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
        <Button variant="outline" onClick={onExportPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>
                  {column.sortable ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 flex items-center gap-1 -ml-4 hover:bg-transparent"
                        >
                          {column.header}
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleSort(column)}>
                          Sort {sortConfig.key === column.accessorKey && sortConfig.direction === 'asc' 
                            ? 'Descending' 
                            : 'Ascending'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {String(row[column.accessorKey])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}