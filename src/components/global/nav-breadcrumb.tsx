"use client";

import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { api } from "@/trpc/react";

type BreadcrumbSegment = {
  label: string;
  href: string;
  isLast: boolean;
};

const BreadCrumbGenerator = (
  pathname: string,
  chatTitle?: string,
): BreadcrumbSegment[] => {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const segments = normalizedPath.split("/").filter(Boolean);
  const isDashboardRoute = segments[0] === "dashboard";

  const breadcrumbs: BreadcrumbSegment[] = [
    {
      label: isDashboardRoute ? "Dashboard" : "Home",
      href: isDashboardRoute ? "/dashboard" : "/",
      isLast:
        (isDashboardRoute && normalizedPath === "/dashboard") ||
        (!isDashboardRoute && normalizedPath === "/"),
    },
  ];

  const trailSegments = isDashboardRoute ? segments.slice(1) : segments;

  for (let i = 0; i < trailSegments.length; i++) {
    const segment = trailSegments[i];
    if (!segment) continue;

    const priorSegments = isDashboardRoute ? ["dashboard"] : [];
    const href =
      "/" + [...priorSegments, ...trailSegments.slice(0, i + 1)].join("/");
    const isLast = i === trailSegments.length - 1;
    let label = segment
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    if (breadcrumbs[breadcrumbs.length - 1]?.label === "Chat" && chatTitle) {
      label = chatTitle;
    }

    breadcrumbs.push({
      label,
      href,
      isLast,
    });
  }

  return breadcrumbs;
};

export function NavBreadCrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const chatIndex = segments.indexOf("chat");
  const chatUuid =
    chatIndex !== -1 && chatIndex + 1 < segments.length
      ? segments[chatIndex + 1]
      : null;

  const { data: chatDetails } = api.chat.getChatDetails.useQuery(
    { chatUuid: chatUuid! },
    { enabled: !!chatUuid },
  );

  const breadcrumbs = BreadCrumbGenerator(
    pathname,
    chatDetails?.title ?? undefined,
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <Fragment key={crumb.href}>
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link href={crumb.href} />}>
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
