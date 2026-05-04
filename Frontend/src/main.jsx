import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import App from './app/App.jsx'
import { store } from './app/App.store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
) 
  


