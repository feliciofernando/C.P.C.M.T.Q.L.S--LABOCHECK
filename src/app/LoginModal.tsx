'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2, LogIn, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Credenciais invalidas');
      } else {
        toast.success('Sessao iniciada com sucesso');
        onOpenChange(false);
        setUsername('');
        setPassword('');
      }
    } catch {
      toast.error('Erro ao iniciar sessao');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#1a5c2e]">
            <ShieldCheck className="w-5 h-5" />
            Acesso Administrativo
          </DialogTitle>
          <DialogDescription>
            Introduza as suas credenciais para aceder ao painel de gestao.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="admin-user">Utilizador</Label>
            <Input
              id="admin-user"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Utilizador"
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-pass">Palavra-passe</Label>
            <Input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Palavra-passe"
              autoComplete="current-password"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4 mr-2" />
            )}
            {loading ? 'A verificar...' : 'Entrar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
