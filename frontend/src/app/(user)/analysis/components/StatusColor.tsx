
 
 export  type StatusType = "Strong" | "Good" | "Weak";
  
export  const getStatusColor = (status: StatusType): string => {
    switch (status) {
      case "Strong":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "Good":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Weak":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };