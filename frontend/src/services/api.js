const BASE = '/api/v1'

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Error desconocido' }))
    throw new Error(err.detail || err.error || JSON.stringify(err))
  }
  return res.status === 204 ? null : res.json()
}

export const motosApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/motos/${q ? '?' + q : ''}`)
  },
  get: (pk) => request(`/motos/${pk}/`),
}

export const clientesApi = {
  create: (data) => request('/clientes/', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/clientes/login/', { method: 'POST', body: JSON.stringify(data) }),
  get: (pk) => request(`/clientes/${pk}/`),
}

export const citasApi = {
  list: (cliente_id) => request(`/citas/?cliente_id=${cliente_id}`),
  create: (data) => request('/citas/', { method: 'POST', body: JSON.stringify(data) }),
  cancelar: (pk) => request(`/citas/${pk}/cancelar/`, { method: 'PATCH', body: JSON.stringify({}) }),
}

export const pedidosApi = {
  list: (cliente_id) => request(`/pedidos/?cliente_id=${cliente_id}`),
  create: (data) => request('/pedidos/', { method: 'POST', body: JSON.stringify(data) }),
  get: (pk) => request(`/pedidos/${pk}/`),
  cambiarEstado: (pk, estado) => request(`/pedidos/${pk}/estado/`, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  }),
}

export const pagosApi = {
  list: (cliente_id) => request(`/pagos/?cliente_id=${cliente_id}`),
  get: (pk) => request(`/pagos/${pk}/`),
  iniciar: (data) => request('/pagos/iniciar/', { method: 'POST', body: JSON.stringify(data) }),
  confirmarRetorno: (data) => request('/pagos/confirmar-retorno/', { method: 'POST', body: JSON.stringify(data) }),
}
