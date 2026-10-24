import { SITE } from '@/config/site';
import { cn } from '@/lib/utils';

/**
 * VERITY brand logo.
 * The brain mark (public/logo-mark.png) is preserved as-is — no CSS inversion.
 * The rounded tile behind it is a themed container driven by CSS variables:
 *   light: --verity-logo-tile-bg (#F3F2ED warm cream)
 *   dark:  --verity-logo-tile-bg (#171717 near black)
 * so the logo never shifts size or causes layout shift across theme switches.
 */
export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  const size = compact ? 'h-7 w-7' : 'h-9 w-9';
  const markSize = compact ? 'h-5 w-5' : 'h-6 w-6';
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden
        className={cn(
          'relative inline-flex items-center justify-center rounded-[8px] border',
          size,
        )}
        style={{
          backgroundColor: 'var(--verity-logo-tile-bg)',
          borderColor: 'var(--verity-logo-tile-border)',
        }}
      >
        <img
          src={`${import.meta.env.MIAODA_CLIENT_BASE_PATH || '/'}logo-mark.png`}
          alt=""
          className={cn('select-none object-contain', markSize)}
          draggable={false}
          style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.18))' }}
        />
      </span>
      <span
        className={cn(
          'font-semibold tracking-[0.18em]',
          compact ? 'text-sm' : 'text-base',
        )}
        style={{ color: 'var(--verity-logo-text)' }}
      >
        {SITE.name}
      </span>
    </span>
  );
}
