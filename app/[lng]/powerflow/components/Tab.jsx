const Tab = ({ label, active, onClick }) => {
    return (
      <button
        type="button"
        className={`py-2 px-4 inline-flex items-center gap-2 bg-transparent text-md text-gray-500 hover:text-gray-700 font-medium rounded-md hover:text-unicgray-200 dark:text-gray-400 dark:hover:text-white dark:hover:text-gray-300
        ${active ? 'bg-white text-gray-700 dark:bg-gray-800 dark:text-white' : ''}`}
        onClick={onClick}
        role="tab"
        aria-controls={label}
      >
        {label}
      </button>
    );
  };

export default Tab;