import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './store/store';
import './index.css'; // Import Tailwind directives first
import './App.css'; // Then import custom styles
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App/>
    </Provider>
)
