'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, Mail, Lock, Shield, Check } from 'lucide-react';
import authService from '@/lib/auth-service';

const loginSchema = z.object({
  email: z.string().email('Correo invalido'),
  password: z.string().min(1, 'La contrasena es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    let isActive = true;

    const checkSession = async () => {
      try {
        const session = await authService.getActiveSession();
        if (session) {
          authService.redirectToApp(session);
          return;
        }
      } catch (error) {
        console.warn('Session check failed', error);
      } finally {
        if (isActive) {
          setIsCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      isActive = false;
    };
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('root', { message: '' });

    try {
      const loginData = await authService.unifiedLogin(data.email, data.password);
      authService.redirectToApp(loginData);
    } catch (error: unknown) {
      const err = error as Error;
      setError('root', { message: err.message || 'Error al iniciar sesion' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030303] text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/bg2.png"
          alt="Fondo Zass Pass"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-[#030405]" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        {isCheckingSession && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 text-white">
            <span className="mb-2 text-xs uppercase tracking-[0.4em] text-white/70">
              Verificando sesion
            </span>
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
          </div>
        )}

        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-xs uppercase tracking-[0.6em] text-white/80">
              ZASS PASS
            </span>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm">
              <Shield className="h-7 w-7 text-white" />
            </div>
          </div>

          <div className="rounded-[32px] border border-white/5 bg-[#0f0f12]/90 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl">
            <div className="mb-8 text-center">
              <p className="text-sm uppercase tracking-[0.5em] text-white">
                Iniciar sesion
              </p>
              <p className="mt-2 text-xs text-white/60">
                Portal unificado para usuarios y partners
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white/80">
                    Correo electronico
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      {...register('email')}
                      type="email"
                      autoComplete="email"
                      placeholder="Ingresa tu correo"
                      className="h-12 w-full rounded-full border border-white/10 bg-white text-sm text-slate-900 placeholder:text-slate-400 pl-12 pr-4 shadow-inner focus:border-[#44C2BE] focus:outline-none focus:ring-2 focus:ring-[#44C2BE]/30"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-[#f87171]">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white/80">
                    Contrasena
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="********"
                      className="h-12 w-full rounded-full border border-white/10 bg-white text-sm text-slate-900 placeholder:text-slate-400 pl-12 pr-12 shadow-inner focus:border-[#44C2BE] focus:outline-none focus:ring-2 focus:ring-[#44C2BE]/30"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-4 flex items-center text-slate-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-[#f87171]">{errors.password.message}</p>
                  )}
                </div>
              </div>

              {errors.root?.message && (
                <div className="rounded-2xl border border-[#f87171]/30 bg-[#f87171]/10 px-4 py-3 text-sm text-[#fca5a5]">
                  {errors.root.message}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-white/70">
                <button
                  type="button"
                  onClick={() => setRememberMe((prev) => !prev)}
                  className="flex items-center gap-2 font-medium"
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      rememberMe ? 'border-[#44C2BE] bg-[#44C2BE]' : 'border-white/40'
                    }`}
                  >
                    {rememberMe && <Check className="h-3 w-3 text-black" />}
                  </span>
                  Recordarme
                </button>
                <Link
                  href="/forgot-password"
                  className="font-medium text-white transition-colors hover:text-[#44C2BE]"
                >
                  Olvidaste tu contrasena?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading || isCheckingSession}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#44C2BE] py-3 text-base font-semibold text-slate-900 transition hover:bg-[#3aa5a6] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                    Iniciando sesion...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Iniciar sesion
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-white/70">
              No tienes una cuenta?
              <Link
                href="/register"
                className="ml-2 font-semibold text-[#44C2BE] hover:text-[#36a5a1]"
              >
                Registrate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
