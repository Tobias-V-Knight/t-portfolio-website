import { useEffect, useRef, useState } from 'react'

export interface MenuAction {
  label: string
  onSelect?: () => void
  shortcut?: string
  separatorBefore?: boolean
}

export interface Menu {
  title: string
  items: MenuAction[]
}

// Handoff section 4: a recruiter has to reach the work in about fifteen
// seconds. The Go menu is that path and it is deliberately not an Easter egg.
// The disabled items in the other menus are period texture: a real Mac menu
// was mostly greyed out most of the time.

export function MenuBar({ menus, clock }: { menus: Menu[]; clock: string }) {
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
        <div className="mac-menu" key={menu.title} data-open={open === menu.title}>
          <button
            className="mac-menu-title"
            aria-haspopup="true"
            aria-expanded={open === menu.title}
            onClick={() => setOpen(open === menu.title ? null : menu.title)}
            onMouseEnter={() => open && setOpen(menu.title)}
          >
            {menu.title}
          </button>

          {open === menu.title && (
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
        <span className="mac-menubar-optional">SYSTEM ONLINE</span>
        <span className="mac-menubar-optional">MINNEAPOLIS, MN</span>
        <span>{clock}</span>
      </div>
    </nav>
  )
}
