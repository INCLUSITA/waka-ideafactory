import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type AuthMode = "login" | "signup" | "forgot";

export default function AuthPage() {
  const { isAuthenticated, loading, signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "forgot") {
        const { error } = await resetPassword(email);
        if (error) throw error;
        toast.success("Revisa tu email para restablecer tu contraseña.");
        setMode("login");
      } else if (mode === "signup") {
        const { error } = await signUp(email, password, displayName);
        if (error) throw error;
        toast.success("Cuenta creada. Revisa tu email para confirmar.");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex w-[480px] bg-sidebar flex-col justify-between p-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="font-display text-sm font-bold text-sidebar-primary-foreground">
              W
            </span>
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-sidebar-accent-foreground">
            WAKA
          </span>
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-sidebar-accent-foreground leading-tight">
            Ideas Factory
          </h1>
          <p className="mt-3 text-sm text-sidebar-foreground leading-relaxed max-w-xs">
            La plataforma interna con la que WAKA evoluciona WAKA. Capacidades,
            aplicaciones, activos y gobernanza.
          </p>
        </div>
        <p className="text-[10px] text-sidebar-foreground/40 font-body tracking-wider uppercase">
          Internal Capability Platform
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-xl font-bold text-foreground mb-1">
            {mode === "login" && "Iniciar sesión"}
            {mode === "signup" && "Crear cuenta"}
            {mode === "forgot" && "Restablecer contraseña"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "login" && "Accede a tu espacio de trabajo WAKA."}
            {mode === "signup" && "Únete a la plataforma operativa de WAKA."}
            {mode === "forgot" && "Te enviaremos un enlace para restablecer."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Nombre</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@waka.com"
                required
              />
            </div>

            {mode !== "forgot" && (
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting
                ? "Procesando..."
                : mode === "login"
                ? "Entrar"
                : mode === "signup"
                ? "Crear cuenta"
                : "Enviar enlace"}
            </Button>
          </form>

          <div className="mt-5 text-center space-y-1">
            {mode === "login" && (
              <>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    ¿No tienes cuenta? Crear una
                  </button>
                </div>
              </>
            )}
            {(mode === "signup" || mode === "forgot") && (
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Volver a iniciar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
