import type { Responsive, SizeVariant } from './types';

const CASCADE: SizeVariant[] = ['xs', 'sm', 'md', 'lg'];

/**
 * Resolves a Responsive<T> value at a given breakpoint using mobile-first cascade.
 * If value is plain T, returns it at all breakpoints.
 * If value is { default, sm?, md?, lg? }, cascades: default → sm → md → lg.
 */
export function resolveResponsive<T>(value: Responsive<T>, breakpoint: SizeVariant): T {
  if (typeof value !== 'object' || value === null || !('default' in value)) {
    return value as T;
  }

  const responsive = value as { default: T; sm?: T; md?: T; lg?: T };
  const idx = CASCADE.indexOf(breakpoint);

  let result = responsive.default;
  if (idx >= 1 && responsive.sm !== undefined) result = responsive.sm;
  if (idx >= 2 && responsive.md !== undefined) result = responsive.md;
  if (idx >= 3 && responsive.lg !== undefined) result = responsive.lg;

  return result;
}
