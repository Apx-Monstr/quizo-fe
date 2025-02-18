
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ReactNode } from "react"

const IconButton = ({ children, isActive, onClick, isToggleable = false, tooltip = "", className="" }
    :{
        children:ReactNode,
        isActive?:boolean,
        onClick?:VoidFunction,
        isToggleable?:boolean,
        tooltip?:string,
        className?:string
    }
) => {
    return (
        tooltip ? (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <div 
                            onClick={onClick}
                            className={`aspect-square px-2.5 flex items-center rounded max-h-min transition-colors ${
                                isToggleable 
                                    ? (isActive ? 'bg-gray-600' : 'bg-gray-200')
                                    : 'bg-[#292137]'
                            }`}
                        >
                            {children}
                        </div> 
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ) : (
            <div
                onClick={onClick}
                className={`aspect-square cursor-pointer px-2.5 max-h-min flex items-center rounded transition-colors ${className} ${
                    isToggleable 
                        ? (isActive ? 'bg-gray-600' : 'bg-gray-200')
                        : 'bg-[#292137]'
                }`}
            >
                {children}
            </div> 
        )
    )
}

export default IconButton