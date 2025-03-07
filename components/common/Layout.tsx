import { PropsWithChildren } from "react";
import Header from "./Header";
import { cn } from "@/lib/utils";

interface LayoutProps extends PropsWithChildren {
  withFooter?: boolean;
  className?: string;
}

export default function Layout({
  children,
  withFooter,
  className,
}: LayoutProps) {
  return (
    <>
      <Header />
      <div className={cn("p-4", className)}>{children}</div>
      {withFooter && <footer>Footer</footer>}
    </>
  );
}
