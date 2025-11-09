import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AuthForms from '@/components/AuthForms';

interface LoginSignupProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIsSignUp?: boolean;
}

const LoginSignup: React.FC<LoginSignupProps> = ({ isOpen, onClose, defaultIsSignUp = false }) => {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">
            <span className="text-raahi-orange">R</span>aahi Account
          </DialogTitle>
        </DialogHeader>
        
        <AuthForms onSuccess={handleSuccess} defaultIsSignUp={defaultIsSignUp} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginSignup;
