import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
} from "../ui/alert-dialog";
import { api } from "@/trpc/react";
import type { Dispatch, SetStateAction } from "react";
import { SpinnerIcon } from "@phosphor-icons/react";

export const ChatDeleteDialog = ({
  open,
  setOpen,
  chatUuid,
  refetch,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  chatUuid: string;
  refetch?: () => void;
}) => {
  const { mutateAsync: deleteChat, isPending: isDeleting } =
    api.chat.deleteChat.useMutation({
      onSuccess: () => {
        setOpen(false);
      },
    });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <h3 className="text-lg font-semibold">Delete Chat</h3>
        </AlertDialogHeader>
        <p className="text-muted-foreground text-sm">
          Are you sure you want to delete this chat? This action cannot be
          undone.
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            variant="gradientDestructive"
            onClick={async () => {
              await deleteChat({ chatUuid: chatUuid });
              refetch?.();
            }}
          >
            {isDeleting ? (
              <>
                <SpinnerIcon className="h-4 w-4 animate-spin" /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
