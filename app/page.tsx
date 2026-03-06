import SearchForm from "@/components/SearchForm";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">AI 여행 일정 플래너</h1>
      <SearchForm />
    </main>
  );
}
