'use client';

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      className="rounded border px-3 py-2 text-sm"
      onClick={async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
      }}
    >
      Logout
    </button>
  );
}
