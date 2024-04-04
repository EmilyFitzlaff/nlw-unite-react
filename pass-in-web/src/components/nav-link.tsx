import { ComponentProps } from "react";

interface NavLinkProps extends ComponentProps<'a'> {
    text: string;
}

export function NavLink({ text, ...props }: NavLinkProps) {
    return (
        <a {...props} className='font-medium text-sm'>{text}</a>
    )
}