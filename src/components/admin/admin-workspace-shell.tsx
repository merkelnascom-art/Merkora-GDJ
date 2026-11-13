"use client";

import { useState, type ReactNode } from "react";
import { ADMIN_NAV_ITEMS, type AdminSectionId } from "@/lib/admin-navigation";

type Props = { email: string; children: ReactNode };

export function AdminWorkspaceShell({ email, children }: Props) {
  const [activeSection, setActiveSection] = useState<AdminSectionId>("dashboard");

  return (
    <main className="mk-admin-shell">
      <aside className="mk-admin-sidebar">
        <a href="#dashboard" className="mk-admin-brand" onClick={() => setActiveSection("dashboard")}>
          <span className="mk-admin-brand-mark">M</span>
          <span>MerKora <b>GDJ</b><small>ESPACE ADMINISTRATEUR</small></span>
        </a>
        <div className="mk-admin-nav-caption">PILOTAGE DE LA PLATEFORME</div>
        <nav className="mk-admin-nav" aria-label="Navigation administrateur">
          {ADMIN_NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? "is-active" : ""}
              aria-current={activeSection === item.id ? "page" : undefined}
              onClick={() => setActiveSection(item.id)}
            >
              <span aria-hidden="true">{item.icon}</span>{item.label}
            </a>
          ))}
        </nav>
        <div className="mk-admin-sidebar-footer">
          <span className="mk-admin-security-mark">⌑</span>
          <strong>Contrôle humain conservé</strong>
          <p>Les actions sensibles restent soumises à vérification et autorisation.</p>
          <span><i /> Aperçu sécurisé</span>
        </div>
      </aside>

      <section className="mk-admin-main">
        <header className="mk-admin-topbar">
          <div><span>MERKORA GDJ <b>/</b> ADMINISTRATION</span><p>Bienvenue dans votre espace de pilotage.</p></div>
          <div className="mk-admin-account"><span className="mk-admin-online"><i /> Session vérifiée</span><strong>{email}</strong><a href="/">Retour à l’espace client ↗</a></div>
        </header>
        <div className="mk-admin-content">{children}</div>
      </section>
    </main>
  );
}
