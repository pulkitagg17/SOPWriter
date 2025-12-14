export default function PageContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    return <main className="mx-auto max-w-2xl px-6 py-12">{children}</main>;
}
