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
import {
  Sparkles,
  CheckCircle2,
  MapPin,
  CreditCard,
  Upload,
} from "lucide-react";
import type { ObserveMoonEventResult } from "@/utilities/getObserveMoonNightProject";

const moonRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  institution: z
    .string()
    .min(2, "University / School / Organization is required"),
  selectedLocation: z.string().optional(),
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
  eventData?: ObserveMoonEventResult;
}

export function MoonNightRegistrationForm({
  year = "2026",
  eventSlug = "observe-the-moon-night-2026",
  eventData,
}: MoonNightRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  const isPaidEvent = Boolean(eventData?.isPaid);
  const locations =
    eventData?.locations && eventData.locations.length > 0
      ? eventData.locations
      : eventData?.location
        ? [{ name: eventData.location }]
        : [];

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
      selectedLocation: locations[0]?.name || "",
      attendanceMode: "in-person",
      equipment: "observer",
      notes: "",
      terms: false,
    },
  });

  const onSubmit = async (data: MoonRegistrationFormValues) => {
    if (isPaidEvent && !paymentFile) {
      toast.error(
        "Please upload your payment receipt / transfer slip before submitting.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone || "");
      formData.append("institution", data.institution);
      formData.append(
        "selectedLocation",
        data.selectedLocation || locations[0]?.name || "",
      );
      formData.append("year", year);
      formData.append("eventSlug", eventSlug);
      formData.append("attendanceMode", data.attendanceMode);
      formData.append("equipment", data.equipment);
      formData.append("notes", data.notes || "");
      formData.append("isPaid", isPaidEvent ? "true" : "false");

      if (paymentFile) {
        formData.append("paymentSlip", paymentFile);
      }

      const res = await fetch("/api/observe-moon-night", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Registration failed");
      }

      toast.success(
        isPaidEvent
          ? `Registration and payment receipt submitted! We will verify your payment and confirm your registration.`
          : `Successfully registered for Observe the Moon Night ${year}! Check your email for event details.`,
      );
      setIsSubmitted(true);
      reset();
      setPaymentFile(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-8 border border-primary/40 bg-background/95 backdrop-blur-md text-center space-y-6 relative overflow-hidden">
        <div className="inline-flex p-4 rounded-full bg-primary/10 border border-primary/20 text-primary">
          <CheckCircle2 className="size-12" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold font-mono uppercase text-foreground">
            Registration Submitted!
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {isPaidEvent
              ? "Your registration and payment slip have been received. Our team will verify your payment and send a confirmation email."
              : `Thank you for registering for International Observe the Moon Night ${year}. We look forward to seeing you under the lunar sky!`}
          </p>
        </div>

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

  const formatCurrency = (val?: string) => {
    if (!val) return "";
    const numMatch = val.replace(/[^0-9.]/g, "");
    const cleanNum = parseFloat(numMatch);
    if (isNaN(cleanNum)) return val;
    return `LKR ${cleanNum.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
      {/* Extended Bleeding Hairline Guide Lines */}
      <div className="relative">
        <div className="absolute -left-6 -right-6 top-0 border-t border-border/60 pointer-events-none" />
        <div className="absolute -left-6 -right-6 bottom-0 border-b border-border/60 pointer-events-none" />
        <div className="absolute -top-6 -bottom-6 left-0 border-l border-border/60 pointer-events-none" />
        <div className="absolute -top-6 -bottom-6 right-0 border-r border-border/60 pointer-events-none" />

        <div className="border border-border/60 divide-y divide-border/60 bg-background relative z-0">
          {/* Header Title */}
          <div className="p-5 bg-background border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-primary tracking-wider">
              <span>Observe the Moon Night {year} Registration</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground uppercase border border-border/60 px-2 py-0.5">
              {isPaidEvent
                ? `Fee: ${formatCurrency(eventData?.ticketPrice) || "Paid Event"}`
                : "Free Event"}
            </span>
          </div>

          {/* Row 1: Full Name */}
          <div className="p-5 space-y-2 bg-background">
            <Label
              htmlFor="fullName"
              className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
            >
              Full Name <span className="text-primary">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="e.g. Dr. Kasun Perera"
              {...register("fullName")}
              className="bg-background border-border/60 font-mono text-sm"
            />
            {errors.fullName && (
              <p className="text-xs text-destructive font-mono">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/60 bg-background">
            <div className="p-5 space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
              >
                Email Address <span className="text-primary">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="kasun@example.com"
                {...register("email")}
                className="bg-background border-border/60 font-mono text-sm"
              />
              {errors.email && (
                <p className="text-xs text-destructive font-mono">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="p-5 space-y-2">
              <Label
                htmlFor="phone"
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
              >
                Contact Phone
              </Label>
              <PhoneInput
                value={watch("phone") || ""}
                onChange={(val) => setValue("phone", val)}
                className="bg-background border-border/60 font-mono text-sm"
              />
            </div>
          </div>

          {/* Row 3: Institution & Selected Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/60 bg-background">
            <div className="p-5 space-y-2">
              <Label
                htmlFor="institution"
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
              >
                University / School / Institution{" "}
                <span className="text-primary">*</span>
              </Label>
              <Input
                id="institution"
                placeholder="e.g. University of Colombo / Independent Observer"
                {...register("institution")}
                className="bg-background border-border/60 font-mono text-sm"
              />
              {errors.institution && (
                <p className="text-xs text-destructive font-mono">
                  {errors.institution.message}
                </p>
              )}
            </div>

            {/* Host Location Selection dropdown if locations exist */}
            {locations.length > 0 && (
              <div className="p-5 space-y-2">
                <Label
                  htmlFor="selectedLocation"
                  className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <MapPin className="size-3.5 text-primary" />
                  <span>Preferred Host Location Site</span>
                </Label>
                <Select
                  value={watch("selectedLocation") || locations[0]?.name || ""}
                  onValueChange={(val) => setValue("selectedLocation", val)}
                >
                  <SelectTrigger className="bg-background border-border/60 font-mono text-sm">
                    <SelectValue placeholder="Select Location Site" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border/60 font-mono text-xs">
                    {locations.map((loc: any, idx: number) => (
                      <SelectItem key={idx} value={loc.name}>
                        {loc.name} {loc.city ? `(${loc.city})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Row 4: Attendance Mode & Equipment */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/60 bg-background">
            <div className="p-5 space-y-2">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Attendance Mode
              </Label>
              <Select
                value={watch("attendanceMode")}
                onValueChange={(val) => setValue("attendanceMode", val)}
              >
                <SelectTrigger className="bg-background border-border/60 font-mono text-sm">
                  <SelectValue placeholder="Select attendance mode" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border/60 font-mono text-xs">
                  <SelectItem value="in-person">
                    In-Person Observation Site
                  </SelectItem>
                  <SelectItem value="virtual">
                    Virtual Stream / Online
                  </SelectItem>
                  <SelectItem value="watch-party">
                    Hosting Local Watch Group
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-5 space-y-2">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Equipment Brought
              </Label>
              <Select
                value={watch("equipment")}
                onValueChange={(val) => setValue("equipment", val)}
              >
                <SelectTrigger className="bg-background border-border/60 font-mono text-sm">
                  <SelectValue placeholder="Select equipment option" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border/60 font-mono text-xs">
                  <SelectItem value="observer">
                    Observer (No Equipment Needed)
                  </SelectItem>
                  <SelectItem value="bringing-equipment">
                    Bringing Telescope / Binoculars
                  </SelectItem>
                  <SelectItem value="astrophotography">
                    Astrophotography DSLR Setup
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Paid Event Payment & Slip Upload Section */}
          {isPaidEvent && (
            <div className="p-5 bg-background space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-foreground tracking-wider">
                <CreditCard className="size-4 text-muted-foreground" />
                <span>Payment & Bank Transfer Details</span>
              </div>

              {eventData?.ticketPrice && (
                <div className="text-xs font-mono text-muted-foreground">
                  Ticket Fee:{" "}
                  <span className="font-bold text-foreground">
                    {formatCurrency(eventData.ticketPrice)}
                  </span>
                </div>
              )}

              {eventData?.paymentDetails && (
                <div className="p-3.5 bg-muted/10 border border-border/60 text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {eventData.paymentDetails}
                </div>
              )}

              <div className="space-y-2 pt-1">
                <Label
                  htmlFor="paymentSlip"
                  className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <Upload className="size-3.5 text-muted-foreground" />
                  <span>
                    Upload Payment Slip / Transfer Receipt{" "}
                    <span className="text-primary">*</span>
                  </span>
                </Label>
                <Input
                  id="paymentSlip"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPaymentFile(e.target.files[0]);
                    }
                  }}
                  className="bg-background border-border/60 font-mono text-xs file:bg-muted/20 file:text-foreground file:border-0 file:rounded-none file:mr-4 file:px-3 file:py-1 cursor-pointer"
                />
                {paymentFile && (
                  <div className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="size-3 text-primary" />
                    <span>
                      File attached: {paymentFile.name} (
                      {(paymentFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Row 5: Notes */}
          <div className="p-5 space-y-2 bg-background">
            <Label
              htmlFor="notes"
              className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
            >
              Additional Notes / Requests
            </Label>
            <Textarea
              id="notes"
              placeholder="Mention any specific telescope setups, group sizes, or questions..."
              {...register("notes")}
              className="bg-background border-border/60 font-mono text-sm min-h-[90px]"
            />
          </div>

          {/* Row 6: Terms & Guidelines Checkbox */}
          <div className="p-5 bg-background space-y-2">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={watch("terms")}
                onCheckedChange={(checked) =>
                  setValue("terms", checked === true)
                }
                className="mt-0.5 border-border/60"
              />
              <Label
                htmlFor="terms"
                className="text-xs text-muted-foreground font-mono leading-relaxed cursor-pointer"
              >
                I agree to follow the safety guidelines for optical telescope
                handling, respect dark-sky preservation rules, and consent to
                participating in International Observe the Moon Night {year}.
              </Label>
            </div>
            {errors.terms && (
              <p className="text-xs text-destructive font-mono">
                {errors.terms.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="default"
          size="lg"
          bleed={true}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Sparkles className="size-4 animate-spin" />
              Submitting...
            </span>
          ) : isPaidEvent ? (
            "Submit Registration & Payment Receipt"
          ) : (
            `Complete Free Registration for Moon Night ${year}`
          )}
        </Button>
      </div>
    </form>
  );
}
