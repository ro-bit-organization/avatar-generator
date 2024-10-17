type Props = Readonly<{
	children: React.ReactNode;
}>;

export default function GenerateLayout({ children }: Props) {
	return <main className="flex min-h-[750px] flex-1 p-4">{children}</main>;
}
