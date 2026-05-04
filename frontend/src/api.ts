import type { ResumeData } from "./resume-types";

const API_URL = "/api";

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

export async function login(email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    localStorage.setItem('token', data.token);
    localStorage.setItem('user_email', email);
    return data;
  } catch (err: any) {
    // Fallback: check localStorage users db
    const users: any[] = JSON.parse(localStorage.getItem('smartcv_users') || '[]');
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid email or password");
    const token = btoa(email);
    localStorage.setItem('token', token);
    localStorage.setItem('user_email', email);
    return { success: true, token, user };
  }
}

export async function register(email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    localStorage.setItem('token', data.token);
    localStorage.setItem('user_email', email);
    return data;
  } catch (err: any) {
    // Fallback: save to localStorage users db
    const users: any[] = JSON.parse(localStorage.getItem('smartcv_users') || '[]');
    if (users.find((u) => u.email === email)) throw new Error("User already exists");
    const newUser = { id: Date.now().toString(), email, password };
    users.push(newUser);
    localStorage.setItem('smartcv_users', JSON.stringify(users));
    const token = btoa(email);
    localStorage.setItem('token', token);
    localStorage.setItem('user_email', email);
    return { success: true, token, user: newUser };
  }
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

export async function fetchResumes(): Promise<ResumeData[]> {
  try {
    const res = await fetch(`${API_URL}/resumes`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch (e) {
    const local = localStorage.getItem("smartcv_resumes");
    return local ? JSON.parse(local) : [];
  }
}

export async function saveResume(resume: ResumeData): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/resumes`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(resume),
    });
    if (!res.ok) throw new Error("Failed to save to backend");
  } catch (e) {
    const local = localStorage.getItem("smartcv_resumes");
    const data: ResumeData[] = local ? JSON.parse(local) : [];
    const idx = data.findIndex(r => r.id === resume.id);
    if (idx >= 0) data[idx] = resume;
    else data.push(resume);
    localStorage.setItem("smartcv_resumes", JSON.stringify(data));
  }
}

export async function deleteResume(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/resumes/${id}`, { method: "DELETE", headers: getHeaders() });
    if (!res.ok) throw new Error("Failed");
  } catch (e) {
    const local = localStorage.getItem("smartcv_resumes");
    if (local) {
      const data: ResumeData[] = JSON.parse(local);
      localStorage.setItem("smartcv_resumes", JSON.stringify(data.filter(r => r.id !== id)));
    }
  }
}
