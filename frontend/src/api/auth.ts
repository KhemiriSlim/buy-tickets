export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to login");
  }

  return data.token;
}

export async function register(name: string, email: string, password: string): Promise<void> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name,email, password }),
  });
  const data = await res.json();
  if(!res.ok){
    throw new Error(data.error ?? "Failed to register")
  }


}