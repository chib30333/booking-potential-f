import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { KeyRound, LogOut, User as UserIcon, Heart, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/shared/PageHeader";
import { changePassword, getMe, updateMe } from "@/shared/api/auth";
import {
  getCustomerProfile,
  getProviderProfile,
  updateCustomerProfile,
  updateProviderProfile,
} from "@/shared/api/profiles";
import { getReferenceData } from "@/shared/api/reference-data";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";

const Settings = () => {
  const queryClient = useQueryClient();
  const { logoutMutation } = useAuthSession();

  const meQuery = useQuery({ queryKey: ["auth-me"], queryFn: getMe });
  const referenceData = useQuery({
    queryKey: ["reference-data"],
    queryFn: getReferenceData,
  });

  const isCustomer = meQuery.data?.role === "CUSTOMER";
  const isProvider = meQuery.data?.role === "PROVIDER";

  const customerProfileQuery = useQuery({
    queryKey: ["customer-profile"],
    queryFn: getCustomerProfile,
    enabled: isCustomer,
  });

  const providerProfileQuery = useQuery({
    queryKey: ["provider-profile"],
    queryFn: getProviderProfile,
    enabled: isProvider,
  });

  // ---- account form (firstName / lastName / phone / avatar) ----
  const [accountForm, setAccountForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (meQuery.data) {
      setAccountForm({
        firstName: meQuery.data.firstName ?? "",
        lastName: meQuery.data.lastName ?? "",
        phone: "",
        avatarUrl: meQuery.data.avatarUrl ?? "",
      });
    }
  }, [meQuery.data]);

  const saveAccount = useMutation({
    mutationFn: () =>
      updateMe({
        firstName: accountForm.firstName.trim() || null,
        lastName: accountForm.lastName.trim() || null,
        phone: accountForm.phone.trim() || null,
        avatarUrl: accountForm.avatarUrl.trim() || null,
      }),
    onSuccess: () => {
      toast.success("Профиль обновлён");
      void queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Ошибка"),
  });

  // ---- password form ----
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const changePwd = useMutation({
    mutationFn: () => changePassword(pwd),
    onSuccess: () => {
      toast.success("Пароль обновлён. Войдите заново со старого устройства.");
      setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Не удалось обновить пароль"),
  });

  // ---- customer preferences ----
  const [customerForm, setCustomerForm] = useState({
    age: "" as number | "",
    cityId: "",
    moodNotes: "",
    preferredRadiusKm: "" as number | "",
  });

  useEffect(() => {
    const c = customerProfileQuery.data;
    if (c) {
      setCustomerForm({
        age: c.age ?? "",
        cityId: c.city?.id ?? "",
        moodNotes: c.moodNotes ?? "",
        preferredRadiusKm: c.preferredRadiusKm ?? "",
      });
    }
  }, [customerProfileQuery.data]);

  const saveCustomerPrefs = useMutation({
    mutationFn: () =>
      updateCustomerProfile({
        age: customerForm.age === "" ? undefined : Number(customerForm.age),
        cityId: customerForm.cityId || undefined,
        moodNotes: customerForm.moodNotes || undefined,
        preferredRadiusKm:
          customerForm.preferredRadiusKm === ""
            ? undefined
            : Number(customerForm.preferredRadiusKm),
      }),
    onSuccess: () => {
      toast.success("Предпочтения сохранены");
      void queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Ошибка"),
  });

  // ---- provider preferences ----
  const [providerForm, setProviderForm] = useState({
    brandName: "",
    bio: "",
    cityId: "",
    addressLine: "",
    websiteUrl: "",
    instagramUrl: "",
  });

  useEffect(() => {
    const p = providerProfileQuery.data;
    if (p) {
      setProviderForm({
        brandName: p.brandName ?? "",
        bio: p.bio ?? "",
        cityId: p.city?.id ?? "",
        addressLine: p.addressLine ?? "",
        websiteUrl: p.websiteUrl ?? "",
        instagramUrl: p.instagramUrl ?? "",
      });
    }
  }, [providerProfileQuery.data]);

  const saveProviderPrefs = useMutation({
    mutationFn: () =>
      updateProviderProfile({
        brandName: providerForm.brandName || undefined,
        bio: providerForm.bio || undefined,
        cityId: providerForm.cityId || undefined,
        addressLine: providerForm.addressLine || undefined,
        websiteUrl: providerForm.websiteUrl || undefined,
        instagramUrl: providerForm.instagramUrl || undefined,
      }),
    onSuccess: () => {
      toast.success("Профиль провайдера обновлён");
      void queryClient.invalidateQueries({ queryKey: ["provider-profile"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Ошибка"),
  });

  const cities = referenceData.data?.cities ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-12 max-w-3xl">
        <PageHeader
          className="mb-8"
          title={<>Настройки</>}
          description="Управляйте профилем, безопасностью и предпочтениями"
        />

        {/* Account */}
        <section className="glass-card p-6 mb-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-primary" /> Аккаунт
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm">
              Имя
              <input
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                value={accountForm.firstName}
                onChange={(e) => setAccountForm({ ...accountForm, firstName: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Фамилия
              <input
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                value={accountForm.lastName}
                onChange={(e) => setAccountForm({ ...accountForm, lastName: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Email
              <input
                disabled
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-muted-foreground"
                value={meQuery.data?.email ?? ""}
              />
            </label>
            <label className="text-sm">
              Телефон
              <input
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                placeholder="+7..."
                value={accountForm.phone}
                onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
              />
            </label>
            <label className="text-sm md:col-span-2">
              Аватар (URL)
              <input
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                placeholder="https://..."
                value={accountForm.avatarUrl}
                onChange={(e) => setAccountForm({ ...accountForm, avatarUrl: e.target.value })}
              />
            </label>
          </div>
          <button
            onClick={() => saveAccount.mutate()}
            disabled={saveAccount.isPending}
            className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {saveAccount.isPending ? "Сохранение..." : "Сохранить"}
          </button>
        </section>

        {/* Password */}
        <section className="glass-card p-6 mb-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" /> Пароль
          </h2>
          {meQuery.data?.authProvider === "GOOGLE" ? (
            <p className="text-sm text-muted-foreground">
              Аккаунт привязан к Google. Сменить пароль можно только через восстановление.
            </p>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                <label className="text-sm">
                  Текущий пароль
                  <input
                    type="password"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={pwd.currentPassword}
                    onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                  />
                </label>
                <label className="text-sm">
                  Новый пароль
                  <input
                    type="password"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={pwd.newPassword}
                    onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                  />
                </label>
                <label className="text-sm">
                  Подтверждение
                  <input
                    type="password"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={pwd.confirmPassword}
                    onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })}
                  />
                </label>
              </div>
              <button
                onClick={() => {
                  if (pwd.newPassword.length < 8) {
                    toast.error("Минимум 8 символов");
                    return;
                  }
                  if (pwd.newPassword !== pwd.confirmPassword) {
                    toast.error("Пароли не совпадают");
                    return;
                  }
                  changePwd.mutate();
                }}
                disabled={changePwd.isPending}
                className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {changePwd.isPending ? "Обновление..." : "Сменить пароль"}
              </button>
            </>
          )}
        </section>

        {/* Customer preferences */}
        {isCustomer ? (
          <section className="glass-card p-6 mb-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" /> Предпочтения
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm">
                Возраст
                <input
                  type="number"
                  min={13}
                  max={120}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={customerForm.age}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      age: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                />
              </label>
              <label className="text-sm">
                Город
                <select
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={customerForm.cityId}
                  onChange={(e) => setCustomerForm({ ...customerForm, cityId: e.target.value })}
                >
                  <option value="">—</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                Радиус, км
                <input
                  type="number"
                  min={1}
                  max={100}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={customerForm.preferredRadiusKm}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      preferredRadiusKm: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                />
              </label>
              <label className="text-sm md:col-span-2">
                Заметки о настроении
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={customerForm.moodNotes}
                  onChange={(e) => setCustomerForm({ ...customerForm, moodNotes: e.target.value })}
                />
              </label>
            </div>
            <button
              onClick={() => saveCustomerPrefs.mutate()}
              disabled={saveCustomerPrefs.isPending}
              className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saveCustomerPrefs.isPending ? "Сохранение..." : "Сохранить предпочтения"}
            </button>
          </section>
        ) : null}

        {/* Provider preferences */}
        {isProvider ? (
          <section className="glass-card p-6 mb-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Профиль провайдера
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm">
                Название бренда
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={providerForm.brandName}
                  onChange={(e) => setProviderForm({ ...providerForm, brandName: e.target.value })}
                />
              </label>
              <label className="text-sm">
                Город
                <select
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={providerForm.cityId}
                  onChange={(e) => setProviderForm({ ...providerForm, cityId: e.target.value })}
                >
                  <option value="">—</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm md:col-span-2">
                Адрес
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={providerForm.addressLine}
                  onChange={(e) =>
                    setProviderForm({ ...providerForm, addressLine: e.target.value })
                  }
                />
              </label>
              <label className="text-sm">
                Сайт
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="https://..."
                  value={providerForm.websiteUrl}
                  onChange={(e) =>
                    setProviderForm({ ...providerForm, websiteUrl: e.target.value })
                  }
                />
              </label>
              <label className="text-sm">
                Instagram
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="https://..."
                  value={providerForm.instagramUrl}
                  onChange={(e) =>
                    setProviderForm({ ...providerForm, instagramUrl: e.target.value })
                  }
                />
              </label>
              <label className="text-sm md:col-span-2">
                О бренде
                <textarea
                  rows={4}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={providerForm.bio}
                  onChange={(e) => setProviderForm({ ...providerForm, bio: e.target.value })}
                />
              </label>
            </div>
            <button
              onClick={() => saveProviderPrefs.mutate()}
              disabled={saveProviderPrefs.isPending}
              className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saveProviderPrefs.isPending ? "Сохранение..." : "Сохранить"}
            </button>
          </section>
        ) : null}

        {/* Danger zone */}
        <section className="glass-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Сессия</h2>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
          >
            <LogOut className="w-4 h-4" /> Выйти из аккаунта
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
