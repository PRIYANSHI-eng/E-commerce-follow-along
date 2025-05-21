const styles = {
  // Layout
  container: "w-11/12 mx-auto px-4 sm:px-6 lg:px-8",
  customContainer: "w-11/12 hidden sm:block",
  section: "w-11/12 mx-auto py-8",
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexColumn: "flex flex-col",
  normalFlex: "flex items-center", // Fixed typo from 'noramlFlex'
  
  // Typography
  heading: "text-2xl md:text-3xl font-semibold text-center md:text-start pb-5 text-gray-800",
  subheading: "text-xl font-medium text-gray-700 mb-4",
  paragraph: "text-base text-gray-600 leading-relaxed",
  
  // Product Elements
  productTitle: "text-2xl font-semibold text-gray-800",
  productDescription: "text-sm text-gray-600 mt-2",
  productPrice: "text-lg font-bold text-gray-900",
  productDiscountPrice: "font-bold text-lg text-gray-800",
  price: "font-medium text-base text-red-500 pl-3 line-through",
  shopName: "pt-3 text-sm text-blue-500 pb-3",
  
  // UI Elements
  activeIndicator: "absolute bottom-[-27%] left-0 h-[3px] w-full bg-primary-600",
  button: "w-36 bg-primary-600 hover:bg-primary-700 text-white h-12 my-3 flex items-center justify-center rounded-lg cursor-pointer transition-colors duration-200",
  secondaryButton: "w-36 bg-gray-200 hover:bg-gray-300 text-gray-800 h-12 my-3 flex items-center justify-center rounded-lg cursor-pointer transition-colors duration-200",
  cartButton: "px-5 h-10 rounded-full bg-primary-600 hover:bg-primary-700 flex items-center justify-center cursor-pointer transition-colors duration-200",
  cartButtonText: "text-white text-sm font-semibold",
  
  // Form Elements
  input: "w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent",
  label: "block text-sm font-medium text-gray-700 mb-1",
  formGroup: "mb-4",
  
  // Status Indicators
  activeStatus: "w-2.5 h-2.5 rounded-full absolute top-0 right-1 bg-green-500",
  inactiveStatus: "w-2.5 h-2.5 rounded-full absolute top-0 right-1 bg-red-500",
  
  // Cards
  card: "bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg",
  productCard: "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
  
  // Animations
  fadeIn: "animate-fade-in",
};
  
export default styles;