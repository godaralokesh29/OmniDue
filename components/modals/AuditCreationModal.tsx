'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface AuditCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (audit: any) => void;
}

export default function AuditCreationModal({ isOpen, onClose, onSuccess }: AuditCreationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    company_industry: '',
    audit_type: 'full',
    include_license_scan: true,
    include_security_audit: true,
    include_privacy_mapper: true,
    include_regulatory_check: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create audit
      const auditRes = await fetch('/api/audits/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: formData.company_name,
          company_industry: formData.company_industry,
          audit_type: formData.audit_type,
        }),
      });

      const auditData = await auditRes.json();

      if (!auditData.success) throw new Error('Failed to create audit');

      // Trigger analysis
      const analysisTypes: string[] = [];
      if (formData.include_license_scan) analysisTypes.push('license');
      if (formData.include_security_audit) analysisTypes.push('security');
      if (formData.include_privacy_mapper) analysisTypes.push('privacy');
      if (formData.include_regulatory_check) analysisTypes.push('compliance');

      await fetch('/api/analysis/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audit_id: auditData.audit.id,
          analysis_types: analysisTypes.length > 0 ? analysisTypes : ['compliance'],
        }),
      });

      onSuccess(auditData.audit);
    } catch (error) {
      console.error('[v0] Error creating audit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Audit</DialogTitle>
          <DialogDescription>
            Configure and initiate a new M&A due diligence audit for your target company
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name *</Label>
            <Input
              id="company_name"
              placeholder="Acme Corporation"
              value={formData.company_name}
              onChange={(e) =>
                setFormData({ ...formData, company_name: e.target.value })
              }
              disabled={loading}
              required
            />
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="company_industry">Industry</Label>
            <Select
              value={formData.company_industry}
              onValueChange={(value) =>
                setFormData({ ...formData, company_industry: value })
              }
              disabled={loading}
            >
              <SelectTrigger id="company_industry">
                <SelectValue placeholder="Select industry..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Audit Type */}
          <div className="space-y-2">
            <Label htmlFor="audit_type">Audit Type</Label>
            <Select
              value={formData.audit_type}
              onValueChange={(value) =>
                setFormData({ ...formData, audit_type: value })
              }
              disabled={loading}
            >
              <SelectTrigger id="audit_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Audit</SelectItem>
                <SelectItem value="compliance">Compliance Only</SelectItem>
                <SelectItem value="security">Security Only</SelectItem>
                <SelectItem value="license">License Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Analysis Options */}
          <div className="space-y-4 border-t border-border pt-4">
            <p className="text-sm font-medium">Include in Audit</p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="license_scan"
                  checked={formData.include_license_scan}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      include_license_scan: checked as boolean,
                    })
                  }
                  disabled={loading}
                />
                <Label
                  htmlFor="license_scan"
                  className="font-normal cursor-pointer"
                >
                  License Compliance Scan
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="security_audit"
                  checked={formData.include_security_audit}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      include_security_audit: checked as boolean,
                    })
                  }
                  disabled={loading}
                />
                <Label
                  htmlFor="security_audit"
                  className="font-normal cursor-pointer"
                >
                  Security Vulnerability Audit
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacy_mapper"
                  checked={formData.include_privacy_mapper}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      include_privacy_mapper: checked as boolean,
                    })
                  }
                  disabled={loading}
                />
                <Label
                  htmlFor="privacy_mapper"
                  className="font-normal cursor-pointer"
                >
                  Privacy & GDPR Mapper
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="regulatory_check"
                  checked={formData.include_regulatory_check}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      include_regulatory_check: checked as boolean,
                    })
                  }
                  disabled={loading}
                />
                <Label
                  htmlFor="regulatory_check"
                  className="font-normal cursor-pointer"
                >
                  Regulatory Compliance Check
                </Label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Creating Audit...' : 'Create & Analyze'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
