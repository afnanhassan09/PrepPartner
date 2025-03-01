import { Link } from 'react-router-dom';

const PracticeOptions = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-teal mb-12">
          Choose Your Practice Area
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Link to="/interview" className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl text-center">
            <h2 className="text-2xl font-semibold mb-2 text-teal">Clinical</h2>
          </Link>
          <Link to="/interview" className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl text-center">
            <h2 className="text-2xl font-semibold mb-2 text-teal">Management</h2>
          </Link>
          <Link to="/interview" className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl text-center">
            <h2 className="text-2xl font-semibold mb-2 text-teal">Portfolio</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PracticeOptions; 