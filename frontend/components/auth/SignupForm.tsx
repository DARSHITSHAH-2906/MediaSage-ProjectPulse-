import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Account created! Please log in.');
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.toString() || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full animate-fade-in">
      <div className="mb-6">
        <label className="block text-xs font-bold text-[#908fa0] uppercase tracking-widest pl-1 mb-2">Full Name</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]">person</span>
          <input
            {...register('name')}
            type="text"
            placeholder="Jane Doe"
            className={`w-full h-14 pl-12 pr-4 bg-[#1b1a26] border ${errors.name ? 'border-[#ffb4ab]' : 'border-[#464554]/40'} rounded-xl text-white placeholder-[#64748b] focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff] transition-all duration-200`}
          />
        </div>
        {errors.name && <p className="text-[#ffb4ab] text-xs font-medium mt-1 pl-1 flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: 14 }}>error</span> {errors.name.message}</p>}
      </div>

      <div className="mb-6">
        <label className="block text-xs font-bold text-[#908fa0] uppercase tracking-widest pl-1 mb-2">Email Address</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]">mail</span>
          <input
            {...register('email')}
            type="email"
            placeholder="name@company.com"
            className={`w-full h-14 pl-12 pr-4 bg-[#1b1a26] border ${errors.email ? 'border-[#ffb4ab]' : 'border-[#464554]/40'} rounded-xl text-white placeholder-[#64748b] focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff] transition-all duration-200`}
          />
        </div>
        {errors.email && <p className="text-[#ffb4ab] text-xs font-medium mt-1 pl-1 flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: 14 }}>error</span> {errors.email.message}</p>}
      </div>

      <div className="mb-8">
        <label className="block text-xs font-bold text-[#908fa0] uppercase tracking-widest pl-1 mb-2">Password</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]">lock</span>
          <input
            {...register('password')}
            type="password"
            placeholder="••••••••"
            className={`w-full h-14 pl-12 pr-4 bg-[#1b1a26] border ${errors.password ? 'border-[#ffb4ab]' : 'border-[#464554]/40'} rounded-xl text-white placeholder-[#64748b] focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff] transition-all duration-200`}
          />
        </div>
        {errors.password && <p className="text-[#ffb4ab] text-xs font-medium mt-1 pl-1 flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: 14 }}>error</span> {errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 mt-4 bg-linear-to-r from-[#8083ff] to-[#494bd6] hover:from-[#c0c1ff] hover:to-[#8083ff] text-white font-bold rounded-xl shadow-[0_4px_15px_rgba(128,131,255,0.25)] hover:shadow-[0_6px_20px_rgba(128,131,255,0.4)] hover:-translate-y transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? (
          <>
            <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
            <span>Creating...</span>
          </>
        ) : (
          <span>Create Account</span>
        )}
      </button>
    </form>
  );
}
