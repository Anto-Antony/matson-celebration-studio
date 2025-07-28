const Loading: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-xl"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-lg"></div>
                <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-2xl"></div>
            </div>

            <div className="backdrop-blur-md bg-white/30 rounded-3xl p-8 border border-white/20 shadow-xl relative z-10">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium">
                        Loading your wedding story...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Loading;
