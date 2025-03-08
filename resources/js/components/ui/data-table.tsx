import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: {
        pageIndex: number;
        pageSize: number;
        pageCount: number;
    };
    onPageChange?: (page: number) => void;
    searchable?: boolean;
    searchColumn?: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pagination,
    onPageChange,
    searchable = false,
    searchColumn = "namamatakuliah",
}: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = useState("");
    
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
        pageCount: pagination?.pageCount || -1,
        state: {
            pagination: {
                pageIndex: pagination?.pageIndex || 0,
                pageSize: pagination?.pageSize || 10,
            },
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: (updater) => {
            if (onPageChange) {
                const newState = typeof updater === 'function'
                    ? updater({
                        pageIndex: pagination?.pageIndex || 0,
                        pageSize: pagination?.pageSize || 10,
                    })
                    : updater;
                onPageChange(newState.pageIndex);
            }
        },
        globalFilterFn: (row, columnId, filterValue) => {
            const value = row.getValue(searchColumn as string) as string;
            return value?.toLowerCase().includes(filterValue.toLowerCase());
        },
    });

    return (
        <div className="space-y-4">
            {searchable && (
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Cari..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            )}
            
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Tidak ada data
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Sebelumnya
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: pagination.pageCount }, (_, i) => (
                            <Button
                                key={i}
                                variant={i === pagination.pageIndex ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange?.(i)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Selanjutnya
                    </Button>
                </div>
            )}
        </div>
    );
} 