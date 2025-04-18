import { Link } from 'react-router-dom';

const MockOptions = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-teal mb-12">
          Mock Options
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link to="/mock" className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl text-center">
            <h2 className="text-2xl font-semibold mb-2 text-teal">Surprise Me</h2>
            <p>A random combination of cases - 2 clinical, 2 management, and 2 portfolio. Images + PDF pop up.</p>
          </Link>
          <Link to="/mock" className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl text-center">
            <h2 className="text-2xl font-semibold mb-2 text-teal">Design Circuit</h2>
            <p>You can choose the cases and make a mock.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MockOptions; 