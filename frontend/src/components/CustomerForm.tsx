import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp, Sparkles, RotateCcw } from 'lucide-react';
import type { CustomerData } from '../types/churn';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface CustomerFormProps {
  onPredict: (data: CustomerData) => void;
  onReset: () => void;
}

export function CustomerForm({ onPredict, onReset }: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerData>({
    gender: 'Male',
    seniorCitizen: false,
    partner: 'No',
    dependents: 'No',
    phoneService: 'Yes',
    multipleLines: 'No',
    internetService: 'Fiber optic',
    onlineSecurity: 'No',
    onlineBackup: 'No',
    deviceProtection: 'No',
    techSupport: 'No',
    streamingTV: 'No',
    streamingMovies: 'No',
    contract: 'Month-to-month',
    paperlessBilling: 'Yes',
    paymentMethod: 'Electronic check',
    tenure: 12,
    monthlyCharges: 70,
    totalCharges: 840
  });

  const [openSections, setOpenSections] = useState({
    profile: true,
    services: true,
    additional: false,
    billing: false,
    usage: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict(formData);
  };

  const handleResetForm = () => {
    setFormData({
      gender: 'Male',
      seniorCitizen: false,
      partner: 'No',
      dependents: 'No',
      phoneService: 'Yes',
      multipleLines: 'No',
      internetService: 'Fiber optic',
      onlineSecurity: 'No',
      onlineBackup: 'No',
      deviceProtection: 'No',
      techSupport: 'No',
      streamingTV: 'No',
      streamingMovies: 'No',
      contract: 'Month-to-month',
      paperlessBilling: 'Yes',
      paymentMethod: 'Electronic check',
      tenure: 12,
      monthlyCharges: 70,
      totalCharges: 840
    });
    onReset();
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl shadow-2xl">
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Customer Information</h2>

        <div className="space-y-4">
          {/* Customer Profile */}
          <FormSection
            title="Customer Profile"
            isOpen={openSections.profile}
            onToggle={() => toggleSection('profile')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Gender">
                <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Senior Citizen">
                <div className="flex items-center h-10 px-3 bg-slate-800/50 border border-slate-700 rounded-md">
                  <Switch
                    checked={formData.seniorCitizen}
                    onCheckedChange={(v) => setFormData({...formData, seniorCitizen: v})}
                  />
                  <span className="ml-3 text-sm text-slate-300">{formData.seniorCitizen ? 'Yes' : 'No'}</span>
                </div>
              </FormField>

              <FormField label="Partner">
                <Select value={formData.partner} onValueChange={(v) => setFormData({...formData, partner: v})}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Dependents">
                <Select value={formData.dependents} onValueChange={(v) => setFormData({...formData, dependents: v})}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </FormSection>

          {/* Services */}
          <FormSection
            title="Services"
            isOpen={openSections.services}
            onToggle={() => toggleSection('services')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Phone Service">
                <Select value={formData.phoneService} onValueChange={(v) => setFormData({...formData, phoneService: v})}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Multiple Lines">
                <Select value={formData.multipleLines} onValueChange={(v) => setFormData({...formData, multipleLines: v})}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="No phone service">No phone service</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Internet Service" className="sm:col-span-2">
                <Select value={formData.internetService} onValueChange={(v) => setFormData({...formData, internetService: v})}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DSL">DSL</SelectItem>
                    <SelectItem value="Fiber optic">Fiber optic</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </FormSection>

          {/* Additional Services */}
          <FormSection
            title="Additional Services"
            isOpen={openSections.additional}
            onToggle={() => toggleSection('additional')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['onlineSecurity', 'onlineBackup', 'deviceProtection', 'techSupport', 'streamingTV', 'streamingMovies'].map((field) => (
                <FormField key={field} label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}>
                  <Select
                    value={formData[field as keyof CustomerData] as string}
                    onValueChange={(v) => setFormData({...formData, [field]: v})}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="No internet service">No internet service</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              ))}
            </div>
          </FormSection>

          {/* Billing */}
          <FormSection
            title="Billing"
            isOpen={openSections.billing}
            onToggle={() => toggleSection('billing')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Contract">
                <Select value={formData.contract} onValueChange={(v) => setFormData({...formData, contract: v})}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Month-to-month">Month-to-month</SelectItem>
                    <SelectItem value="One year">One year</SelectItem>
                    <SelectItem value="Two year">Two year</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Paperless Billing">
                <Select value={formData.paperlessBilling} onValueChange={(v) => setFormData({...formData, paperlessBilling: v})}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Payment Method" className="sm:col-span-2">
                <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({...formData, paymentMethod: v})}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronic check">Electronic check</SelectItem>
                    <SelectItem value="Mailed check">Mailed check</SelectItem>
                    <SelectItem value="Bank transfer (automatic)">Bank transfer (automatic)</SelectItem>
                    <SelectItem value="Credit card (automatic)">Credit card (automatic)</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </FormSection>

          {/* Usage Metrics */}
          <FormSection
            title="Usage Metrics"
            isOpen={openSections.usage}
            onToggle={() => toggleSection('usage')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label="Tenure (months)">
                <input
                  type="number"
                  value={formData.tenure}
                  onChange={(e) => setFormData({...formData, tenure: parseInt(e.target.value) || 0})}
                  className="w-full h-10 px-3 bg-slate-800/50 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                />
              </FormField>

              <FormField label="Monthly Charges ($)">
                <input
                  type="number"
                  value={formData.monthlyCharges}
                  onChange={(e) => setFormData({...formData, monthlyCharges: parseFloat(e.target.value) || 0})}
                  className="w-full h-10 px-3 bg-slate-800/50 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  step="0.01"
                />
              </FormField>

              <FormField label="Total Charges ($)">
                <input
                  type="number"
                  value={formData.totalCharges}
                  onChange={(e) => setFormData({...formData, totalCharges: parseFloat(e.target.value) || 0})}
                  className="w-full h-10 px-3 bg-slate-800/50 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  step="0.01"
                />
              </FormField>
            </div>
          </FormSection>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/30"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Predict Churn
          </Button>
          <Button
            type="button"
            onClick={handleResetForm}
            variant="outline"
            className="h-12 border-slate-700 text-slate-300 hover:bg-slate-800/50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}

function FormSection({
  title,
  isOpen,
  onToggle,
  children
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full flex items-center justify-between p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors group">
        <h3 className="font-semibold text-white">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-4"
        >
          {children}
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function FormField({
  label,
  children,
  className = ''
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="text-slate-300 text-sm mb-2 block">{label}</Label>
      {children}
    </div>
  );
}
