import { fetchDistractions } from '@/lib/coda';
import MasonryGrid from '@/components/MasonryGrid';

export default async function Home() {
  let distractions = [];
  let error = null;

  try {
    distractions = await fetchDistractions();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load distractions';
    console.error('Error fetching distractions:', e);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Distractions</h1>
        <p className="text-gray-600">
          {distractions.length} regular browsing spots
        </p>
      </header>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">Error loading distractions</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <MasonryGrid distractions={distractions} />
      )}
    </main>
  );
}