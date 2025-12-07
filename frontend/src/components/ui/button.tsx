import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/cn"

// Simplified Slot implementation to avoid @radix-ui/react-slot dependency
const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>(
    ({ children, ...props }, ref) => {
        if (React.isValidElement(children)) {
            return React.cloneElement(children, {
                ...props,
                ...(children.props as any),
                className: cn(props.className, (children.props as any).className),
                ref: (node: any) => {
                    // Very basic ref merging
                    if (ref) {
                        if (typeof ref === 'function') ref(node);
                        else (ref as any).current = node;
                    }

                    const childRef = (children as any).ref;
                    if (childRef) {
                        if (typeof childRef === 'function') childRef(node);
                        else childRef.current = node;
                    }
                }
            } as any);
        }
        return null;
    }
);

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
                destructive:
                    "bg-red-500 text-slate-50 hover:bg-red-500/90",
                outline:
                    "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
                secondary:
                    "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
                ghost: "hover:bg-slate-100 hover:text-slate-900",
                link: "text-slate-900 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? (Slot as any) : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
