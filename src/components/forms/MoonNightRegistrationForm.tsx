"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { toast } from "sonner";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Upload,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { Turnstile } from "@/components/Turnstile";
import type { ObserveMoonEventResult } from "@/utilities/getObserveMoonNightProject";

const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  institution: z
    .string()
    .min(2, "Please enter your university, school, or organization"),
  selectedLocation: z.string().optional(),
  attendanceMode: z.string().default("in-person"),
  equipment: z.string().default("observer"),
  notes: z.string().optional(),
  termsAccepted: z.literal(true, {
    message: "You must accept the safety guidelines to register",
  }),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface MoonNightRegistrationFormProps {
  year?: string;
  eventSlug?: string;
  eventData?: ObserveMoonEventResult;
}

export function MoonNightRegistrationForm({
  year = "2026",
  eventData,
}: MoonNightRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passCode, setPassCode] = useState<string | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const isPaidEvent = Boolean(eventData?.isPaid);
  const locations = eventData?.locations || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(registrationSchema) as any,
    defaultValues: {
      attendanceMode: "in-person",
      equipment: "observer",
      selectedLocation: locations[0]?.name || "Galle Face Green, Colombo",
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    if (isPaidEvent && !paymentFile) {
      toast.error(
        "Payment slip upload is required for paid event registration.",
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
        data.selectedLocation || locations[0]?.name || "Galle Face Green",
      );
      formData.append("attendanceMode", data.attendanceMode);
      formData.append("equipment", data.equipment);
      formData.append("notes", data.notes || "");
      formData.append("year", year);
      formData.append("eventTitle", eventData?.title || `Observe Moon ${year}`);
      if (turnstileToken) {
        formData.append("turnstileToken", turnstileToken);
      }

      if (paymentFile) {
        formData.append("paymentSlip", paymentFile);
      }

      const res = await fetch("/api/observe-moon-night", {
        method: "POST",
        body: formData,
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Registration failed");
      }

      if (resData.registrationCode || resData.registrationId) {
        setPassCode(resData.registrationCode || resData.registrationId);
      }

      setIsSubmitted(true);
      toast.success(
        "Registration successful! Confirmation details have been logged.",
      );
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
      <div className="relative">
        <div className="absolute -left-4 -right-4 top-0 border-t border-slate-300 pointer-events-none" />
        <div className="absolute -left-4 -right-4 bottom-0 border-b border-slate-300 pointer-events-none" />
        <div className="absolute -top-4 -bottom-4 left-0 border-l border-slate-300 pointer-events-none" />
        <div className="absolute -top-4 -bottom-4 right-0 border-r border-slate-300 pointer-events-none" />

        <div className="p-8 md:p-12 border border-slate-300 bg-white text-slate-900 text-center space-y-6 relative z-0">
          <div className="inline-flex p-4 rounded-full bg-blue-50 border border-blue-200 text-blue-600">
            <CheckCircle2 className="size-12" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold font-mono uppercase text-slate-900">
              Registration Submitted!
            </h3>
            {passCode && (
              <div className="inline-block px-3 py-1 bg-slate-900 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider border border-slate-700">
                PASS CODE: {passCode}
              </div>
            )}
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {isPaidEvent
                ? "Your registration and payment receipt have been received. Our team will verify your payment and send a confirmation email."
                : `Thank you for registering for International Observe the Moon Night ${year}. We look forward to seeing you under the lunar sky!`}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            bleed={true}
            onClick={() => setIsSubmitted(false)}
            className="mt-4 bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-900 border-slate-300 font-mono text-sm"
          >
            Register Another Participant
          </Button>
        </div>
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
      {/* Flat High-Contrast Crisp White Form Surface with Hairline Outlines */}
      <div className="relative">
        <div className="absolute -left-4 -right-4 top-0 border-t border-slate-300 pointer-events-none" />
        <div className="absolute -left-4 -right-4 bottom-0 border-b border-slate-300 pointer-events-none" />
        <div className="absolute -top-4 -bottom-4 left-0 border-l border-slate-300 pointer-events-none" />
        <div className="absolute -top-4 -bottom-4 right-0 border-r border-slate-300 pointer-events-none" />

        <div className="border border-slate-300 divide-y divide-slate-200 bg-white text-slate-900 relative z-0">
          {/* Header Title */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-blue-700 tracking-widest">
              <ShieldCheck className="size-4 text-blue-600" />
              <span>Observe the Moon Night {year} Registration</span>
            </div>
            <span className="text-xs font-mono text-slate-900 uppercase border border-slate-300 px-3 py-1 bg-white font-bold">
              {isPaidEvent
                ? `Fee: ${formatCurrency(eventData?.ticketPrice) || "Paid Event"}`
                : "Free Event"}
            </span>
          </div>

          {/* Row 1: Full Name */}
          <div className="p-6 space-y-2.5 bg-white">
            <Label
              htmlFor="fullName"
              className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800"
            >
              Full Name <span className="text-blue-600">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="e.g. Dr. Kasun Perera"
              {...register("fullName")}
              className="bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white font-mono text-sm transition-all placeholder:text-slate-400 h-11"
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 font-mono font-semibold">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
            <div className="p-6 space-y-2.5">
              <Label
                htmlFor="email"
                className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800"
              >
                Email Address <span className="text-blue-600">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="kasun@example.com"
                {...register("email")}
                className="bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white font-mono text-sm transition-all placeholder:text-slate-400 h-11"
              />
              {errors.email && (
                <p className="text-xs text-red-600 font-mono font-semibold">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="p-6 space-y-2.5">
              <Label
                htmlFor="phone"
                className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800"
              >
                Contact Phone
              </Label>
              <PhoneInput
                defaultCountry="LK"
                international={true}
                value={watch("phone") || ""}
                onChange={(val) => setValue("phone", val)}
                className="bg-slate-50 border-slate-300 text-slate-900 focus-within:border-blue-600 focus-within:bg-white font-mono text-sm transition-all h-11 px-3 items-center rounded-none"
              />
            </div>
          </div>

          {/* Row 3: Institution & Selected Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
            <div className="p-6 space-y-2.5">
              <Label
                htmlFor="institution"
                className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800"
              >
                University / School / Institution{" "}
                <span className="text-blue-600">*</span>
              </Label>
              <Input
                id="institution"
                placeholder="e.g. University of Colombo / Independent Observer"
                {...register("institution")}
                className="bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white font-mono text-sm transition-all placeholder:text-slate-400 h-11"
              />
              {errors.institution && (
                <p className="text-xs text-red-600 font-mono font-semibold">
                  {errors.institution.message}
                </p>
              )}
            </div>

            {/* Host Location Selection dropdown if locations exist */}
            {locations.length > 0 && (
              <div className="p-6 space-y-2.5">
                <Label
                  htmlFor="selectedLocation"
                  className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5"
                >
                  <MapPin className="size-3.5 text-blue-600" />
                  <span>Preferred Host Location Site</span>
                </Label>
                <Select
                  value={watch("selectedLocation") || locations[0]?.name || ""}
                  onValueChange={(val) => setValue("selectedLocation", val)}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white font-mono text-sm h-11">
                    <SelectValue placeholder="Select Location Site" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-300 font-mono text-xs text-slate-900">
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
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
            <div className="p-6 space-y-2.5">
              <Label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                Attendance Mode
              </Label>
              <Select
                value={watch("attendanceMode")}
                onValueChange={(val) => setValue("attendanceMode", val)}
              >
                <SelectTrigger className="bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white font-mono text-sm h-11">
                  <SelectValue placeholder="Select attendance mode" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-300 font-mono text-xs text-slate-900">
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

            <div className="p-6 space-y-2.5">
              <Label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                Equipment Brought
              </Label>
              <Select
                value={watch("equipment")}
                onValueChange={(val) => setValue("equipment", val)}
              >
                <SelectTrigger className="bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white font-mono text-sm h-11">
                  <SelectValue placeholder="Select equipment option" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-300 font-mono text-xs text-slate-900">
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
            <div className="p-6 bg-slate-50 space-y-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-900 tracking-wider">
                <CreditCard className="size-4 text-blue-600" />
                <span>Payment & Bank Transfer Details</span>
              </div>

              {eventData?.ticketPrice && (
                <div className="text-xs font-mono text-slate-700 font-semibold">
                  Ticket Fee:{" "}
                  <span className="font-bold text-blue-700">
                    {formatCurrency(eventData.ticketPrice)}
                  </span>
                </div>
              )}

              {eventData?.paymentDetails && (
                <div className="p-4 bg-white border border-slate-300 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {eventData.paymentDetails}
                </div>
              )}

              <div className="space-y-2 pt-1">
                <Label
                  htmlFor="paymentSlip"
                  className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5"
                >
                  <Upload className="size-3.5 text-blue-600" />
                  <span>
                    Upload Payment Slip / Transfer Receipt{" "}
                    <span className="text-blue-600">*</span>
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
                  className="bg-white border-slate-300 font-mono text-xs text-slate-900 file:bg-slate-100 file:text-slate-900 file:border-0 file:rounded-none file:mr-4 file:px-3 file:py-1 cursor-pointer h-11 flex items-center"
                />
                {paymentFile && (
                  <div className="text-xs font-mono text-slate-800 flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="size-3.5 text-blue-600" />
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
          <div className="p-6 space-y-2.5 bg-white">
            <Label
              htmlFor="notes"
              className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800"
            >
              Additional Notes / Requests
            </Label>
            <Textarea
              id="notes"
              placeholder="Mention any specific telescope setups, group sizes, or questions..."
              {...register("notes")}
              className="bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white font-mono text-sm min-h-[90px] placeholder:text-slate-400"
            />
          </div>

          {/* Row 6: Terms & Guidelines Checkbox */}
          <div className="p-6 bg-white space-y-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="termsAccepted"
                checked={Boolean(watch("termsAccepted"))}
                onCheckedChange={(checked) =>
                  setValue("termsAccepted", (checked === true) as true)
                }
                className="mt-0.5 border-slate-400 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
              />
              <Label
                htmlFor="termsAccepted"
                className="text-xs text-slate-600 leading-relaxed cursor-pointer font-sans"
              >
                I agree to adhere to the astronomical observation safety
                guidelines, laser pointer restrictions, and event site conduct
                rules.
              </Label>
            </div>
            {errors.termsAccepted && (
              <p className="text-xs text-red-600 font-mono font-semibold pt-1">
                {errors.termsAccepted.message}
              </p>
            )}
          </div>

          {/* Turnstile Bot Protection */}
          <div className="p-4 bg-white border-t border-slate-200 flex justify-center">
            <Turnstile
              theme="light"
              onVerify={(token) => setTurnstileToken(token)}
            />
          </div>

          {/* Submit Action Area */}
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <Button
              type="submit"
              disabled={isSubmitting}
              bleed={true}
              className="w-full py-6 text-sm font-mono font-bold uppercase tracking-widest cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Submitting Registration...</span>
                </span>
              ) : (
                <span>Confirm & Submit Registration</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
