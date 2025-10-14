'use client';

import { Info } from 'lucide-react';
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getTooltipByKey } from '@/lib/data';
import { useEffect, useState } from 'react';
import type { TooltipData } from '@/types';

type TooltipProps = {
  tooltipKey: string;
  sector?: string;
};

export default function Tooltip({ tooltipKey, sector }: TooltipProps) {
  const [tooltip, setTooltip] = useState<TooltipData | undefined>(undefined);

  useEffect(() => {
    getTooltipByKey(tooltipKey).then(setTooltip);
  }, [tooltipKey]);

  if (!tooltip) {
    return (
        <span className="cursor-help ml-1.5">
            <Info className="h-4 w-4 text-muted-foreground/50 inline" />
        </span>
    );
  }
  
  const text = (sector && tooltip.sectorOverrides?.[sector]) || tooltip.text;

  return (
    <TooltipProvider>
      <ShadcnTooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <span className="cursor-help ml-1.5">
            <Info className="h-4 w-4 text-muted-foreground inline" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{text}</p>
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
}
