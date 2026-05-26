import api from './api'

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  user: {
    id: number
    name: string
    role: 'ADMIN' | 'RIDER' | 'CUSTOMER'
  }
}

// mock up
export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  await new Promise((res) => setTimeout(res, 500))

  if (data.email === 'admin@test.com' && data.password === '1234') {
    return {
      token: 'fake-jwt-token-123',
      user: {
        id: 1,
        name: 'Admin User',
        role: 'ADMIN',
      },
    }
  }

  throw new Error('Invalid credentials')
}

// wrapper (future backend ready)
export const authService = {
  login: loginApi,

  // example future use
  me: async () => {
    const res = await api.get('/auth/me')
    return res.data
  },
}
