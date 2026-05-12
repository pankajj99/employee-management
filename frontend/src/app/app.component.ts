import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatIconModule],
  template: `
    <div class="app-shell">
      <!-- ── Sidebar ──────────────────────────────────────────────── -->
      <aside class="sidebar">
        <div class="logo-area">
          <div class="logo-icon">👥</div>
          <div class="logo-text">
            <span class="logo-brand">EmpTrack</span>
            <span class="logo-sub">Management System</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/employees" routerLinkActive="active" class="nav-item" id="nav-employees">
            <mat-icon>people</mat-icon>
            <span>Employees</span>
          </a>
          <a routerLink="/employees/add" routerLinkActive="active" class="nav-item" id="nav-add">
            <mat-icon>person_add</mat-icon>
            <span>Add Employee</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="version-badge">Angular 19 + MySQL</div>
        </div>
      </aside>

      <!-- ── Main Content ─────────────────────────────────────────── -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      min-height: 100vh;
      background: var(--bg);
    }

    /* ── Sidebar ── */
    .sidebar {
      width: 240px;
      background: var(--surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
      position: sticky;
      top: 0;
      height: 100vh;
      flex-shrink: 0;
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.5rem 1.5rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.5rem;
    }

    .logo-icon { font-size: 2rem; }

    .logo-text { display: flex; flex-direction: column; }
    .logo-brand {
      font-size: 1.1rem;
      font-weight: 800;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.2;
    }
    .logo-sub { font-size: 0.7rem; color: var(--text-secondary); }

    /* ── Nav ── */
    .sidebar-nav { display: flex; flex-direction: column; gap: 0.4rem; }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 1rem;
      border-radius: 10px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    .nav-item mat-icon { font-size: 1.2rem; width: 1.2rem; height: 1.2rem; }
    .nav-item:hover { background: rgba(99,102,241,0.1); color: #e2e8f0; }
    .nav-item.active { background: rgba(99,102,241,0.15); color: #a5b4fc; font-weight: 600; }

    /* ── Footer ── */
    .sidebar-footer { margin-top: auto; padding-top: 1rem; }
    .version-badge {
      font-size: 0.7rem;
      color: var(--text-secondary);
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 0.4rem 0.75rem;
      text-align: center;
    }

    /* ── Main ── */
    .main-content {
      flex: 1;
      overflow-y: auto;
      min-height: 100vh;
    }

    @media (max-width: 768px) {
      .sidebar { display: none; }
    }
  `],
})
export class AppComponent {}
