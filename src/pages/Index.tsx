
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Medical Analytics Dashboard</h1>
        <p className="text-xl text-gray-600 mb-6">
          Comprehensive analytics for medical practices and clinics
        </p>
        <Link to="/analytics">
          <Button className="bg-orange-500 hover:bg-orange-600">
            View Analytics Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
