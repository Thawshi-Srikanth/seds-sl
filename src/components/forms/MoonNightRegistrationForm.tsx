"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sparkles, CheckCircle2 } from "lucide-react";

const moonRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  institution: z
    .string()
    .min(2, "University / School / Organization is required"),
  attendanceMode: z.string().min(1, "Please select attendance mode"),
  equipment: z.string().min(1, "Please select equipment option"),
  notes: z.string().optional(),
  terms: z
    .boolean()
    .refine((val) => val === true, "You must agree to event guidelines"),
});

export type MoonRegistrationFormValues = z.infer<typeof moonRegistrationSchema>;

interface MoonNightRegistrationFormProps {
  year?: string;
  eventSlug?: string;
}

export function MoonNightRegistrationForm({
  year = "2026",
  eventSlug = "observe-the-moon-night-2026",
}: MoonNightRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<MoonRegistrationFormValues>({
    resolver: zodResolver(moonRegistrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      institution: "",
      attendanceMode: "in-person",
      equipment: "observer",
      notes: "",
      terms: false,
    },
  });

  const onSubmit = async (data: MoonRegistrationFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/observe-moon-night", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          year,
          eventSlug,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Registration failed");
      }

      toast.success(
        `Successfully registered for Observe the Moon Night ${year}! Check your email for event details.`,
      );
      setIsSubmitted(true);
      reset();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-8 border border-border/60 bg-background text-center space-y-4 relative">
        <div className="w-14 h-14 bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
          <CheckCircle2 className="size-8" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">
          Registration Confirmed!
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Thank you for joining International Observe the Moon Night {year}. We
          have reserved your spot and sent confirmation details to your email
          address.
        </p>
        <Button
          type="button"
          variant="outline"
          bleed={true}
          onClick={() => setIsSubmitted(false)}
        >
          Register Another Participant
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="relative">
        {/* Extended Horizontal Bleed Lines */}
        <div className="absolute -left-6 -right-6 top-0 border-t border-border/60 pointer-events-none" />
        <div className="absolute -left-6 -right-6 bottom-0 border-b border-border/60 pointer-events-none" />

        {/* Extended Vertical Bleed Lines */}
        <div className="absolute -top-6 -bottom-6 left-0 border-l border-border/60 pointer-events-none" />
        <div className="absolute -top-6 -bottom-6 right-0 border-r border-border/60 pointer-events-none" />

        <div className="border border-border/60 divide-y divide-border/60 bg-background relative z-0">
          {/* Header Title */}
          <div className="p-5 bg-background border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-primary tracking-wider">
              <Moon className="size-4" />
              <span>Observe the Moon Night {year} Registration</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground uppercase">
              Free Registration
            </span>
          </div>

          {/* Row 1: Full Name */}
          <div className="p-4 md:p-5 space-y-1.5 bg-background">
            <Label
              htmlFor="fullName"
              className="text-xs uppercase tracking-wider font-mono font-bold text-muted-foreground"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="e.g. Nimal Perera"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/60">
            <div className="p-4 md:p-5 space-y-1.5 bg-background">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-wider font-mono font-bold text-muted-foreground"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@domain.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="p-4 md:p-5 space-y-1.5 bg-background">
              <Label
                htmlFor="phone"
                className="text-xs uppercase tracking-wider font-mono font-bold text-muted-foreground"
              >
                Phone Number
              </Label>
              <PhoneInput
                value={watch("phone")}
                onChange={(val) => setValue("phone", val)}
                defaultCountry="LK"
              />
            </div>
          </div>

          {/* Row 3: University / Institution */}
          <div className="p-4 md:p-5 space-y-1.5 bg-background">
            <Label
              htmlFor="institution"
              className="text-xs uppercase tracking-wider font-mono font-bold text-muted-foreground"
            >
              University / School / Organization
            </Label>
            <Input
              id="institution"
              placeholder="e.g. University of Moratuwa / Ananda College / Independent"
              {...register("institution")}
            />
            {errors.institution && (
              <p className="text-xs text-destructive mt-1">
                {errors.institution.message}
              </p>
            )}
          </div>

          {/* Row 4: Attendance Mode & Equipment */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/60">
            <div className="p-4 md:p-5 space-y-1.5 bg-background">
              <Label
                htmlFor="attendanceMode"
                className="text-xs uppercase tracking-wider font-mono font-bold text-muted-foreground"
              >
                Attendance Preference
              </Label>
              <Select
                value={watch("attendanceMode")}
                onValueChange={(val) => setValue("attendanceMode", val)}
              >
                <SelectTrigger className="w-full bg-transparent border-0 outline-none ring-0 shadow-none focus:ring-0">
                  <SelectValue placeholder="Select mode..." />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border/60 rounded-none z-[160]">
                  <SelectItem value="in-person">
                    In-Person (Observatory Site)
                  </SelectItem>
                  <SelectItem value="virtual">Virtual Live Stream</SelectItem>
                  <SelectItem value="watch-party">
                    Host Local Watch Party
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 md:p-5 space-y-1.5 bg-background">
              <Label
                htmlFor="equipment"
                className="text-xs uppercase tracking-wider font-mono font-bold text-muted-foreground"
              >
                Equipment Brought
              </Label>
              <Select
                value={watch("equipment")}
                onValueChange={(val) => setValue("equipment", val)}
              >
                <SelectTrigger className="w-full bg-transparent border-0 outline-none ring-0 shadow-none focus:ring-0">
                  <SelectValue placeholder="Select equipment..." />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border/60 rounded-none z-[160]">
                  <SelectItem value="observer">
                    Observer (No Equipment)
                  </SelectItem>
                  <SelectItem value="bringing-equipment">
                    Bringing Telescope / Binoculars
                  </SelectItem>
                  <SelectItem value="astrophotography">
                    Astrophotography Rig
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 5: Notes */}
          <div className="p-4 md:p-5 space-y-1.5 bg-background">
            <Label
              htmlFor="notes"
              className="text-xs uppercase tracking-wider font-mono font-bold text-muted-foreground"
            >
              Additional Notes / Questions
            </Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Any questions or special observation requests..."
              {...register("notes")}
            />
          </div>

          {/* Row 6: Agreement & Submit Control */}
          <div className="p-4 md:p-5 bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="terms"
                checked={watch("terms")}
                onCheckedChange={(checked) => setValue("terms", !!checked)}
              />
              <Label
                htmlFor="terms"
                className="text-xs text-muted-foreground cursor-pointer"
              >
                I agree to adhere to event safety & observation guidelines
              </Label>
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              bleed={true}
              disabled={isSubmitting}
              className="w-full sm:w-auto cursor-pointer shrink-0"
            >
              {isSubmitting
                ? "Registering..."
                : `Register for Moon Night ${year}`}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
