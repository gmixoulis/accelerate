const Tabs = ({children}) => {

  return (
    <>
     <div className="flex">
      <div className="flex p-1 transition bg-gray-200 border border-gray-300 rounded-md shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600">
        <nav className="flex space-x-2" aria-label="Tabs" role="tablist">
          {children}
        </nav>
      </div>
    </div>

    </>
  );
};

export default Tabs;