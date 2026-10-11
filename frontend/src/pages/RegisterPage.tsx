import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import type { FormEvent } from 'react'
function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try{
            await register(name, email, password)
            navigate('/login')
        }catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

  return (
  <main className="flex min-h-screen items-center justify-center p-4">
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div>
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          register in to buy tickets
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  </main>
)
}

export default RegisterPage