import * as React from "react"
import { cn } from "../../lib/utils"

const Spinner = React.forwardRef(({ className, size = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        size === "sm" && "h-4 w-4",
        size === "default" && "h-8 w-8", 
        size === "lg" && "h-12 w-12",
        className
      )}
      {...props}
    />
  )
})
Spinner.displayName = "Spinner"

export { Spinner }
