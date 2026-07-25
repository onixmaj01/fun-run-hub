'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using public environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Dashboard() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProofs() {
      try {
        const { data, error } = await supabase.storage.from('proofs').list();
        if (error) {
          console.error('Error fetching proofs:', error);
        } else if (data) {
          // Map public URLs for each file in the proofs bucket
          const filesWithUrls = data.map((file) => {
            const { data: publicUrlData } = supabase.storage
              .from('proofs')
              .getPublicUrl(file.name);
            return {
              ...file,
              publicUrl: publicUrlData.publicUrl,
            };
          });
          setProofs(filesWithUrls);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProofs();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-emerald-400">📊 Fun Run Hub Dashboard</h1>
          <p className="text-slate-400 mt-1">Operational monitoring and automated visual verification proofs.</p>
        </header>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading captured proofs from storage...</div>
        ) : proofs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
            <p className="text-slate-400">No visual proofs detected in the Supabase storage bucket yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proofs.map((file) => (
              <div key={file.id || file.name} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
                <div className="p-4 bg-slate-900 border-b border-slate-800">
                  <h2 className="font-semibold text-slate-200 truncate" title={file.name}>{file.name}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Updated: {new Date(file.updated_at || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 flex-1 bg-slate-950 flex items-center justify-center">
                  <img
                    src={file.publicUrl}
                    alt={file.name}
                    className="rounded-lg object-contain max-h-48 w-full border border-slate-800"
                  />
                </div>
                <div className="p-4 border-t border-slate-800 bg-slate-900">
                  <a
                    href={file.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-2 rounded-lg inline-block w-full text-center transition-colors"
                  >
                    View Full Size Image
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}