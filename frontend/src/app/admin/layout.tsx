// Admin route — cancel the root layout's pt-20 since navbar is hidden here
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="-mt-20">{children}</div>;
}
