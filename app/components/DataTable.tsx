import { type ReactNode } from 'react';

export interface Column<T> {
    key: string;
    header: string;
    accessor?: (row: T) => ReactNode;
    render?: (value: any, row: T) => ReactNode;
    sortable?: boolean;
    className?: string;
    headerClassName?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    emptyMessage?: string;
    emptyDescription?: string;
    onRowClick?: (row: T) => void;
    keyExtractor: (row: T) => string;
    className?: string;
}

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    isLoading = false,
    emptyMessage = "No data found",
    emptyDescription,
    onRowClick,
    keyExtractor,
    className = "",
}: DataTableProps<T>) {
    if (isLoading) {
        return (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={column.key || index}
                                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-semibold ${column.headerClassName || ""}`}
                                    >
                                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[...Array(5)].map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 font-montserrat-medium">
                    {emptyMessage}
                </h3>
                {emptyDescription && (
                    <p className="mt-1 text-sm text-gray-500 font-montserrat-regular">
                        {emptyDescription}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className={`bg-white shadow-sm rounded-lg overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={column.key || index}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-semibold ${column.headerClassName || ""}`}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row) => {
                            const rowKey = keyExtractor(row);
                            return (
                                <tr
                                    key={rowKey}
                                    onClick={() => onRowClick?.(row)}
                                    className={onRowClick ? "hover:bg-gray-50 cursor-pointer transition-colors" : "hover:bg-gray-50"}
                                >
                                    {columns.map((column, colIndex) => {
                                        const cellKey = `${rowKey}-${column.key || colIndex}`;
                                        let cellContent: ReactNode;

                                        if (column.render) {
                                            cellContent = column.render(row[column.key], row);
                                        } else if (column.accessor) {
                                            cellContent = column.accessor(row);
                                        } else {
                                            cellContent = row[column.key] ?? '';
                                        }

                                        return (
                                            <td
                                                key={cellKey}
                                                className={`px-6 py-4 whitespace-nowrap ${column.className || ""}`}
                                            >
                                                {cellContent}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

