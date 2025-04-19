
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import AuthForms from '@/components/AuthForms';

interface LoginSignupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginSignup: React.FC<LoginSignupProps> = ({ isOpen, onClose }) => {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-raahi-blue">
            <span className="text-raahi-orange">R</span>aahi Account
          </DialogTitle>
        </DialogHeader>
        
        <AuthForms onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginSignup;
