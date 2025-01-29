import { BrowserRouter , Routes , Route} from "react-router-dom";
import { LoginPage,SignupPage,HomePage } from "./Routes.jsx";
import "./App.css"
function App (){
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
    
    </Routes>
    </BrowserRouter>
  )
}
export default App;