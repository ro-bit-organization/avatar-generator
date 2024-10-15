import { File } from 'lucide-react';
import * as React from 'react';
import { cn } from '~/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => {
	const inputRef = React.useRef<HTMLInputElement>(null);

	return (
		<div className="relative w-full">
			<File size="16" className="absolute left-2 top-[10px] cursor-pointer text-muted-foreground" onClick={() => inputRef.current?.click()} />
			<input type="file" className="hidden" ref={inputRef} />
			<input
				type={type}
				className={cn(
					'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
					className
				)}
				ref={ref}
				{...props}
			/>
		</div>
	);
});
Input.displayName = 'Input';

export { Input };
