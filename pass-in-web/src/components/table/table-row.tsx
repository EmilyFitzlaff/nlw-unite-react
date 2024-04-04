import { ComponentProps } from "react";

interface TableRowProps extends ComponentProps<'tr'> { }

export function TableRow({ children, ...props }: TableRowProps) {
    return (
        <tr {...props} className='border-b border-white/10 hover:bg-white/10'>{children}</tr>
    )
}