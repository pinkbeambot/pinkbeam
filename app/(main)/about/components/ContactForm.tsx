"use client";

import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { aboutContactSchema, getFieldErrors } from "@/lib/validation";
import { useAnalyticsSafe } from "@/components/analytics";

interface FormData {
  name: string;
  email: string;
  company: string;
  department: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  department?: string;
  message?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    department: "general",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { trackFormSubmission } = useAnalyticsSafe();

  const validate = (): boolean => {
    const result = aboutContactSchema.safeParse(formData);
    if (!result.success) {
      setErrors(getFieldErrors(result.error) as FormErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      if (trackFormSubmission) {
        trackFormSubmission('contact_form', false, { reason: 'validation_error' });
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Log to console as per requirements
    console.log("Contact Form Submission:", formData);

    // Track successful submission
    if (trackFormSubmission) {
      trackFormSubmission('contact_form', true, {
        department: formData.department,
        has_company: !!formData.company,
      });
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-success-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success-500" />
        </div>
        <h3 className="font-display font-semibold text-xl text-foreground mb-2">
          Message Sent!
        </h3>
        <p className="text-muted-foreground">
          Thanks for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Name <span className="text-pink-500">*</span>
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Your full name"
          value={formData.name}
          onChange={handleChange}
          className={cn(errors.name && "border-error-500 focus-visible:ring-error-500/20")}
        />
        {errors.name && (
          <p className="text-sm text-error-500">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email <span className="text-pink-500">*</span>
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          value={formData.email}
          onChange={handleChange}
          className={cn(errors.email && "border-error-500 focus-visible:ring-error-500/20")}
        />
        {errors.email && (
          <p className="text-sm text-error-500">{errors.email}</p>
        )}
      </div>

      {/* Company Field (Optional) */}
      <div className="space-y-2">
        <label htmlFor="company" className="text-sm font-medium text-foreground">
          Company <span className="text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="company"
          name="company"
          type="text"
          placeholder="Your company name"
          value={formData.company}
          onChange={handleChange}
        />
        {errors.company && (
          <p className="text-sm text-error-500">{errors.company}</p>
        )}
      </div>

      {/* Department Select */}
      <div className="space-y-2">
        <label htmlFor="department" className="text-sm font-medium text-foreground">
          Department
        </label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="general">General Inquiry</option>
          <option value="sales">Sales</option>
          <option value="support">Support</option>
        </select>
        {errors.department && (
          <p className="text-sm text-error-500">{errors.department}</p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message <span className="text-pink-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us how we can help..."
          value={formData.message}
          onChange={handleChange}
          className={cn(
            "w-full px-3 py-2 rounded-md border bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none",
            errors.message
              ? "border-error-500 focus-visible:ring-error-500/20"
              : "border-input"
          )}
        />
        {errors.message && (
          <p className="text-sm text-error-500">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="beam"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin mr-2">⟳</span>
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        We typically respond within 24 hours
      </p>
    </form>
  );
}

export default ContactForm;
