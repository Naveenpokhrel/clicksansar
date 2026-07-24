import React, { useState, useEffect } from 'react';
import { getTeam } from '../../services/api';
import TeamCard from '../../components/TeamCard/TeamCard';

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const data = await getTeam();
        setTeam(data);
      } catch (err) {
        console.error('Team page load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTeam();
  }, []);

  return (
    <div className="pt-32 pb-20 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Expert Team
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
          Meet Our Digital Gurus
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          We combine data, visuals, scripts, and code to engineer scalable conversions for our clients.
        </p>
      </section>

      {/* Team Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : team && team.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <TeamCard key={member._id} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-3xl">
            <p className="text-slate-400 text-sm">No team members found.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Team;
