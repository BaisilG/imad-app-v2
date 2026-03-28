import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugify from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(value: string) {
  return slugify(value, { lower: true, strict: true, trim: true });
}

export function excerptFromText(text: string, max = 150) {
  return text.length > max ? `${text.slice(0, max).trimEnd()}...` : text;
}
