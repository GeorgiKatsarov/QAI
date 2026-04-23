"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { BellRing, Check, Mail, MapPinned, Sparkles, Tag } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  notificationSubscriptionSchema,
  type NotificationSubscriptionInput,
} from "@/lib/validation/events";

const CITY_OPTIONS = ["София", "Пловдив", "Варна", "Бургас"] as const;

const CATEGORY_OPTIONS = [
  { value: "music", label: "Музика" },
  { value: "art", label: "Изкуство и изложби" },
  { value: "food", label: "Храна и напитки" },
  { value: "sports", label: "Спорт" },
  { value: "family", label: "Семейни" },
] as const;

const FREQUENCY_OPTIONS = [
  {
    value: "DAILY" as const,
    label: "Всеки ден",
    description: "Подходящо, ако искаш свежи предложения за събития всеки ден.",
  },
  {
    value: "WEEKLY" as const,
    label: "Веднъж седмично",
    description: "По-спокойно обобщение с най-подходящите събития.",
  },
] as const;

function toggleValue(values: string[], nextValue: string) {
  return values.includes(nextValue)
    ? values.filter((value) => value !== nextValue)
    : [...values, nextValue];
}

function SelectionChip({
  label,
  selected,
  onClick,
  icon,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 rounded-2xl border px-4 py-3 text-left text-sm transition-all",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "border-border bg-white/80 text-foreground hover:border-primary/50 hover:bg-white"
      )}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="font-semibold">{label}</span>
      <span
        className={cn(
          "ml-auto flex size-5 items-center justify-center rounded-full border text-[11px]",
          selected
            ? "border-white/40 bg-white/15 text-white"
            : "border-border bg-background text-muted-foreground group-hover:border-primary/40"
        )}
      >
        {selected ? <Check className="size-3" /> : null}
      </span>
    </button>
  );
}

export function NotificationSubscriptionForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmationToken, setConfirmationToken] = useState("");
  const [unsubscribeToken, setUnsubscribeToken] = useState("");

  const form = useForm<NotificationSubscriptionInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(notificationSubscriptionSchema) as any,
    defaultValues: {
      email: "",
      cities: [],
      categoryIds: [],
      priceMax: undefined,
      freeOnly: false,
      frequency: "WEEKLY",
    },
  });

  const selectedCities = useWatch({ control: form.control, name: "cities" }) ?? [];
  const selectedCategories = useWatch({ control: form.control, name: "categoryIds" }) ?? [];
  const freeOnly = useWatch({ control: form.control, name: "freeOnly" }) ?? false;
  const frequency = useWatch({ control: form.control, name: "frequency" }) ?? "WEEKLY";
  const priceMax = useWatch({ control: form.control, name: "priceMax" });

  async function onSubmit(values: NotificationSubscriptionInput) {
    setStatus("idle");
    setErrorMessage("");
    setConfirmationToken("");
    setUnsubscribeToken("");

    const response = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      setStatus("error");
      setErrorMessage(payload.error ?? "Не успяхме да запазим абонамента");
      return;
    }

    setStatus("success");
    setConfirmationToken(payload.confirmationToken ?? "");
    setUnsubscribeToken(payload.unsubscribeToken ?? "");
  }

  return (
    <div className="rounded-[2rem] border border-border/70 bg-white/85 p-5 shadow-[0_24px_80px_rgba(74,154,222,0.14)] backdrop-blur-sm sm:p-8">
      <form
        className="space-y-8"
        data-testid="subscription-form"
        aria-label="Форма за абонамент за известия"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid gap-4 rounded-[1.5rem] border border-primary/15 bg-gradient-to-br from-white via-[#F8FCFF] to-[#EAF5FF] p-5 sm:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <BellRing className="size-3.5" />
              Персонализирани бюлетини за събития
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              Настрой събитията, за които реално искаш да чуваш
            </h2>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Избери градове, категории, честота и бюджет веднъж. Ние ще филтрираме шума и ще
              изпращаме по-точен списък със събития според предпочитанията ти.
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-border/70 bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Накратко
            </p>
            <div className="mt-3 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 text-primary" />
                <p>Потвърждението остава двойно, за да са абонаментите изрични и ясни.</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPinned className="mt-0.5 size-4 text-primary" />
                <p>Изборът на град е по желание. Остави го празен за по-широк бюлетин.</p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 size-4 text-primary" />
                <p>Можеш да се отпишеш по всяко време от всеки получен имейл.</p>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="sub-email" className="text-sm font-semibold">
              Имейл адрес <span className="text-destructive">*</span>
            </label>
            <input
              id="sub-email"
              type="email"
              placeholder="ти@example.com"
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground"
              data-testid="subscription-email-input"
              {...form.register("email")}
            />
            <p className="text-xs text-muted-foreground">
              Ще го използваме само за бюлетина и линковете за потвърждение.
            </p>
            {form.formState.errors.email ? (
              <p className="text-sm text-destructive" data-testid="subscription-error">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold">Градове</p>
              <p className="text-xs text-muted-foreground">
                Избери един или повече градове, или остави празно за всички локации.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {CITY_OPTIONS.map((city) => (
                <SelectionChip
                  key={city}
                  label={city}
                  selected={selectedCities.includes(city)}
                  onClick={() =>
                    form.setValue("cities", toggleValue(selectedCities, city), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  icon={<MapPinned className="size-4" />}
                />
              ))}
            </div>
            <select
              multiple
              value={selectedCities}
              onChange={(event) =>
                form.setValue(
                  "cities",
                  Array.from(event.currentTarget.selectedOptions, (option) => option.value),
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                )
              }
              className="sr-only"
              data-testid="subscription-city-select"
              aria-hidden="true"
              tabIndex={-1}
            >
              {CITY_OPTIONS.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold">Категории</p>
              <p className="text-xs text-muted-foreground">
                Избери какви събития да попадат в бюлетина ти.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {CATEGORY_OPTIONS.map((category) => (
                <SelectionChip
                  key={category.value}
                  label={category.label}
                  selected={selectedCategories.includes(category.value)}
                  onClick={() =>
                    form.setValue("categoryIds", toggleValue(selectedCategories, category.value), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  icon={<Tag className="size-4" />}
                />
              ))}
            </div>
            <select
              multiple
              value={selectedCategories}
              onChange={(event) =>
                form.setValue(
                  "categoryIds",
                  Array.from(event.currentTarget.selectedOptions, (option) => option.value),
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                )
              }
              className="sr-only"
              data-testid="subscription-category-select"
              aria-hidden="true"
              tabIndex={-1}
            >
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold">Честота на получаване</p>
              <p className="text-xs text-muted-foreground">
                Избери колко често да обобщаваме подходящите събития.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {FREQUENCY_OPTIONS.map((option) => {
                const active = frequency === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      form.setValue("frequency", option.value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className={cn(
                      "rounded-[1.25rem] border p-4 text-left transition-all",
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "border-border bg-white/80 hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{option.label}</p>
                      <span
                        className={cn(
                          "flex size-6 items-center justify-center rounded-full border",
                          active
                            ? "border-white/40 bg-white/15"
                            : "border-border bg-background text-muted-foreground"
                        )}
                      >
                        {active ? <Check className="size-3.5" /> : null}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-2 text-sm leading-6",
                        active ? "text-primary-foreground/85" : "text-muted-foreground"
                      )}
                    >
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
            <select
              value={frequency}
              onChange={(event) =>
                form.setValue("frequency", event.currentTarget.value as "DAILY" | "WEEKLY", {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              className="sr-only"
              data-testid="subscription-frequency-select"
              aria-hidden="true"
              tabIndex={-1}
            >
              <option value="DAILY">Ежедневен бюлетин</option>
              <option value="WEEKLY">Седмичен бюлетин</option>
            </select>
          </div>

          <div className="rounded-[1.5rem] border border-border/70 bg-[#F8FCFF] p-5">
            <div>
              <p className="text-sm font-semibold">Допълнителни филтри</p>
              <p className="text-xs text-muted-foreground">
                Те помагат да стесним бюлетина още повече.
              </p>
            </div>

            <div className="mt-4 space-y-4">
              <label className="flex items-start gap-3 rounded-2xl border border-border bg-white px-4 py-3">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-[var(--primary)]"
                  {...form.register("freeOnly")}
                />
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    Показвай само безплатни събития
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    Полезно за лесни идеи за уикенда и публични фестивали.
                  </span>
                </span>
              </label>

              <div className="space-y-1.5">
                <label htmlFor="sub-price-max" className="text-sm font-semibold">
                  Максимална цена на билет
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="sub-price-max"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Без ограничение"
                    className="w-full rounded-2xl border border-input bg-white px-4 py-3 text-sm"
                    {...form.register("priceMax", { valueAsNumber: true })}
                  />
                  <span className="text-sm font-semibold text-muted-foreground">лв.</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Остави празно, ако цената не трябва да влияе на бюлетина.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border/70 bg-gradient-to-r from-[#F9FCFF] to-[#FFF8FC] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Текущо обобщение
          </p>
          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Градове</p>
              <p className="mt-1 font-semibold text-foreground">
                {selectedCities.length ? selectedCities.join(", ") : "Всички градове"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Категории</p>
              <p className="mt-1 font-semibold text-foreground">
                {selectedCategories.length
                  ? CATEGORY_OPTIONS.filter((option) => selectedCategories.includes(option.value))
                      .map((option) => option.label)
                      .join(", ")
                  : "Всички категории"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Честота</p>
              <p className="mt-1 font-semibold text-foreground">
                {frequency === "DAILY" ? "Всеки ден" : "Веднъж седмично"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Бюджет</p>
              <p className="mt-1 font-semibold text-foreground">
                {freeOnly
                  ? "Само безплатни"
                  : typeof priceMax === "number" && !Number.isNaN(priceMax)
                    ? `До ${priceMax} лв.`
                    : "Без ограничение"}
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-6 text-muted-foreground">
            С абонамента заявяваш, че искаш подбрани имейли за събития според избраните филтри.
          </p>
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            data-testid="subscription-submit-button"
          >
            <BellRing className="size-4" />
            {form.formState.isSubmitting ? "Запазваме предпочитанията..." : "Започни моя бюлетин"}
          </button>
        </div>

        {status === "success" ? (
          <div
            data-testid="subscription-success"
            className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800"
          >
            <p className="font-semibold">Абонаментът е запазен. Потвърди го от входящата си поща, за да го активираш.</p>
            <p className="mt-1 text-emerald-700/90">
              За тази демо версия линковете за потвърждение и отписване са показани по-долу.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {confirmationToken ? (
                <Link
                  href={`/notifications/confirm?token=${confirmationToken}`}
                  data-testid="subscription-confirm-link"
                  className="rounded-2xl border border-emerald-300 bg-white px-4 py-3 font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                >
                  Потвърди абонамента
                </Link>
              ) : null}
              {unsubscribeToken ? (
                <Link
                  href={`/notifications/unsubscribe?token=${unsubscribeToken}`}
                  data-testid="subscription-unsubscribe-link"
                  className="rounded-2xl border border-emerald-300 bg-white px-4 py-3 font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                >
                  Управлявай или се отпиши
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}

        {status === "error" ? (
          <div
            className="rounded-[1.5rem] border border-destructive/20 bg-destructive/5 p-4"
            data-testid="subscription-error"
          >
            <p className="text-sm font-semibold text-destructive">Не успяхме да запазим абонамента.</p>
            <p className="mt-1 text-sm text-destructive">{errorMessage}</p>
          </div>
        ) : null}
      </form>
    </div>
  );
}
