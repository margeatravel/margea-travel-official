import { type SVGProps } from "react";

/**
 * Custom cart icon based on Lucide ShoppingBag with an upright handle.
 * Body/basket identical to ShoppingBag; handle curves upward instead of downward.
 */
export function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 -8 24 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Bag body */}
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      {/* Top edge line */}
      <path d="M3 6h18" />
      {/* Handle – tall upward arc: 12 units above body top, 14 units wide */}
      <path d="M5 6c0-12 14-12 14 0" />
    </svg>
  );
}
