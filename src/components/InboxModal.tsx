import {useEffect, useState, type FormEvent} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Check, Copy, Inbox, Loader2, Lock, Mail, Trash2, X} from 'lucide-react';

interface InquiryItem {
  id: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface InboxModalProps {
  open: boolean;
  onClose: () => void;
}

export function InboxModal({open, onClose}: InboxModalProps) {
  const [token, setToken] = useState<string | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    fetch('/api/inquiries/auth-status')
      .then((res) => res.json())
      .then((data: {configured?: boolean}) => {
        if (active) setConfigured(Boolean(data.configured));
      })
      .catch(() => {
        if (active) setConfigured(true);
      });
    return () => {
      active = false;
    };
  }, [open]);

  const loadInquiries = async (authToken: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries', {
        headers: {Authorization: `Bearer ${authToken}`},
      });
      if (res.status === 401) {
        setToken(null);
        setAuthError('Session expired. Please sign in again.');
        return;
      }
      const data = (await res.json()) as {ok?: boolean; inquiries?: InquiryItem[]};
      if (res.ok && data.ok && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && token) {
      loadInquiries(token);
    }
  }, [open, token]);

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError('Please enter a passcode.');
      return;
    }

    setAuthError('');
    setLoading(true);
    const endpoint = configured ? '/api/inquiries/login' : '/api/inquiries/claim';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({passcode: passcode.trim()}),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        token?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.token) {
        setAuthError(data.error || 'Authentication failed.');
        return;
      }
      setPasscode('');
      setConfigured(true);
      setToken(data.token);
    } catch {
      setAuthError('Unable to verify passcode right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (item: InquiryItem) => {
    if (!token) return;
    const nextRead = !item.read;
    const res = await fetch(`/api/inquiries/${encodeURIComponent(item.id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({read: nextRead}),
    });
    if (res.ok) {
      setInquiries((prev) => prev.map((entry) => (entry.id === item.id ? {...entry, read: nextRead} : entry)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    const res = await fetch(`/api/inquiries/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {Authorization: `Bearer ${token}`},
    });
    if (res.ok) {
      setInquiries((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  const handleCopyEmail = (id: string, email: string) => {
    navigator.clipboard?.writeText(email).catch(() => {});
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="inbox-modal-backdrop"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.2}}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="inbox-modal-title"
        >
          <motion.div
            initial={{opacity: 0, scale: 0.97, y: 12}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.97, y: 12}}
            transition={{duration: 0.22, ease: [0.16, 1, 0.3, 1]}}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[#0B0B11] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-violet-400/40 bg-violet-500/15 text-violet-300">
                  <Inbox className="h-4 w-4" />
                </div>
                <div>
                  <h3 id="inbox-modal-title" className="font-display text-lg font-bold text-white">
                    SEGNI EDITOR Client Inbox
                  </h3>
                  <p className="text-xs text-zinc-400">Messages submitted through your portfolio contact form</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Client Inbox"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-zinc-900 text-zinc-200 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[75vh] overflow-y-auto p-6">
              {!token ? (
                <form onSubmit={handleAuthSubmit} className="mx-auto max-w-sm space-y-4 py-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Lock className="h-4 w-4 text-sky-400" />
                    <span>
                      {configured === false
                        ? 'Create Your Inbox Passcode (First-Time Setup)'
                        : 'Unlock Client Inbox'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-400">
                    {configured === false
                      ? 'Set a private passcode (at least 6 characters) so only you can view visitor comments and emails.'
                      : 'Enter your inbox passcode to view messages sent by visitors.'}
                  </p>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder={configured === false ? 'Create passcode (6+ characters)' : 'Enter passcode'}
                    className="w-full rounded-lg border border-white/15 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
                  />
                  {authError && (
                    <p role="alert" className="text-xs font-medium text-rose-400">
                      {authError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading || configured === null}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-violet-500 hover:to-blue-500 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {configured === false ? 'Save Passcode & Open Inbox' : 'Open Inbox'}
                  </button>
                </form>
              ) : loading && inquiries.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-zinc-400">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Loading messages...
                </div>
              ) : inquiries.length === 0 ? (
                <div className="py-12 text-center">
                  <Mail className="mx-auto h-8 w-8 text-zinc-600" />
                  <p className="mt-3 text-sm text-zinc-300">No messages yet.</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Visitor comments submitted from your Contact section will appear right here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-mono tabular-nums">
                      {inquiries.length} {inquiries.length === 1 ? 'message' : 'messages'}
                    </span>
                    <button
                      type="button"
                      onClick={() => loadInquiries(token)}
                      className="text-sky-400 hover:text-sky-300 cursor-pointer"
                    >
                      Refresh
                    </button>
                  </div>

                  {inquiries.map((item) => (
                    <article
                      key={item.id}
                      className={`rounded-xl border p-5 transition-colors ${
                        item.read
                          ? 'border-white/10 bg-zinc-950/60'
                          : 'border-violet-400/45 bg-violet-950/15'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-display text-base font-bold text-white">{item.name}</h4>
                            <span className="text-xs text-sky-400">{item.projectType}</span>
                            {!item.read && (
                              <span className="text-xs font-semibold text-violet-300">· Unread</span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-zinc-400">
                            {item.email} <span aria-hidden="true">·</span>{' '}
                            <span className="font-mono tabular-nums">
                              {new Date(item.createdAt).toLocaleString()}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyEmail(item.id, item.email)}
                            aria-label={`Copy ${item.email}`}
                            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 bg-zinc-900 px-2.5 text-xs text-zinc-300 hover:text-white cursor-pointer"
                          >
                            {copiedId === item.id ? (
                              <Check className="h-3.5 w-3.5 text-sky-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            {copiedId === item.id ? 'Copied' : 'Copy Email'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleRead(item)}
                            className="inline-flex h-8 items-center rounded-md border border-white/10 bg-zinc-900 px-2.5 text-xs text-zinc-300 hover:text-white cursor-pointer"
                          >
                            {item.read ? 'Mark Unread' : 'Mark Read'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            aria-label={`Delete message from ${item.name}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-zinc-900 text-zinc-400 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
                        {item.message}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
