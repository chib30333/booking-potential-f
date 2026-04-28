import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import {
  createProviderService,
  createProviderSlot,
  listProviderBookingsApi,
  listProviderServices,
  listProviderSlots,
  type CreateServicePayload,
  type CreateSlotPayload,
} from "@/shared/api/provider";
import { getReferenceData } from "@/shared/api/reference-data";

const formatDateTimeLocal = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatPrice = (amountMinor: number, currency: string) => {
  try {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amountMinor / 100);
  } catch {
    return `${amountMinor / 100} ${currency}`;
  }
};

const ServiceForm = ({
  cities,
  categories,
}: {
  cities: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
}) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateServicePayload>({
    title: "",
    description: "",
    categoryId: categories[0]?.id ?? "",
    cityId: cities[0]?.id ?? "",
    emotionTag: "CALM",
    priceAmount: 5000,
    durationMinutes: 60,
    capacityDefault: 8,
    status: "DRAFT",
  });

  const create = useMutation({
    mutationFn: createProviderService,
    onSuccess: () => {
      toast.success("Услуга создана");
      void queryClient.invalidateQueries({ queryKey: ["provider-services"] });
      setForm((f) => ({ ...f, title: "", description: "" }));
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Не удалось создать услугу"),
  });

  return (
    <form
      className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.title || !form.cityId || !form.categoryId) {
          toast.error("Заполните название, город и категорию");
          return;
        }
        create.mutate({ ...form, priceAmount: Number(form.priceAmount) * 100 });
      }}
    >
      <h3 className="text-lg font-semibold">Создать услугу</h3>

      <input
        className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
        placeholder="Название (например, Йога в саду)"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
        placeholder="Описание"
        rows={3}
        value={form.description ?? ""}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <div className="grid gap-3 md:grid-cols-2">
        <select
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          value={form.cityId}
          onChange={(e) => setForm({ ...form, cityId: e.target.value })}
        >
          <option value="">Город</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        >
          <option value="">Категория</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          value={form.emotionTag}
          onChange={(e) => setForm({ ...form, emotionTag: e.target.value })}
        >
          {[
            "CALM",
            "JOY",
            "ENERGY",
            "RECOVERY",
            "FOCUS",
            "BALANCE",
            "CONFIDENCE",
            "RELAX",
            "SOCIAL",
            "MINDFULNESS",
          ].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          placeholder="Цена, ₽"
          value={form.priceAmount}
          onChange={(e) =>
            setForm({ ...form, priceAmount: Number(e.target.value) || 0 })
          }
        />
        <input
          type="number"
          min={15}
          step={15}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          placeholder="Длительность, мин"
          value={form.durationMinutes}
          onChange={(e) =>
            setForm({ ...form, durationMinutes: Number(e.target.value) || 60 })
          }
        />
        <input
          type="number"
          min={1}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          placeholder="Кол-во мест"
          value={form.capacityDefault}
          onChange={(e) =>
            setForm({ ...form, capacityDefault: Number(e.target.value) || 1 })
          }
        />
      </div>

      <button
        type="submit"
        disabled={create.isPending}
        className="w-full rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {create.isPending ? "Создание..." : "Создать услугу"}
      </button>
    </form>
  );
};

const SlotForm = ({
  services,
}: {
  services: Array<{ id: string; title: string; capacityDefault: number; priceAmount: number }>;
}) => {
  const queryClient = useQueryClient();
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d;
  }, []);
  const [form, setForm] = useState<CreateSlotPayload>({
    serviceId: services[0]?.id ?? "",
    startsAt: tomorrow.toISOString(),
    endsAt: new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString(),
    capacity: services[0]?.capacityDefault ?? 8,
    priceAmount: services[0]?.priceAmount ?? 5000,
  });

  const create = useMutation({
    mutationFn: createProviderSlot,
    onSuccess: () => {
      toast.success("Слот создан");
      void queryClient.invalidateQueries({ queryKey: ["provider-slots"] });
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Не удалось создать слот"),
  });

  if (services.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-5 text-sm text-muted-foreground">
        Сначала создайте услугу, чтобы добавить слот.
      </div>
    );
  }

  return (
    <form
      className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        create.mutate(form);
      }}
    >
      <h3 className="text-lg font-semibold">Добавить слот</h3>

      <select
        className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
        value={form.serviceId}
        onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
      >
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.title}
          </option>
        ))}
      </select>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          Начало
          <input
            type="datetime-local"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
            value={formatDateTimeLocal(new Date(form.startsAt))}
            onChange={(e) =>
              setForm({
                ...form,
                startsAt: new Date(e.target.value).toISOString(),
              })
            }
          />
        </label>
        <label className="text-sm">
          Конец
          <input
            type="datetime-local"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
            value={formatDateTimeLocal(new Date(form.endsAt))}
            onChange={(e) =>
              setForm({
                ...form,
                endsAt: new Date(e.target.value).toISOString(),
              })
            }
          />
        </label>
        <input
          type="number"
          min={1}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          placeholder="Мест"
          value={form.capacity}
          onChange={(e) =>
            setForm({ ...form, capacity: Number(e.target.value) || 1 })
          }
        />
        <input
          type="number"
          min={1}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          placeholder="Цена, копеек"
          value={form.priceAmount}
          onChange={(e) =>
            setForm({ ...form, priceAmount: Number(e.target.value) || 1 })
          }
        />
      </div>

      <button
        type="submit"
        disabled={create.isPending}
        className="w-full rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {create.isPending ? "Создание..." : "Добавить слот"}
      </button>
    </form>
  );
};

const ProviderDashboard = () => {
  const referenceData = useQuery({
    queryKey: ["reference-data"],
    queryFn: getReferenceData,
  });

  const servicesQuery = useQuery({
    queryKey: ["provider-services"],
    queryFn: listProviderServices,
  });

  const slotsQuery = useQuery({
    queryKey: ["provider-slots"],
    queryFn: listProviderSlots,
  });

  const bookingsQuery = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: listProviderBookingsApi,
  });

  const services = servicesQuery.data?.items ?? [];
  const slots = slotsQuery.data ?? [];
  const bookings = bookingsQuery.data?.bookings ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.18em] text-violet-500">
            Provider workspace
          </p>
          <h1 className="text-3xl font-bold">Управление вашими услугами</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ServiceForm
            cities={referenceData.data?.cities ?? []}
            categories={referenceData.data?.categories ?? []}
          />
          <SlotForm services={services} />
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Услуги</h2>
          {servicesQuery.isLoading ? (
            <p className="text-muted-foreground">Загрузка...</p>
          ) : services.length === 0 ? (
            <p className="text-muted-foreground">Услуги ещё не созданы.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div key={s.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-violet-500">
                    {s.status} · {s.emotionTag}
                  </p>
                  <h3 className="mt-1 text-base font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {s.category.name} · {s.city.name}
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {formatPrice(s.priceAmount, s.currency)} · {s.durationMinutes} мин
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Ближайшие слоты</h2>
          {slotsQuery.isLoading ? (
            <p className="text-muted-foreground">Загрузка...</p>
          ) : slots.length === 0 ? (
            <p className="text-muted-foreground">Слоты ещё не добавлены.</p>
          ) : (
            <div className="space-y-2">
              {slots.slice(0, 12).map((s) => (
                <div
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold">{s.serviceTitle}</p>
                    <p className="text-muted-foreground">
                      {new Date(s.startsAt).toLocaleString("ru-RU")} — {new Date(s.endsAt).toLocaleString("ru-RU")}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{s.bookedCount}/{s.capacity} занято</p>
                    <p>{formatPrice(s.priceAmount, s.currency)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Бронирования</h2>
          {bookingsQuery.isLoading ? (
            <p className="text-muted-foreground">Загрузка...</p>
          ) : bookings.length === 0 ? (
            <p className="text-muted-foreground">Бронирований пока нет.</p>
          ) : (
            <div className="space-y-2">
              {bookings.slice(0, 10).map((b) => (
                <div
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold">{b.slot.service.title}</p>
                    <p className="text-muted-foreground">
                      {new Date(b.slot.startsAt).toLocaleString("ru-RU")}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{b.status}</p>
                    <p>{formatPrice(b.totalAmount, b.currency)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProviderDashboard;
