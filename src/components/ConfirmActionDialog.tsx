import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface ConfirmActionDialogProps {
  title: string;
  description: string;
  actionLabel: string;
  triggerLabel: string;
  triggerIcon?: LucideIcon;
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  actionVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onConfirm: () => void;
}

export function ConfirmActionDialog({
  title,
  description,
  actionLabel,
  triggerLabel,
  triggerIcon: TriggerIcon,
  triggerVariant = "ghost",
  actionVariant = "default",
  onConfirm,
}: ConfirmActionDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={triggerVariant} size="sm">
          {TriggerIcon && <TriggerIcon className="h-4 w-4 mr-1" />}
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={actionVariant === "destructive" ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
