import { useState } from 'react';
import { useRouter } from 'next/router';
import { useRegister } from '@/hooks/useAuth';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = useRegister();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { confirmPassword, ...registrationData } = formData;

    try {
      await registerMutation.mutateAsync(registrationData);
      router.push('/');
    } catch (error: any) {
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('Username')) {
          setErrors((prev) => ({ ...prev, username: error.response.data.message }));
        } else if (error.response.data.message.includes('Email')) {
          setErrors((prev) => ({ ...prev, email: error.response.data.message }));
        } else {
          setErrors((prev) => ({ ...prev, general: error.response.data.message }));
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const renderInput = (name: keyof typeof formData, label: string, type: string = 'text') => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={`w-full px-3 py-2 border ${
          errors[name] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
        value={formData[name]}
        onChange={handleChange}
      />
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Create an account</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {renderInput('firstName', 'First Name')}
          {renderInput('lastName', 'Last Name')}
          {renderInput('email', 'Email', 'email')}
          {renderInput('username', 'Username')}
          {renderInput('password', 'Password', 'password')}
          {renderInput('confirmPassword', 'Confirm Password', 'password')}

          {errors.general && <div className="text-red-500 text-sm text-center">{errors.general}</div>}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full px-4 py-2 border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all disabled:opacity-50"
          >
            {registerMutation.isPending ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
