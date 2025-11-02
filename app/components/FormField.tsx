import { type ReactNode } from "react";

interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    children: ReactNode;
    className?: string;
}

export function FormField({ label, required = false, error, children, className = '' }: FormFieldProps) {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {children}
            {error && (
                <p className="mt-1 text-sm text-red-600 font-montserrat-medium">{error}</p>
            )}
        </div>
    );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export function FormInput({ error = false, className = '', ...props }: FormInputProps) {
    const baseClasses = 'w-full px-3 py-3 border rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white';
    const errorClasses = error ? 'border-red-500' : 'border-gray-300';

    return (
        <input
            className={`${baseClasses} ${errorClasses} ${className}`}
            {...props}
        />
    );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
}

export function FormSelect({ error = false, className = '', children, ...props }: FormSelectProps) {
    const baseClasses = 'w-full px-3 py-3 border rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white';
    const errorClasses = error ? 'border-red-500' : 'border-gray-300';

    return (
        <select
            className={`${baseClasses} ${errorClasses} ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

export function FormTextarea({ error = false, className = '', ...props }: FormTextareaProps) {
    const baseClasses = 'w-full px-3 py-3 border rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white';
    const errorClasses = error ? 'border-red-500' : 'border-gray-300';

    return (
        <textarea
            className={`${baseClasses} ${errorClasses} ${className}`}
            {...props}
        />
    );
}

interface FormCurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    error?: boolean;
}

export function FormCurrencyInput({ error = false, className = '', ...props }: FormCurrencyInputProps) {
    return (
        <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500 font-montserrat-medium">$</span>
            <FormInput
                type="number"
                step="0.01"
                className={`pl-8 ${className}`}
                error={error}
                {...props}
            />
        </div>
    );
}

interface FormGridProps {
    children: ReactNode;
    columns?: 1 | 2;
    gap?: 'sm' | 'md' | 'lg';
}

export function FormGrid({ children, columns = 2, gap = 'md' }: FormGridProps) {
    const gapClasses = {
        sm: 'gap-4',
        md: 'gap-6',
        lg: 'gap-8',
    };

    const gridClasses = columns === 2
        ? 'grid grid-cols-1 md:grid-cols-2'
        : 'grid grid-cols-1';

    return (
        <div className={`${gridClasses} ${gapClasses[gap]}`}>
            {children}
        </div>
    );
}

export function FormSection({ title, children }: { title?: string; children: ReactNode }) {
    return (
        <div className="space-y-6">
            {title && (
                <h3 className="text-lg font-semibold text-gray-900 font-montserrat-semibold border-b border-gray-200 pb-2">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
}

