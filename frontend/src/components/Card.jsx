const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-xs p-6 border-1 border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export default Card;