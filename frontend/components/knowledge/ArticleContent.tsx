export default function ArticleContent() {
  return (
    <section className="max-w-4xl mx-auto px-6 -mt-16 pb-24 relative z-10">
      <div className="bg-[#0f1b33] border border-white/5 rounded-2xl p-8 md:p-10">

        <h2 className="text-2xl font-semibold mb-4">
          Securing Your First Round of Funding
        </h2>

        <p className="text-gray-300 mb-6">
          Raising capital is one of the most challenging aspects of building a startup.
          This guide will help you navigate the Ethiopian investment landscape.
        </p>

        {/* Types of Funding */}
        <h3 className="text-xl font-semibold mt-8 mb-3">Types of Funding</h3>

        <h4 className="font-semibold text-lg mt-4">Grants</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
          <li>Government innovation grants</li>
          <li>NGO-sponsored programs</li>
          <li>Competition prizes</li>
        </ul>

        <h4 className="font-semibold text-lg mt-6">Angel Investment</h4>
        <p className="text-gray-300 mt-2">
          Individual investors who provide capital in exchange for equity.
        </p>

        <h4 className="font-semibold text-lg mt-6">Venture Capital</h4>
        <p className="text-gray-300 mt-2">
          Professional investment firms focused on high-growth startups.
        </p>

        {/* Preparing Your Pitch */}
        <h3 className="text-xl font-semibold mt-10 mb-3">
          Preparing Your Pitch
        </h3>

        <h4 className="font-semibold mt-4">Essential Elements</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
          <li><strong>Problem Statement:</strong> Clearly define the problem</li>
          <li><strong>Solution:</strong> Explain your unique approach</li>
          <li><strong>Market Size:</strong> Demonstrate the opportunity</li>
          <li><strong>Business Model:</strong> Show how you’ll make money</li>
          <li><strong>Team:</strong> Highlight your expertise</li>
          <li><strong>Ask:</strong> Be specific about what you need</li>
        </ul>

        {/* Tips */}
        <h3 className="text-xl font-semibold mt-10 mb-3">
          Tips for Success
        </h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Practice your pitch extensively</li>
          <li>Know your numbers inside and out</li>
          <li>Be honest about risks</li>
          <li>Follow up professionally</li>
          <li>Build relationships early</li>
        </ul>

        {/* Mistakes */}
        <h3 className="text-xl font-semibold mt-10 mb-3">
          Common Mistakes to Avoid
        </h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Overvaluing your company</li>
          <li>Not understanding investors</li>
          <li>Ignoring legal considerations</li>
          <li>Giving up too much equity too early</li>
        </ul>
      </div>
    </section>
  );
}
