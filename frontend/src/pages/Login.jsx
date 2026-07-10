import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { formatApiError } from "@/lib/api";
import Logo from "@/components/Logo";
import { ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || "/admin";

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      nav(from, { replace: true });
    } catch (e) {
      setErr(formatApiError(e, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      data-testid="login-page"
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <div className="w-full max-w-[420px]">
        <Link to="/" className="inline-flex items-center gap-2 mb-12">
          <Logo className="h-9 w-auto" />
        </Link>
        <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-5">
          Admin · CMS
        </div>
        <h1
          className="font-display font-extrabold leading-[0.95] tracking-[-0.03em] mb-3"
          style={{ fontSize: "clamp(2.2rem, 4vw, 3rem)" }}
        >
          Sign in.
        </h1>
        <p className="text-[15px] text-ink-2 leading-[1.6] mb-12">
          Faculty-only access. Use your IIITD email to publish, edit and
          manage blog posts.
        </p>

        <form onSubmit={submit} className="space-y-2" data-testid="login-form">
          <input
            data-testid="login-email"
            type="email"
            className="field"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            data-testid="login-password"
            type="password"
            className="field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {err && (
            <div
              data-testid="login-error"
              className="text-[13px] mt-4 px-4 py-3 rounded-lg"
              style={{
                background: "color-mix(in srgb, #ec1e79 12%, transparent)",
                color: "#ec1e79",
              }}
            >
              {err}
            </div>
          )}
          <div className="pt-8 flex items-center gap-6">
            <button
              type="submit"
              data-testid="login-submit"
              disabled={loading}
              className="inline-flex items-center gap-3 rounded-full pl-7 pr-3 py-3 text-[14px] font-medium disabled:opacity-60"
              style={{ background: "var(--ink)", color: "var(--bg)" }}
            >
              {loading ? "Signing in…" : "Sign in"}
              <span
                className="inline-flex w-8 h-8 rounded-full items-center justify-center"
                style={{ background: "color-mix(in srgb, var(--bg) 15%, transparent)" }}
              >
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
            <Link to="/" className="link-underline text-[13px] text-ink-2">
              Back to site
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
