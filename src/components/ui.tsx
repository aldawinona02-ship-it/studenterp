import React from 'react';
import { cn } from './Layout';

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div 
      className={cn("bg-[#1b2433] rounded-xl border border-slate-800 shadow-sm overflow-hidden", className)} 
      {...props} 
    />
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6 pb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-lg font-medium text-white", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}
