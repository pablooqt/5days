import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatFloorName(floorIndex: number): string {
  return floorIndex === 0 ? "Ground Floor / Lobby" : `Floor ${floorIndex}`;
}
