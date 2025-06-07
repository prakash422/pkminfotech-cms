import * as React from "react"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, onValueChange, children, ...props }, ref) => {
    return (
      <select
        className={[
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900",
          "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        ].filter(Boolean).join(" ")}
        ref={ref}
        onChange={(e) => onValueChange?.(e.target.value)}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

// Simple implementations to avoid hydration issues
const SelectTrigger = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, ...props }, ref) => (
    <Select ref={ref} {...props}>
      {children}
    </Select>
  )
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }: { placeholder?: string }) => null

const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>

const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
)

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } 