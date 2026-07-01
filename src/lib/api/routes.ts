export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export const API_ROUTES = {
  auth: {
    login:    API_BASE + '/api/auth/login',
    register: API_BASE + '/api/auth/register',
    logout:   API_BASE + '/api/auth/logout',
    session:  API_BASE + '/api/auth/session',
  },
  products:         API_BASE + '/api/products',
  product:    (id: string) => API_BASE + '/api/products/' + id,
  orders:           API_BASE + '/api/orders',
  order:      (id: string) => API_BASE + '/api/orders/' + id,
  orderStatus:(id: string) => API_BASE + '/api/orders/' + id + '/status',
  users:            API_BASE + '/api/users',
  user:       (id: string) => API_BASE + '/api/users/' + id,
  userPassword:(id: string) => API_BASE + '/api/users/' + id + '/password',
  testimonials:     API_BASE + '/api/testimonials',
  testimonial:(id: string) => API_BASE + '/api/testimonials/' + id,
  gallery:          API_BASE + '/api/gallery',
  contact:          API_BASE + '/api/contact',
  checkout:         API_BASE + '/api/checkout',
  auditLogs:        API_BASE + '/api/audit-logs',
  discounts:       API_BASE + '/api/discounts',
  media:           API_BASE + '/api/media',
  mediaUpload:     API_BASE + '/api/media/upload',
  mediaUploadBatch:API_BASE + '/api/media/upload/batch',
  mediaDelete: (key: string) => API_BASE + '/api/media/' + encodeURIComponent(key),
  galleryItem:     API_BASE + '/api/gallery',
  galleryItemById: (id: string) => API_BASE + '/api/gallery/' + id,
  health:          API_BASE + '/api/health',
} as const;

