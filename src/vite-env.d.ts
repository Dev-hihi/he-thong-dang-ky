/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_KEY: string
    // Bạn có thể khai báo thêm các biến môi trường khác ở đây nếu cần
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}