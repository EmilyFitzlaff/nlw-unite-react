import { ComponentProps } from "react";

interface TableCellProps extends ComponentProps<'td'> {
    textAlign?: string;
}

export function TableCell({ textAlign, children, ...props }: TableCellProps) {
    return (
        <td {...props} className={`py-3 px-4 text-sm text-zinc-3 ${textAlign}`}>{children}</td>
    )
}