"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, CheckCircle2, CircleAlert, Mail, MapPinned, Sparkles, Tag } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { submitEventSchema, type SubmitEventInput } from "@/lib/validation/events";

const CITY_SUGGESTIONS = ["София", "Пловдив", "Варна", "Бургас", "Русе", "Стара Загора"] as const;

const CATEGORY_OPTIONS = [
  { value: "music", label: "Музика" },
  { value: "art", label: "Изкуство и изложби" },
  { value: "food", label: "Храна и напитки" },
  { value: "sports", label: "Спорт" },
  { value: "family", label: "Семейни" },
  { value: "other", label: "Друго" },
] as const;

export function SubmitEventForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<SubmitEventInput>({
    resolver: zodResolver(submitEventSchema),
    defaultValues: {
      title: "",
      date: "",
      city: "",
      categorySlug: "",
      email: "",
      description: "",
      honeypot: "",
    },
  });

  const categorySlug = useWatch({ control: form.control, name: "categorySlug" }) ?? "";
  const city = useWatch({ control: form.control, name: "city" }) ?? "";
  const date = useWatch({ control: form.control, name: "date" }) ?? "";

  async function onSubmit(values: SubmitEventInput) {
    setStatus("idle");
    setErrorMessage("");

    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      setStatus("error");
      setErrorMessage(payload.error ?? "Не успяхме да изпратим събитието");
      return;
    }

    form.reset();
    setStatus("success");
  }

  return (
    <div className="rounded-[2rem] border border-border/70 bg-white/85 p-5 shadow-[0_24px_80px_rgba(74,154,222,0.14)] backdrop-blur-sm sm:p-8">
      <form
        className="space-y-8"
        data-testid="submit-event-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...form.register("honeypot")} />

        <div className="grid gap-4 rounded-[1.5rem] border border-primary/15 bg-gradient-to-br from-white via-[#F8FCFF] to-[#EAF5FF] p-5 sm:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <Sparkles className="size-3.5" />
              Предложения от общността
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              Сподели събитие с достатъчно детайли за бърз преглед
            </h2>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Изпрати основната информация веднъж и екипът ще може да я превърне в готова за
              публикуване обява. Колкото по-ясно е предложението, толкова по-бързо може да бъде одобрено.
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-border/70 bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Какво помага най-много
            </p>
            <div className="mt-3 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <CalendarClock className="mt-0.5 size-4 text-primary" />
                <p>Посочи реалната начална дата и час, когато ги имаш.</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPinned className="mt-0.5 size-4 text-primary" />
                <p>Добави ясно града, за да попадне събитието в правилния локален поток.</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 text-primary" />
                <p>Използвай имейл, до който имаш достъп, в случай че екипът поиска уточнение.</p>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-sm font-semibold">
                Заглавие на събитието <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Пример: Джаз вечер на покрива в София"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm"
                data-testid="submit-title-input"
                {...form.register("title")}
              />
              {form.formState.errors.title ? (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Напиши го достатъчно конкретно, за да може събитието да бъде разпознато веднага.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="date" className="text-sm font-semibold">
                Дата и час <span className="text-destructive">*</span>
              </label>
              <input
                id="date"
                type="datetime-local"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm"
                data-testid="submit-date-input"
                {...form.register("date")}
              />
              {form.formState.errors.date ? (
                <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Използвай локалния час на събитието, а не момента, в който смяташ да го обявиш.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="city" className="text-sm font-semibold">
                Град <span className="text-destructive">*</span>
              </label>
              <input
                id="city"
                type="text"
                list="submit-city-suggestions"
                placeholder="Започни да пишеш град"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm"
                data-testid="submit-city-input"
                {...form.register("city")}
              />
              <datalist id="submit-city-suggestions">
                {CITY_SUGGESTIONS.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
              <div className="flex flex-wrap gap-2 pt-1">
                {CITY_SUGGESTIONS.slice(0, 4).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() =>
                      form.setValue("city", suggestion, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                      city === suggestion
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              {form.formState.errors.city ? (
                <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="categorySlug" className="text-sm font-semibold">
                Категория <span className="text-destructive">*</span>
              </label>
              <div className="rounded-[1.5rem] border border-border/70 bg-[#F8FCFF] p-4">
                <select
                  id="categorySlug"
                  className="w-full rounded-2xl border border-input bg-white px-4 py-3 text-sm"
                  data-testid="submit-category-input"
                  {...form.register("categorySlug")}
                >
                  <option value="">Избери категория</option>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {CATEGORY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        form.setValue("categorySlug", option.value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      className={cn(
                        "flex items-center gap-2 rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition-all",
                        categorySlug === option.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-white text-foreground hover:border-primary/40"
                      )}
                    >
                      <Tag className="size-4" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              {form.formState.errors.categorySlug ? (
                <p className="text-sm text-destructive">{form.formState.errors.categorySlug.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold">
                Имейл за контакт <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="organizator@example.com"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm"
                data-testid="submit-email-input"
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Може да бъде използван, ако има нужда от уточнение за събитието.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-1.5">
          <label htmlFor="description" className="text-sm font-semibold">
            Описание
          </label>
          <textarea
            id="description"
            rows={6}
            placeholder="Добави най-важното: място, участници, публика, акценти или всичко друго, което ще помогне на екипа да разбере събитието."
            className="w-full rounded-[1.5rem] border border-input bg-background px-4 py-3 text-sm leading-7"
            {...form.register("description")}
          />
          {form.formState.errors.description ? (
            <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              По желание, но е полезно. Няколко добри изречения са по-добри от липса на контекст.
            </p>
          )}
        </section>

        <section className="rounded-[1.5rem] border border-border/70 bg-gradient-to-r from-[#F9FCFF] to-[#FFF8FC] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Преглед на предложението
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Категория</p>
              <p className="mt-1 font-semibold text-foreground">
                {CATEGORY_OPTIONS.find((option) => option.value === categorySlug)?.label ?? "Не е избрана"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Град</p>
              <p className="mt-1 font-semibold text-foreground">{city || "Все още не е добавен"}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Дата</p>
              <p className="mt-1 font-semibold text-foreground">
                {date ? new Date(date).toLocaleString("bg-BG") : "Все още не е посочена"}
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-6 text-muted-foreground">
            Всяко събитие се преглежда преди публикуване, затова колкото по-ясно е предложението, толкова по-лесно е одобрението.
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
            data-testid="submit-button"
          >
            <Sparkles className="size-4" />
            {form.formState.isSubmitting ? "Изпращане..." : "Изпрати за преглед"}
          </button>
        </div>

        {status === "success" ? (
          <div
            className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5"
            data-testid="submit-success"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 text-emerald-700" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Благодарим. Предложението ти вече чака преглед.
                </p>
                <p className="mt-1 text-sm leading-6 text-emerald-700/90">
                  Екипът ще провери детайлите и ще го публикува, ако всичко е наред.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-[1.5rem] border border-destructive/20 bg-destructive/5 p-4" data-testid="submit-error">
            <div className="flex items-start gap-3">
              <CircleAlert className="mt-0.5 size-5 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-destructive">Не успяхме да изпратим събитието.</p>
                <p className="mt-1 text-sm text-destructive">{errorMessage}</p>
              </div>
            </div>
          </div>
        ) : null}
      </form>
    </div>
  );
}
