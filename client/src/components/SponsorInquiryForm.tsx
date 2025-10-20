import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface SponsorInquiryFormProps {
  type: 'corporate' | 'b2b';
  title: string;
  description: string;
}

export default function SponsorInquiryForm({ type, title, description }: SponsorInquiryFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    message: ""
  });

  const submitInquiry = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type })
      });
      if (!response.ok) throw new Error("Failed to submit inquiry");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inquiries'] });
      toast({
        title: "Inquiry submitted!",
        description: "Our team will contact you shortly"
      });
      setFormData({ companyName: "", contactName: "", email: "", phone: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiry.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`company-${type}`}>Company Name</Label>
            <Input
              id={`company-${type}`}
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Your Company Inc."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`contact-${type}`}>Contact Name</Label>
            <Input
              id={`contact-${type}`}
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`email-${type}`}>Email</Label>
            <Input
              id={`email-${type}`}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@company.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`phone-${type}`}>Phone (Optional)</Label>
            <Input
              id={`phone-${type}`}
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+33 1 23 45 67 89"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`message-${type}`}>Message</Label>
            <Textarea
              id={`message-${type}`}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your sponsorship interests..."
              rows={4}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitInquiry.isPending}>
            {submitInquiry.isPending ? "Submitting..." : "Submit Inquiry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
