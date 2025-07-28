import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface AddNewPartnerFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function AddNewPartnerForm({ onSuccess, onClose }: AddNewPartnerFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create user in Supabase Auth
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (userError || !userData?.user?.id) throw userError || new Error('User creation failed');
      const partner_id = userData.user.id;
      // 2. Insert into partner_profile
      const { error: profileError } = await supabase.from('partner_profile').insert({
        partner_id,
        name,
        email,
        phone_number: phone,
        location,
      });
      if (profileError) throw profileError;
      toast({ title: 'Success', description: 'Partner created successfully!' });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to create partner', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-100 rounded-lg">
            <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0H3z"></path>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add New Partner</h2>
            <p className="text-sm text-gray-600">Create a new partner account on the platform</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              minLength={2}
              placeholder="Enter partner's full name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="partner@example.com"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              required 
              minLength={8}
              placeholder="+1 (555) 123-4567"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Location <span className="text-red-500">*</span>
            </label>
            <Input 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              required 
              minLength={2}
              placeholder="City, State"
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <Input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            minLength={6}
            placeholder="Minimum 6 characters"
            className="w-full"
          />
          <p className="text-xs text-gray-500">This will be the partner's login password</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>Create Partner</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
