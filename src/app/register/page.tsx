'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import authService from '@/lib/auth-service';

type RegisterTab = 'user' | 'partner';

const USER_PHONE_LENGTH = 8;
const PARTNER_PHONE_MIN_LENGTH = 8;
const PARTNER_PHONE_MAX_LENGTH = 11;

const userSchema = z.object({
  firstName: z.string().min(2, 'Ingresa tu nombre').max(100, 'Máximo 100 caracteres'),
  lastName: z.string().min(2, 'Ingresa tus apellidos').max(100, 'Máximo 100 caracteres'),
  email: z.string().email('Correo inválido'),
  phone_number: z
    .string()
    .regex(
      new RegExp(`^\\d{${USER_PHONE_LENGTH}}$`),
      `Teléfono inválido (${USER_PHONE_LENGTH} dígitos)`
    ),
  dui: z.string().min(8, 'DUI inválido').max(20, 'Máximo 20 caracteres'),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(72, 'Máximo 72 caracteres'),
  birthday: z.string().min(1, 'Selecciona tu fecha de nacimiento'),
  terms: z
    .boolean()
    .refine((val) => val, { message: 'Debes aceptar términos y condiciones' }),
});

type UserFormData = z.infer<typeof userSchema>;

const partnerSchema = z.object({
  businessName: z.string().min(2, 'Nombre inválido').max(100, 'Máximo 100 caracteres'),
  contact_name: z.string().min(2, 'Nombre inválido').max(100, 'Máximo 100 caracteres'),
  email: z.string().email('Correo inválido'),
  phone: z
    .string()
    .regex(
      new RegExp(`^\\d{${PARTNER_PHONE_MIN_LENGTH},${PARTNER_PHONE_MAX_LENGTH}}$`),
      `Teléfono inválido (${PARTNER_PHONE_MIN_LENGTH} a ${PARTNER_PHONE_MAX_LENGTH} dígitos)`
    ),
  address: z.string().min(10, 'Dirección demasiado corta').max(200, 'Máximo 200 caracteres'),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(72, 'Máximo 72 caracteres'),
  terms: z
    .boolean()
    .refine((val) => val, { message: 'Debes aceptar términos y condiciones' }),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

const inputClass =
  'w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 transition';

const sanitizeDigits = (value: string, maxLength: number) =>
  value.replace(/\D/g, '').slice(0, maxLength);

const formatPhoneDisplay = (value?: string, maxLength = USER_PHONE_LENGTH) => {
  const digits = (value || '').slice(0, maxLength);
  if (digits.length <= 4) {
    return digits;
  }
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
};

const formatDuiDisplay = (value?: string) => {
  const digits = (value || '').slice(0, 9);
  if (digits.length <= 8) {
    return digits;
  }
  return `${digits.slice(0, 8)}-${digits.slice(8)}`;
};

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<RegisterTab>('user');
  const [submitting, setSubmitting] = useState<RegisterTab | null>(null);
  const [feedback, setFeedback] = useState({
    user: { success: '', error: '' },
    partner: { success: '', error: '' },
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'partner' || tab === 'user') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const {
    register: registerUserField,
    handleSubmit: handleUserSubmit,
    formState: { errors: userErrors },
    reset: resetUserForm,
    control: userControl,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      birthday: '',
      dui: '',
      password: '',
      phone_number: '',
      terms: false,
    },
  });

  const {
    register: registerPartnerField,
    handleSubmit: handlePartnerSubmit,
    formState: { errors: partnerErrors },
    reset: resetPartnerForm,
    control: partnerControl,
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      businessName: '',
      contact_name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      terms: false,
    },
  });

  const onSubmitUser = async (data: UserFormData) => {
    setSubmitting('user');
    setFeedback((prev) => ({ ...prev, user: { success: '', error: '' } }));

    try {
      await authService.registerUser({
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        password: data.password,
        phone_number: data.phone_number,
        birthday: data.birthday,
      });
      setFeedback((prev) => ({
        ...prev,
        user: { success: '¡Registro exitoso! Ya puedes iniciar sesión.', error: '' },
      }));
      resetUserForm();
    } catch (error) {
      setFeedback((prev) => ({
        ...prev,
        user: {
          success: '',
          error:
            error instanceof Error
              ? error.message
              : 'No pudimos completar tu registro. Intenta nuevamente.',
        },
      }));
    } finally {
      setSubmitting(null);
    }
  };

  const onSubmitPartner = async (data: PartnerFormData) => {
    setSubmitting('partner');
    setFeedback((prev) => ({ ...prev, partner: { success: '', error: '' } }));

    try {
      await authService.registerPartner({
        name: data.businessName,
        contact_name: data.contact_name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
      });
      setFeedback((prev) => ({
        ...prev,
        partner: {
          success: '¡Registro enviado! Te notificaremos cuando sea aprobado.',
          error: '',
        },
      }));
      resetPartnerForm();
    } catch (error) {
      setFeedback((prev) => ({
        ...prev,
        partner: {
          success: '',
          error:
            error instanceof Error
              ? error.message
              : 'No pudimos completar tu registro. Intenta nuevamente.',
        },
      }));
    } finally {
      setSubmitting(null);
    }
  };

  const termsLabel = useMemo(
    () => (
      <>
        Aceptar{' '}
        <Link href="/terms" className="text-teal-600 underline-offset-2 hover:underline">
          Términos y condiciones
        </Link>
      </>
    ),
    []
  );

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-4 py-10">
      <div className="mx-auto max-w-md rounded-[32px] bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Link href="/login" className="flex items-center gap-1 text-teal-600 hover:text-teal-700">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <div className="mx-auto text-center">
            <p className="text-xs tracking-[0.35em] text-gray-400">REGISTRARME</p>
            <p className="font-display text-xl text-gray-900">ZassPass</p>
          </div>
        </div>

        <div className="mt-6 rounded-full bg-gray-100 p-1 text-sm font-semibold text-gray-500">
          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={() => setActiveTab('user')}
              className={`rounded-full py-3 transition ${
                activeTab === 'user' ? 'bg-white text-gray-900 shadow' : 'text-gray-500'
              }`}
            >
              Cliente
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('partner')}
              className={`rounded-full py-3 transition ${
                activeTab === 'partner' ? 'bg-white text-gray-900 shadow' : 'text-gray-500'
              }`}
            >
              Socio
            </button>
          </div>
        </div>

        {activeTab === 'user' ? (
          <form
            key="user-form"
            className="mt-8 space-y-4"
            onSubmit={handleUserSubmit(onSubmitUser)}
          >
            {feedback.user.error && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {feedback.user.error}
              </p>
            )}
            {feedback.user.success && (
              <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
                {feedback.user.success}
              </p>
            )}

            <div>
              <label className="text-sm text-gray-600">Nombres</label>
              <div className="mt-1 flex items-center gap-2 rounded-full border border-transparent bg-gray-50 px-4">
                <User className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  className={`${inputClass} border-none bg-transparent px-0`}
                  placeholder="David Alexander"
                  {...registerUserField('firstName')}
                />
              </div>
              {userErrors.firstName && (
                <p className="mt-1 text-xs text-red-600">{userErrors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Apellidos</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Morales Menéndez"
                {...registerUserField('lastName')}
              />
              {userErrors.lastName && (
                <p className="mt-1 text-xs text-red-600">{userErrors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Correo electrónico</label>
              <div className="mt-1 flex items-center gap-2 rounded-full border border-transparent bg-gray-50 px-4">
                <Mail className="h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  className={`${inputClass} border-none bg-transparent px-0`}
                  placeholder="correo@ejemplo.com"
                  {...registerUserField('email')}
                />
              </div>
              {userErrors.email && (
                <p className="mt-1 text-xs text-red-600">{userErrors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Número de teléfono</label>
              <div className="mt-1 flex items-center gap-2 rounded-full border border-transparent bg-gray-50 px-4">
                <Phone className="h-4 w-4 text-gray-400" />
                <Controller
                  control={userControl}
                  name="phone_number"
                  render={({ field }) => (
                    <input
                      type="tel"
                      className={`${inputClass} border-none bg-transparent px-0`}
                      placeholder="61246644"
                      value={formatPhoneDisplay(field.value, USER_PHONE_LENGTH)}
                      onChange={(event) => {
                        const digits = sanitizeDigits(event.target.value, USER_PHONE_LENGTH);
                        field.onChange(digits);
                      }}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  )}
                />
              </div>
              {userErrors.phone_number && (
                <p className="mt-1 text-xs text-red-600">{userErrors.phone_number.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">DUI</label>
              <Controller
                control={userControl}
                name="dui"
                render={({ field }) => (
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="01234567-8"
                    value={formatDuiDisplay(field.value)}
                    onChange={(event) => {
                      const digits = sanitizeDigits(event.target.value, 9);
                      field.onChange(digits);
                    }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
              {userErrors.dui && (
                <p className="mt-1 text-xs text-red-600">{userErrors.dui.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Contraseña</label>
              <div className="mt-1 flex items-center gap-2 rounded-full border border-transparent bg-gray-50 px-4">
                <Lock className="h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  className={`${inputClass} border-none bg-transparent px-0`}
                  placeholder="******"
                  {...registerUserField('password')}
                />
              </div>
              {userErrors.password && (
                <p className="mt-1 text-xs text-red-600">{userErrors.password.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Fecha de nacimiento</label>
              <div className="mt-1 flex items-center gap-2 rounded-full border border-transparent bg-gray-50 px-4">
                <Calendar className="h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  className={`${inputClass} border-none bg-transparent px-0`}
                  {...registerUserField('birthday')}
                />
              </div>
              {userErrors.birthday && (
                <p className="mt-1 text-xs text-red-600">{userErrors.birthday.message}</p>
              )}
            </div>

            <label className="mt-2 flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                {...registerUserField('terms')}
              />
              <span>
                {termsLabel}
                {userErrors.terms && (
                  <p className="text-xs text-red-600">{userErrors.terms.message}</p>
                )}
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting === 'user'}
              className="mt-4 w-full rounded-full bg-teal-600 py-3 text-center text-sm font-semibold text-white shadow-lg transition hover:bg-teal-700 disabled:opacity-60"
            >
              {submitting === 'user' ? 'Registrando...' : 'Registrarme'}
            </button>
          </form>
        ) : (
          <form
            key="partner-form"
            className="mt-8 space-y-4"
            onSubmit={handlePartnerSubmit(onSubmitPartner)}
          >
            {feedback.partner.error && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {feedback.partner.error}
              </p>
            )}
            {feedback.partner.success && (
              <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
                {feedback.partner.success}
              </p>
            )}

            <div>
              <label className="text-sm text-gray-600">Nombre del negocio</label>
              <div className="mt-1 flex items-center gap-2 rounded-full border border-transparent bg-gray-50 px-4">
                <Building2 className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  className={`${inputClass} border-none bg-transparent px-0`}
                  placeholder="Spa Zass"
                  {...registerPartnerField('businessName')}
                />
              </div>
              {partnerErrors.businessName && (
                <p className="mt-1 text-xs text-red-600">{partnerErrors.businessName.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Contacto principal</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Ana López"
                {...registerPartnerField('contact_name')}
              />
              {partnerErrors.contact_name && (
                <p className="mt-1 text-xs text-red-600">{partnerErrors.contact_name.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Correo electrónico</label>
              <div className="mt-1 flex items-center gap-2 rounded-full border border-transparent bg-gray-50 px-4">
                <Mail className="h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  className={`${inputClass} border-none bg-transparent px-0`}
                  placeholder="empresa@ejemplo.com"
                  {...registerPartnerField('email')}
                />
              </div>
              {partnerErrors.email && (
                <p className="mt-1 text-xs text-red-600">{partnerErrors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Número de teléfono</label>
              <div className="mt-1 flex items-center gap-2 rounded-full border border-transparent bg-gray-50 px-4">
                <Phone className="h-4 w-4 text-gray-400" />
                <Controller
                  control={partnerControl}
                  name="phone"
                  render={({ field }) => (
                    <input
                      type="tel"
                      className={`${inputClass} border-none bg-transparent px-0`}
                      placeholder="50371234567"
                      value={formatPhoneDisplay(field.value, PARTNER_PHONE_MAX_LENGTH)}
                      onChange={(event) => {
                        const digits = sanitizeDigits(event.target.value, PARTNER_PHONE_MAX_LENGTH);
                        field.onChange(digits);
                      }}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  )}
                />
              </div>
              {partnerErrors.phone && (
                <p className="mt-1 text-xs text-red-600">{partnerErrors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Dirección</label>
              <div className="mt-1 flex items-center gap-2 rounded-3xl border border-gray-200 bg-gray-50 px-4">
                <MapPin className="h-4 w-4 text-gray-400" />
                <textarea
                  className="w-full resize-none border-none bg-transparent px-0 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                  rows={2}
                  placeholder="Col. Florencia, San Salvador"
                  {...registerPartnerField('address')}
                />
              </div>
              {partnerErrors.address && (
                <p className="mt-1 text-xs text-red-600">{partnerErrors.address.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Contraseña</label>
              <div className="mt-1 flex items-center gap-2 rounded-full border border-transparent bg-gray-50 px-4">
                <Lock className="h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  className={`${inputClass} border-none bg-transparent px-0`}
                  placeholder="*******"
                  {...registerPartnerField('password')}
                />
              </div>
              {partnerErrors.password && (
                <p className="mt-1 text-xs text-red-600">{partnerErrors.password.message}</p>
              )}
            </div>

            <label className="mt-2 flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                {...registerPartnerField('terms')}
              />
              <span>
                {termsLabel}
                {partnerErrors.terms && (
                  <p className="text-xs text-red-600">{partnerErrors.terms.message}</p>
                )}
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting === 'partner'}
              className="mt-4 w-full rounded-full bg-teal-600 py-3 text-center text-sm font-semibold text-white shadow-lg transition hover:bg-teal-700 disabled:opacity-60"
            >
              {submitting === 'partner' ? 'Registrando...' : 'Solicitar registro'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f7f7]" />}>
      <RegisterPageContent />
    </Suspense>
  );
}
