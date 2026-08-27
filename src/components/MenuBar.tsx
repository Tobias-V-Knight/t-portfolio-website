import { useEffect, useRef, useState } from 'react'
import { AppleLogo } from './Icons'

export interface MenuAction {
  label: string
  onSelect?: () => void
  shortcut?: string
  separatorBefore?: boolean
}

export interface Menu {
  title: string
  // Desktop only. The bar is 390px wide on a phone and it cannot wrap without
  // breaking the illusion, so a menu that is meaningless there says so rather
  // than pushing the navigation off the edge. P2-02.
  desktopOnly?: boolean
  // A menu either drops down a list of items, or is a direct nav action (no
  // items, just onSelect on the title) like Charlie Dean's Portfolio/About/Contact.
  items?: MenuAction[]
  onSelect?: () => void
}

// Handoff section 4: a recruiter has to reach the work in about fifteen
// seconds. The Go menu is that path and it is deliberately not an Easter egg.
// The disabled items in the other menus are period texture: a real Mac menu
// was mostly greyed out most of the time.

export interface Clock {
  date: string
  time: string
}

export function MenuBar({ menus, clock }: { menus: Menu[]; clock: Clock }) {
  const [open, setOpen] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (!barRef.current?.contains(e.target as Node)) setOpen(null)
    }
    // Capture phase, because the window manager also listens for Escape and an
    // open menu has to win. Otherwise one keypress closes the menu and the
    // window underneath it at the same time.
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      setOpen(null)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [open])

  return (
    <nav className="mac-menubar" ref={barRef} aria-label="Main menu">
      {menus.map((menu) => (
        <div
          className="mac-menu"
          key={menu.title}
          data-open={open === menu.title}
          data-desktop-only={menu.desktopOnly ? 'true' : undefined}
        >
          <button
            className="mac-menu-title"
            aria-haspopup={menu.items ? 'true' : undefined}
            aria-expanded={menu.items ? open === menu.title : undefined}
            onClick={() => {
              if (menu.items) {
                setOpen(open === menu.title ? null : menu.title)
              } else {
                setOpen(null)
                menu.onSelect?.()
              }
            }}
            onMouseEnter={() => open && menu.items && setOpen(menu.title)}
          >
            {menu.title === 'APPLE' ? (
              <>
                <AppleLogo className="mac-apple" />
                <span className="mac-visually-hidden">Apple menu</span>
              </>
            ) : (
              menu.title
            )}
          </button>

          {open === menu.title && menu.items && (
            <div className="mac-menu-drop" role="menu">
              {menu.items.map((item, i) => (
                <div key={item.label + i}>
                  {item.separatorBefore && <div className="mac-menu-sep" role="separator" />}
                  <button
                    className="mac-menu-item"
                    role="menuitem"
                    disabled={!item.onSelect}
                    onClick={() => {
                      setOpen(null)
                      item.onSelect?.()
                    }}
                  >
                    <span>{item.label}</span>
                    {item.shortcut && <span aria-hidden>{item.shortcut}</span>}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="mac-menubar-right">
        {/* Two spans, not one string. The bar cannot wrap without breaking the
            illusion, and adding the RESUME title pushed the clock off the right
            edge on a phone. Splitting the date off means the narrow rule can
            drop it and keep the time, which is the half anyone reads.

            The date carries the class because it is the part with spaces in it,
            and a squeezed bar breaks a string at its spaces: WED, AUG 26 came
            apart into three stacked lines on a phone, which is #85. The widths
            that decide what survives are in system.css, next to
            .mac-menubar-right, and they run out at the point the clock goes
            entirely. Nothing here should ever be the last line of defence
            against a wrap, so the CSS refuses to shrink this block at all. */}
        <span className="mac-menubar-optional">{clock.date}</span>
        <span>{clock.time}</span>
      </div>
    </nav>
  )
}
