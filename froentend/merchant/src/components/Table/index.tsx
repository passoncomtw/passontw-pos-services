import React from 'react';

interface Column<T> {
  header: string;
  key?: keyof T;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  className?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  emptyText?: string;
}

const Table = <T,>({
  data,
  columns,
  keyExtractor,
  className = '',
  rowClassName = '',
  emptyText = '無數據',
}: TableProps<T>) => {
  if (data.length === 0) {
    return <p className="text-gray-600 py-4">{emptyText}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm text-left ${className}`}>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={`px-4 py-2 ${column.className || ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const rowClass = typeof rowClassName === 'function' 
              ? rowClassName(item, index) 
              : rowClassName;
              
            return (
              <tr 
                key={keyExtractor(item)} 
                className={`border-b hover:bg-gray-50 ${rowClass}`}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={`px-4 py-3 ${column.className || ''}`}>
                    {column.render 
                      ? column.render(item) 
                      : column.key 
                      ? String(item[column.key])
                      : null
                    }
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table; 