import { useState, type ReactNode } from "react";
import { BellIcon, XIcon } from "./Icons";
import { NotificationBadge } from "./NotificationBadge";
import { Popover } from "./Popover";
import { cn } from "../lib/cn";

export interface NotificationItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  /** Např. „před 2 minutami“. */
  time?: ReactNode;
  read?: boolean;
}

export interface NotificationPopoverProps {
  notifications: NotificationItem[];
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
  onNotificationClick?: (id: string) => void;
  title?: ReactNode;
  emptyLabel?: ReactNode;
  markAllLabel?: ReactNode;
  className?: string;
}

/** Zvonek s počtem nepřečtených a rozbalovacím seznamem oznámení. */
export function NotificationPopover({
  notifications,
  onMarkAllRead,
  onDismiss,
  onNotificationClick,
  title = "Oznámení",
  emptyLabel = "Žádná nová oznámení",
  markAllLabel = "Označit vše jako přečtené",
  className,
}: NotificationPopoverProps) {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      align="end"
      className={cn("cbb-notifs", className)}
      trigger={
        <NotificationBadge count={unread}>
          <button type="button" className="cbb-iconbtn" aria-label={`${title}${unread ? ` (${unread})` : ""}`}>
            <BellIcon size={18} />
          </button>
        </NotificationBadge>
      }
    >
      <div className="cbb-notifs__head">
        <span>{title}</span>
        {onMarkAllRead && unread > 0 && (
          <button type="button" onClick={onMarkAllRead}>
            {markAllLabel}
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <p className="cbb-notifs__empty">{emptyLabel}</p>
      ) : (
        <ul className="cbb-notifs__list">
          {notifications.map((n) => (
            <li key={n.id} className={cn("cbb-notifs__item", !n.read && "is-unread")}>
              <button
                type="button"
                className="cbb-notifs__main"
                onClick={() => {
                  onNotificationClick?.(n.id);
                }}
              >
                {!n.read && <span className="cbb-notifs__dot" aria-label="Nepřečtené" />}
                <span className="cbb-notifs__text">
                  <span className="cbb-notifs__title">{n.title}</span>
                  {n.description && <span className="cbb-notifs__desc">{n.description}</span>}
                  {n.time && <span className="cbb-notifs__time">{n.time}</span>}
                </span>
              </button>
              {onDismiss && (
                <button type="button" className="cbb-notifs__x" onClick={() => onDismiss(n.id)} aria-label="Odstranit oznámení">
                  <XIcon size={14} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Popover>
  );
}
